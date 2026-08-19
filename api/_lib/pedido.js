/* =========================================================================
   Begônia Ateliê — montagem do pedido no servidor.

   Regra central: o navegador manda apenas SLUG e QUANTIDADE. Preço, frete e
   total são recalculados aqui a partir de src/js/dados.js. Se alguém alterar
   o preço no DevTools, o servidor ignora e cobra o valor certo.

   Dinheiro é tratado em centavos (inteiro) para não acumular erro de ponto
   flutuante, e só volta para reais na borda.
   ========================================================================= */

const crypto = require("crypto");
const { PRODUTOS, PAGAMENTO, fretePara, regiaoPorUF } = require("../../src/js/dados.js");

const emCentavos = (reais) => Math.round(Number(reais) * 100);
const emReais = (centavos) => Math.round(centavos) / 100;

/* Referência do pedido: curta o bastante para caber num e-mail e ser lida em
   voz alta no WhatsApp, aleatória o bastante para não ser adivinhada. */
function novaReferencia() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem I, O, 0, 1
  const bytes = crypto.randomBytes(8);
  let sufixo = "";
  for (const b of bytes) sufixo += alfabeto[b % alfabeto.length];
  return `BA-${sufixo}`;
}

/* Junta quantidades repetidas do mesmo slug numa linha só. */
function agruparItens(itens) {
  const mapa = new Map();
  for (const item of itens) {
    mapa.set(item.slug, (mapa.get(item.slug) || 0) + item.quantidade);
  }
  return [...mapa].map(([slug, quantidade]) => ({
    slug,
    quantidade: Math.min(quantidade, PAGAMENTO.maxQuantidadePorPeca),
  }));
}

/* Devolve { campos, pedido }. Se campos tiver qualquer chave, o pedido é inválido. */
function montarPedido(itensPedidos, uf) {
  const campos = {};
  const itens = [];
  let subtotalCent = 0;

  for (const pedido of agruparItens(itensPedidos)) {
    const produto = PRODUTOS.find((p) => p.slug === pedido.slug);

    if (!produto) {
      campos.itens = "Uma das peças saiu do catálogo. Atualize a página e tente de novo.";
      continue;
    }
    // Peça sob encomenda tem preço final dependente de medida e cor: fecha
    // pelo WhatsApp, nunca por pagamento online.
    if (produto.disponibilidade !== "pronta") {
      campos.itens = `"${produto.nome}" é sob encomenda e é fechada pelo WhatsApp, não pelo checkout.`;
      continue;
    }

    const unitarioCent = emCentavos(produto.preco);
    const totalLinhaCent = unitarioCent * pedido.quantidade;
    subtotalCent += totalLinhaCent;

    itens.push({
      slug: produto.slug,
      nome: produto.nome,
      quantidade: pedido.quantidade,
      precoUnitario: emReais(unitarioCent),
      precoTotal: emReais(totalLinhaCent),
      img: produto.img,
    });
  }

  if (!itens.length && !campos.itens) campos.itens = "Sua sacola está vazia.";
  if (Object.keys(campos).length) return { campos, pedido: null };

  const subtotal = emReais(subtotalCent);
  const frete = fretePara(uf, subtotal);
  if (frete === null) {
    return { campos: { estado: "Não entregamos para esse estado. Fale com a gente." }, pedido: null };
  }

  const freteCent = emCentavos(frete);
  const totalCent = subtotalCent + freteCent;

  return {
    campos: {},
    pedido: {
      itens,
      subtotal,
      frete,
      total: emReais(totalCent),
      totalCentavos: totalCent,
      regiao: regiaoPorUF(uf),
      freteGratis: freteCent === 0,
    },
  };
}

module.exports = { montarPedido, novaReferencia, emCentavos, emReais };
