/* =========================================================================
   POST /api/webhook

   O Mercado Pago avisa aqui quando um pagamento muda de estado.

   Três cuidados que fazem este endpoint ser confiável:

   1. Assinatura. A notificação é validada por HMAC antes de qualquer coisa.
      Sem isso, qualquer pessoa poderia postar "pagamento aprovado" e a dona
      receberia pedido que ninguém pagou.
   2. Confirmação na fonte. Mesmo com assinatura válida, o valor e o status
      vêm de uma consulta nossa à API do Mercado Pago, nunca do corpo do POST.
   3. Uma notificação por pedido. O Mercado Pago reenvia o webhook várias
      vezes; uma trava atômica garante um e-mail só.

   Sempre responde 200, inclusive quando ignora a notificação: status de erro
   faz o Mercado Pago reenviar em laço sem necessidade.
   ========================================================================= */

const { rota, json, lerCorpo } = require("./_lib/http.js");
const { gateway } = require("./_lib/gateway.js");
const armazenamento = require("./_lib/armazenamento.js");
const { avisarPedidoPago } = require("./_lib/notificacao.js");

module.exports = rota(["POST"], async (req, res) => {
  let corpo = null;
  try {
    corpo = await lerCorpo(req);
  } catch {
    return json(res, 200, { ok: true, ignorado: "corpo-invalido" });
  }

  const url = new URL(req.url, "http://interno");
  const tipo = (corpo && (corpo.type || corpo.topic)) || url.searchParams.get("type") || url.searchParams.get("topic");
  const idPagamento =
    (corpo && corpo.data && corpo.data.id) || url.searchParams.get("data.id") || url.searchParams.get("id");

  // O Mercado Pago manda vários tópicos (merchant_order, plan...). Só pagamento interessa.
  if (tipo !== "payment" || !idPagamento) {
    return json(res, 200, { ok: true, ignorado: `tipo:${tipo || "desconhecido"}` });
  }

  const g = gateway();

  // 1. Assinatura.
  const assinatura = g.validarWebhook({ cabecalhos: req.headers, idRecurso: idPagamento });
  if (!assinatura.valido) {
    console.warn("[webhook] notificação descartada (%s) para o pagamento %s", assinatura.motivo, idPagamento);
    // 401 aqui é proposital: notificação não autenticada não vira pedido.
    return json(res, 401, { ok: false, erro: "assinatura-invalida" });
  }

  // 2. Confirmação na fonte.
  let pagamento;
  try {
    pagamento = await g.consultarPagamento(idPagamento);
  } catch (e) {
    console.error("[webhook] não consegui consultar o pagamento %s:", idPagamento, e.message);
    // 500 faz o Mercado Pago reenviar — é o que queremos numa falha temporária.
    return json(res, 500, { ok: false, erro: "consulta-falhou" });
  }

  const referencia = pagamento.referencia;
  if (!referencia) {
    return json(res, 200, { ok: true, ignorado: "sem-referencia" });
  }

  const registro = await armazenamento.lerPedido(referencia);
  if (!registro) {
    console.warn("[webhook] pagamento %s aponta para o pedido %s, que não está no histórico", idPagamento, referencia);
    return json(res, 200, { ok: true, ignorado: "pedido-desconhecido" });
  }

  // Confere se o valor cobrado bate com o que calculamos. Divergência é sinal
  // de adulteração ou de configuração errada: registra e não confirma.
  const totalEsperado = registro.pedido ? Number(registro.pedido.total) : null;
  // Gateway que não informa valor (o simulado de desenvolvimento) pula a
  // conferência. Com o Mercado Pago o valor sempre vem, então a checagem vale.
  const valorInformado = pagamento.valor !== null && pagamento.valor !== undefined;
  const valorPago = Number(pagamento.valor);
  const bate =
    !valorInformado || (totalEsperado !== null && Math.abs(totalEsperado - valorPago) < 0.01);
  if (pagamento.status === "aprovado" && !bate) {
    console.error(
      "[webhook] valor divergente no pedido %s: esperado %s, pago %s",
      referencia,
      totalEsperado,
      valorPago
    );
    await armazenamento.atualizarPedido(referencia, { status: "conferir", valorPago });
    return json(res, 200, { ok: true, ignorado: "valor-divergente" });
  }

  await armazenamento.atualizarPedido(referencia, {
    status: pagamento.status,
    pagamento: {
      ...(registro.pagamento || {}),
      idGateway: pagamento.idGateway,
      pagoEm: pagamento.pagoEm,
      statusOriginal: pagamento.statusOriginal,
      // Bandeira e últimos dígitos ficam no Mercado Pago, não aqui.
    },
  });

  if (pagamento.status !== "aprovado") {
    return json(res, 200, { ok: true, status: pagamento.status });
  }

  // 3. Uma notificação por pedido.
  const primeiraVez = await armazenamento.reservarNotificacao(referencia);
  if (!primeiraVez) {
    return json(res, 200, { ok: true, status: "aprovado", notificacao: "ja-enviada" });
  }

  try {
    const resultado = await avisarPedidoPago({
      ...registro,
      status: "aprovado",
      pagamento: { ...(registro.pagamento || {}), idGateway: pagamento.idGateway, pagoEm: pagamento.pagoEm },
    });
    // Se nem o e-mail da dona saiu, solta a trava para o próximo reenvio tentar.
    if (!resultado.dona || !resultado.dona.enviado) {
      await armazenamento.liberarNotificacao(referencia);
      console.error("[webhook] aviso à dona não saiu no pedido %s: %s", referencia, resultado.dona && resultado.dona.motivo);
    }
  } catch (e) {
    await armazenamento.liberarNotificacao(referencia);
    console.error("[webhook] falha ao avisar do pedido %s:", referencia, e.message);
  }

  return json(res, 200, { ok: true, status: "aprovado" });
});
