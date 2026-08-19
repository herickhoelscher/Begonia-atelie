/* =========================================================================
   POST /api/webhook

   O gateway de pagamento avisa aqui quando um pagamento muda de estado.

   Três cuidados que fazem este endpoint ser confiável:

   1. Autenticidade. Gateway que assina (Mercado Pago) tem o HMAC conferido.
      Gateway que não assina (InfinitePay) tem o formato conferido aqui e a
      prova real vem dos passos 2 e 3.
   2. Confirmação na fonte. O valor e o status vêm de uma consulta NOSSA à
      API do gateway, nunca do corpo do POST. Um webhook forjado não
      consegue fazer a API do gateway responder "pago".
   3. Conferência de valor. O total pago tem de bater com o que o servidor
      calculou, senão alguém pagaria R$ 1 e amarraria a um pedido de R$ 500.
   4. Uma notificação por pedido. Os gateways reenviam o webhook várias
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
  const g = gateway();

  // Cada gateway avisa num formato. Quem sabe ler é o próprio gateway.
  const notificacao = g.extrairNotificacao({ corpo, query: url.searchParams });
  if (!notificacao.ehPagamento) {
    return json(res, 200, { ok: true, ignorado: notificacao.motivo || "nao-e-pagamento" });
  }
  const idPagamento = notificacao.idRecurso;

  // 1. Autenticidade da notificação.
  //    Gateway que assina (Mercado Pago): confere o HMAC.
  //    Gateway que não assina (InfinitePay): confere o formato e deixa a
  //    prova de verdade para os passos 2 e 3, que consultam a fonte.
  const assinatura = g.validarWebhook({ cabecalhos: req.headers, corpo, idRecurso: idPagamento });
  if (!assinatura.valido) {
    console.warn("[webhook] notificação descartada (%s) para o pagamento %s", assinatura.motivo, idPagamento);
    // 401 aqui é proposital: notificação não autenticada não vira pedido.
    return json(res, 401, { ok: false, erro: "assinatura-invalida" });
  }

  // Alguns gateways precisam de mais de um identificador para a consulta
  // (a InfinitePay pede slug + transaction_nsu + order_nsu). O validador
  // devolve o identificador composto quando é o caso.
  const idParaConsulta = assinatura.idGateway || idPagamento;

  // 2. Confirmação na fonte.
  let pagamento;
  try {
    pagamento = await g.consultarPagamento(idParaConsulta);
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
