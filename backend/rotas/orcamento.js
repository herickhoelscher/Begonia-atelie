/* =========================================================================
   POST /api/orcamento

   Devolve a conta do pedido: subtotal, descontos, frete e total.

   Existe para que o valor mostrado na tela venha do MESMO cálculo que vai
   cobrar. Antes, o navegador estimava o frete por conta própria e o servidor
   refazia a conta na hora de cobrar — duas implementações da mesma regra, que
   mais cedo ou mais tarde discordariam. Agora há uma só.

   Não cria cobrança, não guarda pedido, não manda e-mail. Só calcula.
   ========================================================================= */

const { rota, json, erro, lerCorpo, ipDoPedido } = require("../lib/http.js");
const { validarItens, limpar, emailValido, metodoValido } = require("../lib/validacao.js");
const { montarPedido } = require("../lib/pedido.js");
const armazenamento = require("../lib/armazenamento.js");
const { PAGAMENTO, DESCONTOS, UFS } = require("../../frontend/js/dados.js");

module.exports = rota(["POST"], async (req, res) => {
  // Este endpoint responde a cada digitada no formulário, então o limite é
  // largo. Ele existe para não virar porta de sondagem de e-mails.
  const liberado = await armazenamento.dentroDoLimite(`orcamento:${ipDoPedido(req)}`, 240, 600);
  if (!liberado) return erro(res, 429, "Muitas consultas seguidas. Espere um pouco.");

  let corpo;
  try {
    corpo = await lerCorpo(req);
  } catch {
    return erro(res, 413, "Pedido grande demais.");
  }
  if (!corpo) return erro(res, 400, "Não entendemos o pedido enviado.");

  const { campos, itens } = validarItens(corpo.itens, PAGAMENTO.maxQuantidadePorPeca);
  if (Object.keys(campos).length) return erro(res, 422, campos.itens, campos);

  const estado = limpar(corpo.estado, 2).toUpperCase();
  const metodo = metodoValido(corpo.metodo) ? corpo.metodo : null;
  const email = limpar(corpo.email, 120).toLowerCase();

  // Primeira compra só é oferecida quando dá para conferir de verdade.
  // Sem histórico configurado, jaComprou devolve null e o desconto não entra.
  let primeiraCompra = false;
  if (DESCONTOS.primeiraCompra.ativo && emailValido(email)) {
    const comprou = await armazenamento.jaComprou(email);
    primeiraCompra = comprou === false;
  }

  // Sem UF ainda não dá para fechar o frete: devolvemos a conta sem ele.
  if (!UFS.includes(estado)) {
    const parcial = montarPedido(itens, "SP", { metodo, primeiraCompra });
    if (!parcial.pedido) return erro(res, 422, parcial.campos.itens || "Não foi possível calcular.", parcial.campos);
    return json(res, 200, {
      ok: true,
      subtotal: parcial.pedido.subtotal,
      descontos: parcial.pedido.descontos,
      descontoTotal: parcial.pedido.descontoTotal,
      frete: null, // aguardando o CEP
      freteGratis: null,
      total: null,
      primeiraCompra,
    });
  }

  const { campos: camposPedido, pedido } = montarPedido(itens, estado, { metodo, primeiraCompra });
  if (Object.keys(camposPedido).length) {
    return erro(res, 422, camposPedido.itens || camposPedido.estado || "Não foi possível calcular.", camposPedido);
  }

  json(res, 200, {
    ok: true,
    subtotal: pedido.subtotal,
    descontos: pedido.descontos,
    descontoTotal: pedido.descontoTotal,
    frete: pedido.frete,
    freteGratis: pedido.freteGratis,
    faltaParaFreteGratis: pedido.faltaParaFreteGratis,
    total: pedido.total,
    primeiraCompra,
  });
});
