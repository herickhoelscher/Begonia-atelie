/* =========================================================================
   Begônia Ateliê — gateway SIMULADO, só para desenvolvimento.

   Existe para você conseguir percorrer o checkout inteiro — Pix, cartão,
   aprovação, e-mail para a dona — sem ter conta no Mercado Pago e sem
   cobrar um centavo de ninguém.

   Como funciona: o pagamento é aprovado sozinho depois de alguns segundos.
   O identificador carrega a hora de criação e a referência do pedido, então
   não precisamos guardar estado em lugar nenhum.

   Para ligar:   GATEWAY=simulado   no .env.local
   Este arquivo se recusa a rodar em produção. Ver a trava logo abaixo.
   ========================================================================= */

const ATRASO_SEGUNDOS = Number(process.env.SIMULADO_ATRASO_SEGUNDOS || 12);

/* Imita as capacidades do gateway que estiver configurado de verdade, para o
   modo de teste se parecer com produção. Por padrão imita o Mercado Pago. */
const imitandoInfinitePay = process.env.SIMULADO_IMITA === "infinitepay";

const capacidades = {
  // Em teste, usa o nome do gateway imitado: a tela fica igual à de produção.
  rotulo: imitandoInfinitePay ? "InfinitePay" : "Mercado Pago",
  // A InfinitePay não tem débito no checkout online; o Mercado Pago tem.
  metodos: imitandoInfinitePay ? ["pix", "cartao"] : ["pix", "cartao", "debito"],
  escolhaNoGateway: process.env.SIMULADO_IMITA === "infinitepay",
  pixInline: process.env.SIMULADO_IMITA !== "infinitepay",
  exigeCpf: process.env.SIMULADO_IMITA !== "infinitepay",
  assinaWebhook: false,
};

function extrairNotificacao({ corpo, query }) {
  const tipo = (corpo && corpo.type) || query.get("type");
  const id = (corpo && corpo.data && corpo.data.id) || query.get("data.id");
  return {
    ehPagamento: tipo === "payment" && Boolean(id),
    idRecurso: id ? String(id) : null,
    motivo: `tipo:${tipo || "desconhecido"}`,
  };
}

/* Trava: nenhuma venda de verdade pode passar por aqui. */
function exigirDesenvolvimento() {
  const ehProducao =
    process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (ehProducao && process.env.SIMULADO_EU_SEI_O_QUE_ESTOU_FAZENDO !== "sim") {
    throw new Error(
      "GATEWAY=simulado está ativo em produção. Nenhum pagamento seria cobrado de verdade. " +
        "Troque para GATEWAY=mercadopago e configure MP_ACCESS_TOKEN."
    );
  }
}

/* id = SIM-<hora de criação>-<referência do pedido> */
function montarId(referencia) {
  return `SIM-${Date.now()}-${referencia}`;
}

function lerId(id) {
  const partes = String(id).split("-");
  // SIM, timestamp, BA, sufixo
  if (partes[0] !== "SIM" || partes.length < 4) return null;
  return {
    criadoEm: Number(partes[1]),
    referencia: partes.slice(2).join("-"),
  };
}

function traduzirStatus(status) {
  return status === "approved" ? "aprovado" : status === "rejected" ? "recusado" : "pendente";
}

/* Depois do atraso, dispara o nosso próprio webhook — assim o caminho de
   confirmação e o e-mail para a dona são exercitados de verdade, e não só
   o polling da tela. Só funciona em processo longo (o dev-server). */
function agendarWebhook(idGateway, urlSite) {
  const disparar = async () => {
    try {
      await fetch(`${urlSite}/api/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-simulado": idGateway },
        body: JSON.stringify({ type: "payment", data: { id: idGateway } }),
      });
      console.log("[simulado] webhook disparado para %s", idGateway);
    } catch (e) {
      console.warn("[simulado] não consegui disparar o webhook:", e.message);
    }
  };
  const t = setTimeout(disparar, (ATRASO_SEGUNDOS + 1) * 1000);
  if (typeof t.unref === "function") t.unref();
}

async function criarPagamentoPix({ referencia, pedido, urlSite }) {
  exigirDesenvolvimento();
  const idGateway = montarId(referencia);
  agendarWebhook(idGateway, urlSite);

  console.log(
    "[simulado] Pix de %s para o pedido %s — aprova sozinho em %ss",
    pedido.total,
    referencia,
    ATRASO_SEGUNDOS
  );

  return {
    tipo: "pix",
    idGateway,
    status: "pendente",
    // Copia-e-cola falso, com o aviso escrito dentro: ninguém paga isso por engano.
    qrCodeTexto: `00020126SIMULADO-NAO-E-UM-PIX-DE-VERDADE-${referencia}-VALOR-${pedido.total.toFixed(2)}6304TEST`,
    qrCodeImagem: null, // sem QR: a tela mostra só o copia-e-cola
    expiraEm: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    simulado: true,
  };
}

async function criarPagamentoCartao({ referencia, pedido, metodo, urlSite }) {
  exigirDesenvolvimento();
  const idGateway = montarId(referencia);
  agendarWebhook(idGateway, urlSite);

  console.log(
    "[simulado] %s de %s para o pedido %s — aprova sozinho em %ss",
    metodo,
    pedido.total,
    referencia,
    ATRASO_SEGUNDOS
  );

  return {
    tipo: "redirecionamento",
    idGateway,
    // Em vez do ambiente do Mercado Pago, vai direto para a tela de
    // acompanhamento — que é onde a pessoa cairia depois de pagar.
    url: `${urlSite}/pedido.html?ref=${referencia}`,
    simulado: true,
  };
}

async function consultarPagamento(idPagamento) {
  exigirDesenvolvimento();
  const dados = lerId(idPagamento);
  if (!dados) throw new Error(`Identificador simulado inválido: ${idPagamento}`);

  const passou = (Date.now() - dados.criadoEm) / 1000 >= ATRASO_SEGUNDOS;
  const bruto = passou ? "approved" : "pending";

  return {
    idGateway: String(idPagamento),
    referencia: dados.referencia,
    status: traduzirStatus(bruto),
    statusOriginal: bruto,
    detalheStatus: passou ? "accredited" : "pending_waiting_transfer",
    // O valor real vem do nosso próprio registro do pedido; devolvemos null
    // para a conferência de valor do webhook não reprovar a simulação.
    valor: null,
    metodo: "simulado",
    tipoMetodo: "simulado",
    pagoEm: passou ? new Date(dados.criadoEm + ATRASO_SEGUNDOS * 1000).toISOString() : null,
    cartaoFinal: null,
    simulado: true,
  };
}

/* Sem HMAC aqui: a notificação simulada é reconhecida pelo cabeçalho que o
   próprio simulador põe. Isto NUNCA vale para o Mercado Pago de verdade. */
function validarWebhook({ cabecalhos, idRecurso }) {
  exigirDesenvolvimento();
  if (cabecalhos["x-simulado"] === String(idRecurso)) return { valido: true };
  return { valido: false, motivo: "nao-veio-do-simulador" };
}

module.exports = {
  nome: "simulado",
  capacidades,
  extrairNotificacao,
  criarPagamentoUnico: (args) => module.exports.criarPagamentoCartao(args),
  criarPagamentoCartao,
  criarPagamentoPix,
  consultarPagamento,
  validarWebhook,
  traduzirStatus,
};
