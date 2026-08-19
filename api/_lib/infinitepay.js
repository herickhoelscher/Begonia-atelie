/* =========================================================================
   Begônia Ateliê — implementação do gateway com InfinitePay.

   Diferenças importantes em relação ao Mercado Pago, todas tratadas aqui
   dentro para o resto do backend não precisar saber:

   1. Um link só serve Pix e crédito. Não dá para forçar uma forma de
      pagamento pela API, então quem escolhe é o cliente, na página deles.
      Por isso o checkout do site não mostra seletor de forma de pagamento
      quando este gateway está ativo.
   2. Não há cartão de débito no checkout online deles.
   3. Não há cabeçalho de autenticação: a conta é identificada pelo `handle`
      (a InfiniteTag, que é pública). Isso muda o modelo de segurança — ver
      o bloco "Como confiamos num webhook sem assinatura", mais abaixo.
   4. O Pix é pago na página deles, não com QR desenhado no nosso site.

   Valores trafegam em CENTAVOS na API da InfinitePay. A conversão acontece
   só aqui, na borda.
   ========================================================================= */

const BASE = "https://api.checkout.infinitepay.io";

/* Capacidades declaradas: o resto do sistema lê isto em vez de perguntar
   "qual é o gateway?" em cada lugar. */
const capacidades = {
  rotulo: "InfinitePay",
  metodos: ["pix", "cartao"], // sem débito
  escolhaNoGateway: true, // o cliente escolhe Pix ou cartão na página deles
  pixInline: false, // não devolvemos QR para desenhar
  exigeCpf: false, // a InfinitePay coleta o que precisa
  assinaWebhook: false, // ver o bloco abaixo
};

/* Lê a notificação no formato da InfinitePay: sem campo "type", os
   identificadores vêm soltos na raiz do corpo. */
function extrairNotificacao({ corpo }) {
  const orderNsu = corpo && corpo.order_nsu;
  const transactionNsu = corpo && corpo.transaction_nsu;
  return {
    ehPagamento: Boolean(orderNsu && transactionNsu),
    idRecurso: orderNsu ? String(orderNsu) : null,
    motivo: "webhook-sem-order_nsu-ou-transaction_nsu",
  };
}

function handle() {
  const h = process.env.INFINITEPAY_HANDLE;
  if (!h) throw new Error("INFINITEPAY_HANDLE não está definido nas variáveis de ambiente.");
  return h.replace(/^\$/, ""); // a InfiniteTag é usada sem o cifrão
}

async function chamar(caminho, corpo) {
  const resposta = await fetch(`${BASE}${caminho}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });

  const texto = await resposta.text();
  let dados = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = { bruto: texto };
  }

  if (!resposta.ok) {
    console.error("[infinitepay] POST %s -> %s %s", caminho, resposta.status, texto.slice(0, 500));
    const e = new Error((dados && (dados.message || dados.error)) || `InfinitePay respondeu ${resposta.status}`);
    e.status = resposta.status;
    e.detalhes = dados;
    throw e;
  }
  return dados;
}

const emCentavos = (reais) => Math.round(Number(reais) * 100);
const emReais = (centavos) => Math.round(Number(centavos)) / 100;

/* -------------------------------------------------------------------------
   Identificador composto

   O payment_check da InfinitePay exige quatro coisas: handle, order_nsu,
   transaction_nsu e slug. Nossa interface de gateway passa um id só, então
   empacotamos os três que variam num texto e desempacotamos na consulta.

   O transaction_nsu só existe DEPOIS do pagamento — ele chega no webhook.
   Antes disso o campo fica vazio, e a consulta devolve "pendente" sem
   chamar a API (não há o que consultar ainda).
   ------------------------------------------------------------------------- */
function montarId({ slug, transactionNsu, orderNsu }) {
  return [slug || "", transactionNsu || "", orderNsu || ""].join("|");
}

function lerId(id) {
  const [slug, transactionNsu, orderNsu] = String(id).split("|");
  return { slug: slug || null, transactionNsu: transactionNsu || null, orderNsu: orderNsu || null };
}

/* O slug da fatura aparece no fim da URL devolvida. Guardamos porque o
   payment_check precisa dele. */
function slugDaUrl(url) {
  try {
    const partes = new URL(url).pathname.split("/").filter(Boolean);
    return partes[partes.length - 1] || null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------
   Criação da cobrança

   Um link só, que abre Pix e crédito. Como não dá para separar, as duas
   funções da interface caem aqui.
   ------------------------------------------------------------------------- */
async function criarPagamentoUnico({ referencia, pedido, cliente, urlSite }) {
  const itens = pedido.itens.map((i) => ({
    quantity: i.quantidade,
    price: emCentavos(i.precoUnitario), // centavos
    description: i.nome,
  }));
  if (pedido.frete > 0) {
    itens.push({ quantity: 1, price: emCentavos(pedido.frete), description: "Frete" });
  }

  const resposta = await chamar("/links", {
    handle: handle(),
    // order_nsu é a NOSSA referência. Ela é aleatória e não adivinhável, e
    // é por ela que o webhook é amarrado a um pedido real.
    order_nsu: referencia,
    redirect_url: `${urlSite}/pedido.html?ref=${referencia}`,
    webhook_url: `${urlSite}/api/webhook`,
    items: itens,
    customer: {
      name: cliente.nome,
      email: cliente.email,
      phone_number: cliente.whatsapp,
    },
  });

  const url = resposta && resposta.url;
  if (!url) {
    throw new Error("InfinitePay não devolveu a URL do checkout.");
  }

  return {
    tipo: "redirecionamento",
    idGateway: montarId({ slug: slugDaUrl(url), orderNsu: referencia }),
    url,
  };
}

// A InfinitePay não separa Pix de cartão: o mesmo link serve os dois.
const criarPagamentoPix = criarPagamentoUnico;
const criarPagamentoCartao = criarPagamentoUnico;

/* -------------------------------------------------------------------------
   Consulta de status
   ------------------------------------------------------------------------- */
async function consultarPagamento(idPagamento) {
  const { slug, transactionNsu, orderNsu } = lerId(idPagamento);

  // Sem transaction_nsu não há transação para consultar: o cliente ainda não
  // pagou, ou o webhook ainda não chegou. Responder "pendente" aqui evita
  // uma chamada inútil e mantém a tela do pedido girando.
  if (!transactionNsu) {
    return {
      idGateway: String(idPagamento),
      referencia: orderNsu,
      status: "pendente",
      statusOriginal: "sem_transacao",
      detalheStatus: "aguardando o pagamento na página da InfinitePay",
      valor: null,
      metodo: null,
      tipoMetodo: null,
      pagoEm: null,
      cartaoFinal: null,
    };
  }

  const dados = await chamar("/payment_check", {
    handle: handle(),
    order_nsu: orderNsu,
    transaction_nsu: transactionNsu,
    slug,
  });

  const pago = Boolean(dados && dados.success && dados.paid);
  return {
    idGateway: String(idPagamento),
    referencia: orderNsu,
    status: pago ? "aprovado" : "pendente",
    statusOriginal: pago ? "paid" : "unpaid",
    detalheStatus: null,
    // A InfinitePay responde em centavos. `amount` é o valor do pedido;
    // `paid_amount` inclui o juro de parcelamento pago pelo comprador, então
    // é `amount` que tem de bater com o nosso total.
    valor: dados && dados.amount != null ? emReais(dados.amount) : null,
    metodo: (dados && dados.capture_method) || null,
    tipoMetodo: (dados && dados.capture_method) || null,
    parcelas: (dados && dados.installments) || null,
    pagoEm: pago ? new Date().toISOString() : null,
    cartaoFinal: null,
  };
}

/* -------------------------------------------------------------------------
   Como confiamos num webhook sem assinatura

   A InfinitePay não assina a notificação. Sozinho, o POST do webhook não
   prova nada: qualquer pessoa que descobrisse a URL poderia mandar
   "pagamento aprovado".

   O que segura isso são três conferências, nesta ordem:

   1. O `order_nsu` recebido tem de existir no NOSSO histórico. Ele é a
      referência que geramos (BA + 8 caracteres de um alfabeto de 32), não é
      adivinhável e não é público.
   2. O pagamento é reconsultado no `payment_check` da InfinitePay. Um
      webhook forjado não consegue fazer a API deles responder `paid: true`.
   3. O valor devolvido pela consulta tem de bater com o total que o servidor
      calculou. Isso impede alguém de pagar R$ 1 de verdade e tentar amarrar
      esse comprovante a um pedido de R$ 500.

   As três já estão implementadas em api/webhook.js e valem para qualquer
   gateway. É por isso que a ausência de assinatura, aqui, é uma camada a
   menos e não um buraco.
   ------------------------------------------------------------------------- */
function validarWebhook({ corpo }) {
  const orderNsu = corpo && corpo.order_nsu;
  const transactionNsu = corpo && corpo.transaction_nsu;

  if (!orderNsu || !transactionNsu) {
    return { valido: false, motivo: "webhook-sem-identificadores" };
  }
  // O formato da referência é conferido aqui; se existe mesmo, quem decide é
  // o webhook, consultando o histórico.
  if (!/^BA-[A-Z2-9]{8}$/.test(String(orderNsu))) {
    return { valido: false, motivo: "order_nsu-fora-do-formato" };
  }
  // Sem assinatura para verificar: a confirmação real vem do payment_check,
  // que o webhook chama logo em seguida.
  return {
    valido: true,
    // Devolve o id composto para o webhook conseguir consultar a transação.
    idGateway: montarId({
      slug: corpo.invoice_slug,
      transactionNsu,
      orderNsu,
    }),
  };
}

function traduzirStatus(status) {
  return status === "paid" ? "aprovado" : status === "refused" ? "recusado" : "pendente";
}

module.exports = {
  nome: "infinitepay",
  capacidades,
  extrairNotificacao,
  criarPagamentoUnico,
  criarPagamentoCartao,
  criarPagamentoPix,
  consultarPagamento,
  validarWebhook,
  traduzirStatus,
};
