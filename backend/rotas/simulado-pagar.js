/* =========================================================================
   POST /api/simulado-pagar        (SÓ DESENVOLVIMENTO)

   É o botão "pagar" da tela falsa de pagamento. Registra a decisão do
   pagamento simulado e dispara o nosso próprio webhook, do mesmo jeito que o
   gateway de verdade faria.

   Existe para a simulação ter os mesmos passos que a produção: no fluxo real
   a pessoa sai do site, paga na página do provedor e volta. Sem esta tela, o
   pagamento "acontecia sozinho" e não dava para testar nem a volta nem a
   recusa.

   Recusa-se a rodar em produção — a trava está em api/_lib/simulado.js.
   ========================================================================= */

const { rota, json, erro, lerCorpo } = require("../lib/http.js");
const { gateway } = require("../lib/gateway.js");
const armazenamento = require("../lib/armazenamento.js");

function urlDoSite(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocolo = req.headers["x-forwarded-proto"] || "http";
  return `${protocolo}://${host}`;
}

module.exports = rota(["POST"], async (req, res) => {
  if ((process.env.GATEWAY || "") !== "simulado") {
    return erro(res, 404, "Esta rota só existe com o gateway simulado.");
  }

  const corpo = await lerCorpo(req);
  const id = corpo && corpo.id;
  const decisao = corpo && corpo.decisao;

  if (!id || !["aprovar", "recusar"].includes(decisao)) {
    return erro(res, 400, "Informe o id do pagamento e a decisão (aprovar ou recusar).");
  }

  const g = gateway();
  // A trava de produção mora aqui dentro.
  g.registrarDecisao(id, decisao);
  await armazenamento.salvarPedido(`simulado:${id}`, { decisao, em: new Date().toISOString() });

  // Dispara o webhook como o gateway de verdade faria.
  const urlSite = urlDoSite(req);
  let webhook = null;
  try {
    const resposta = await fetch(`${urlSite}/api/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-simulado": String(id) },
      body: JSON.stringify({ type: "payment", data: { id } }),
    });
    webhook = resposta.status;
  } catch (e) {
    console.error("[simulado-pagar] webhook não respondeu:", e.message);
  }

  json(res, 200, { ok: true, decisao, webhook });
});
