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

/* Decisões tomadas na tela falsa de pagamento.

   Antes o pagamento se aprovava sozinho depois de alguns segundos, o que
   deixava a simulação com uma tela a menos que a produção: na vida real a
   pessoa sai do site, paga na página do provedor e volta. Agora a decisão é
   explícita, e dá para testar também a recusa e a desistência.

   Fica em globalThis para sobreviver ao recarregamento de módulo que o
   servidor de desenvolvimento faz a cada requisição. */
const decisoes = globalThis.__begoniaDecisoesSimuladas || (globalThis.__begoniaDecisoesSimuladas = new Map());

function registrarDecisao(idGateway, decisao) {
  exigirDesenvolvimento();
  decisoes.set(String(idGateway), decisao === "recusar" ? "rejected" : "approved");
  console.log("[simulado] pagamento %s marcado como %s", idGateway, decisao);
}

/* Manda para a tela falsa de pagamento — o equivalente, na simulação, à
   página do provedor. */
function paraTelaDePagamento({ referencia, pedido, metodo, urlSite }) {
  const idGateway = montarId(referencia);
  console.log("[simulado] pagamento %s criado para o pedido %s (%s)", idGateway, referencia, pedido.total);

  const parametros = new URLSearchParams({
    ref: referencia,
    id: idGateway,
    total: String(pedido.total),
    metodo: metodo || "checkout",
  });

  return {
    tipo: "redirecionamento",
    idGateway,
    url: `${urlSite}/pagamento-simulado.html?${parametros}`,
    simulado: true,
  };
}

async function criarPagamentoPix(args) {
  exigirDesenvolvimento();
  return paraTelaDePagamento({ ...args, metodo: "pix" });
}

async function criarPagamentoCartao(args) {
  exigirDesenvolvimento();
  return paraTelaDePagamento(args);
}

async function consultarPagamento(idPagamento) {
  exigirDesenvolvimento();
  const dados = lerId(idPagamento);
  if (!dados) throw new Error(`Identificador simulado inválido: ${idPagamento}`);

  // Sem decisão registrada, o pagamento está pendente: a pessoa ainda não
  // clicou nada na tela falsa.
  const bruto = decisoes.get(String(idPagamento)) || "pending";
  const passou = bruto === "approved";

  return {
    idGateway: String(idPagamento),
    referencia: dados.referencia,
    status: traduzirStatus(bruto),
    statusOriginal: bruto,
    detalheStatus:
      bruto === "approved" ? "accredited" : bruto === "rejected" ? "cc_rejected_other_reason" : "pending_waiting_payment",
    // O valor real vem do nosso próprio registro do pedido; devolvemos null
    // para a conferência de valor do webhook não reprovar a simulação.
    valor: null,
    metodo: "simulado",
    tipoMetodo: "simulado",
    pagoEm: passou ? new Date().toISOString() : null,
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
  registrarDecisao,
  extrairNotificacao,
  criarPagamentoUnico: (args) => module.exports.criarPagamentoCartao(args),
  criarPagamentoCartao,
  criarPagamentoPix,
  consultarPagamento,
  validarWebhook,
  traduzirStatus,
};
