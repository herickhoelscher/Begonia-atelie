/* =========================================================================
   POST /api/criar-pagamento

   Recebe: itens (slug + quantidade), dados do cliente, endereço, método.
   Devolve: para cartão, a URL do checkout do Mercado Pago; para Pix, o QR
   code e o copia-e-cola.

   O que este endpoint NÃO aceita: preço. Nem do item, nem do frete, nem do
   total. Tudo é recalculado aqui a partir de src/js/dados.js. Alterar o
   preço no DevTools não muda um centavo do que é cobrado.

   O que este endpoint NUNCA vê: número de cartão. Quem coleta é o Mercado
   Pago, na página dele.
   ========================================================================= */

const { rota, json, erro, lerCorpo, ipDoPedido } = require("../lib/http.js");
const { validarCliente, validarEntrega, validarItens, limparTexto, metodoValido } = require("../lib/validacao.js");
const { montarPedido, novaReferencia } = require("../lib/pedido.js");
const { gateway } = require("../lib/gateway.js");
const armazenamento = require("../lib/armazenamento.js");
const { PAGAMENTO, DESCONTOS } = require("../../frontend/js/dados.js");

/* URL pública do site, usada nos retornos e no webhook do Mercado Pago. */
function urlDoSite(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocolo = req.headers["x-forwarded-proto"] || "https";
  return `${protocolo}://${host}`;
}

/* O gateway está configurado? Cada um precisa de uma credencial diferente. */
function pagamentoConfigurado() {
  const escolhido = process.env.GATEWAY || "mercadopago";
  if (escolhido === "simulado") return true;
  if (escolhido === "infinitepay") return Boolean(process.env.INFINITEPAY_HANDLE);
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

module.exports = rota(["POST"], async (req, res) => {
  if (!pagamentoConfigurado()) {
    return erro(res, 503, "O pagamento online ainda não está configurado. Fale com a gente pelo WhatsApp.");
  }

  // Trava por IP: 10 tentativas de pagamento a cada 10 minutos é folgado para
  // um cliente e apertado para um script.
  const liberado = await armazenamento.dentroDoLimite(`pagar:${ipDoPedido(req)}`, 10, 600);
  if (!liberado) {
    return erro(res, 429, "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.");
  }

  let corpo;
  try {
    corpo = await lerCorpo(req);
  } catch {
    return erro(res, 413, "Pedido grande demais.");
  }
  if (!corpo) return erro(res, 400, "Não entendemos o pedido enviado.");

  const metodo = String(corpo.metodo || "");
  if (!metodoValido(metodo)) return erro(res, 400, "Escolha uma forma de pagamento.");

  const g = gateway();
  const capacidades = g.capacidades || {};

  // O CPF só é pedido quando o gateway precisa dele para emitir o Pix. O
  // Mercado Pago precisa; a InfinitePay coleta o que precisa na página dela.
  const exigirCpf = Boolean(capacidades.exigeCpf) && metodo === "pix";

  const { campos: camposCliente, cliente } = validarCliente(corpo.cliente, { exigirCpf });
  const { campos: camposEntrega, entrega } = validarEntrega(corpo.entrega);
  const { campos: camposItens, itens } = validarItens(corpo.itens, PAGAMENTO.maxQuantidadePorPeca);

  const camposComErro = { ...camposCliente, ...camposEntrega, ...camposItens };
  if (Object.keys(camposComErro).length) {
    return erro(res, 422, "Confira os campos destacados.", camposComErro);
  }

  // Primeira compra é conferida no servidor, contra o histórico de pedidos
  // pagos. O navegador não opina — ele só mostra o que voltar daqui.
  let primeiraCompra = false;
  if (DESCONTOS.primeiraCompra.ativo) {
    const comprou = await armazenamento.jaComprou(cliente.email);
    primeiraCompra = comprou === false;
  }

  // Preço, descontos, frete e total nascem aqui — nunca no navegador.
  const { campos: camposPedido, pedido } = montarPedido(itens, entrega.estado, {
    metodo,
    primeiraCompra,
  });
  if (Object.keys(camposPedido).length) {
    return erro(res, 422, camposPedido.itens || camposPedido.estado || "Não foi possível montar o pedido.", camposPedido);
  }

  const observacoes = limparTexto(corpo.observacoes, 500);
  const referencia = novaReferencia();
  const urlSite = urlDoSite(req);

  const registro = {
    referencia,
    criadoEm: new Date().toISOString(),
    status: "pendente",
    pedido,
    cliente: { nome: cliente.nome, email: cliente.email, whatsapp: cliente.whatsapp },
    entrega,
    observacoes,
    pagamento: {
      metodo,
      idGateway: null,
      pagoEm: null,
      // Guardamos o que a pessoa DECLAROU. Se o gateway avisar depois que ela
      // pagou de outro jeito, dá para comparar — ver api/webhook.js.
      metodoDeclarado: metodo,
    },
  };

  // Grava antes de cobrar. Se o gateway responder e a gravação falhar depois,
  // o webhook ainda encontra o pedido pela referência.
  await armazenamento.salvarPedido(referencia, registro);

  let resultado;
  try {
    // Gateway de link único (InfinitePay): uma chamada só, e o cliente
    // escolhe Pix ou cartão na página dele.
    if (capacidades.escolhaNoGateway && g.criarPagamentoUnico) {
      resultado = await g.criarPagamentoUnico({ referencia, pedido, cliente, entrega, urlSite });
    } else if (metodo === "pix") {
      resultado = await g.criarPagamentoPix({ referencia, pedido, cliente, urlSite });
    } else {
      resultado = await g.criarPagamentoCartao({ referencia, pedido, cliente, metodo, urlSite });
    }
  } catch (e) {
    console.error("[criar-pagamento] gateway falhou no pedido %s:", referencia, e.message);
    await armazenamento.atualizarPedido(referencia, { status: "falhou", erroGateway: e.message });
    return erro(
      res,
      502,
      "O pagamento não pôde ser aberto agora. Tente outra forma de pagamento ou fale com a gente pelo WhatsApp."
    );
  }

  await armazenamento.atualizarPedido(referencia, {
    pagamento: { ...registro.pagamento, idGateway: resultado.idGateway },
  });

  json(res, 200, {
    ok: true,
    referencia,
    metodo,
    tipo: resultado.tipo,
    total: pedido.total,
    subtotal: pedido.subtotal,
    frete: pedido.frete,
    descontos: pedido.descontos,
    descontoTotal: pedido.descontoTotal,
    itens: pedido.itens.map((i) => ({ nome: i.nome, quantidade: i.quantidade, precoTotal: i.precoTotal })),
    // Cartão: para onde mandar o cliente. Pix: o que desenhar na tela.
    url: resultado.url || null,
    qrCodeTexto: resultado.qrCodeTexto || null,
    qrCodeImagem: resultado.qrCodeImagem || null,
    expiraEm: resultado.expiraEm || null,
  });
});
