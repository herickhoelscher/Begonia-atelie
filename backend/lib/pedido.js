/* =========================================================================
   Begônia Ateliê — montagem do pedido no servidor.

   Regra central: o navegador manda apenas SLUG e QUANTIDADE. Preço, frete e
   total são recalculados aqui a partir de src/js/dados.js. Se alguém alterar
   o preço no DevTools, o servidor ignora e cobra o valor certo.

   Dinheiro é tratado em centavos (inteiro) para não acumular erro de ponto
   flutuante, e só volta para reais na borda.
   ========================================================================= */

const crypto = require("crypto");
const { PRODUTOS, PAGAMENTO, ENVIO, fretePara, regiaoPorUF, calcularDescontos, precoPara, podeComprarOnline } = require("../../frontend/js/dados.js");

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
  // Agrupa por peça E cor: duas cores da mesma peça são linhas diferentes.
  const mapa = new Map();
  for (const item of itens) {
    const chave = `${item.slug}|${item.cor || ""}`;
    const atual = mapa.get(chave) || { slug: item.slug, cor: item.cor || null, quantidade: 0 };
    atual.quantidade += item.quantidade;
    mapa.set(chave, atual);
  }
  return [...mapa.values()].map((i) => ({
    ...i,
    quantidade: Math.min(i.quantidade, PAGAMENTO.maxQuantidadePorPeca),
  }));
}

/* Devolve { campos, pedido }. Se campos tiver qualquer chave, o pedido é inválido.

   `opcoes.metodo` é a forma de pagamento declarada (para o desconto do Pix).
   `opcoes.primeiraCompra` vem da consulta ao histórico; quando é null, não
   dá para verificar e o desconto simplesmente não é oferecido. */
function montarPedido(itensPedidos, uf, opcoes = {}) {
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
    // pelo WhatsApp, nunca por pagamento online. A mesma trava barra peça
    // sem preço definido, que nunca pode virar cobrança.
    if (!podeComprarOnline(produto)) {
      campos.itens = `"${produto.nome}" ainda não tem preço no site. Fale com a gente pelo WhatsApp.`;
      continue;
    }

    // precoPara respeita o preço de jogo: 3 sousplats saem pelo jogo de 2
    // mais uma avulsa, e não por três avulsas.
    const totalLinhaCent = emCentavos(precoPara(produto, pedido.quantidade));
    const unitarioCent = Math.round(totalLinhaCent / pedido.quantidade);
    subtotalCent += totalLinhaCent;

    itens.push({
      slug: produto.slug,
      nome: produto.nome,
      cor: pedido.cor || null,
      quantidade: pedido.quantidade,
      precoUnitario: emReais(unitarioCent),
      precoTotal: emReais(totalLinhaCent),
      img: produto.img,
    });
  }

  if (!itens.length && !campos.itens) campos.itens = "Sua sacola está vazia.";
  if (Object.keys(campos).length) return { campos, pedido: null };

  const subtotal = emReais(subtotalCent);

  // Frete decidido pelo valor das peças, antes de qualquer desconto.
  const frete = fretePara(uf, subtotal);
  if (frete === null) {
    return { campos: { estado: "Não entregamos para esse estado. Fale com a gente." }, pedido: null };
  }

  const descontos = calcularDescontos({
    subtotal,
    metodo: opcoes.metodo,
    primeiraCompra: opcoes.primeiraCompra === true,
  });
  const descontoCent = descontos.reduce((soma, d) => soma + emCentavos(d.valor), 0);

  const freteCent = emCentavos(frete);
  // Trava de segurança: desconto nunca pode zerar ou inverter a cobrança.
  const totalCent = Math.max(emCentavos(1), subtotalCent - descontoCent + freteCent);

  return {
    campos: {},
    pedido: {
      itens,
      subtotal,
      descontos,
      descontoTotal: emReais(descontoCent),
      frete,
      total: emReais(totalCent),
      totalCentavos: totalCent,
      regiao: regiaoPorUF(uf),
      freteGratis: freteCent === 0,
      faltaParaFreteGratis: freteCent === 0 ? 0 : emReais(Math.max(0, emCentavos(ENVIO.gratisAcimaDe) - subtotalCent)),
    },
  };
}

/* -------------------------------------------------------------------------
   Itens para mandar ao gateway

   Os gateways cobram pela soma dos itens que a gente envia. Se mandássemos os
   preços cheios, o cliente veria o desconto na nossa tela e seria cobrado o
   valor integral — foi exatamente esse o bug que este helper existe para não
   deixar acontecer de novo.

   O desconto é distribuído proporcionalmente entre as peças, e a última linha
   absorve a sobra do arredondamento. Assim a soma bate com o total ao
   centavo, sem depender de o gateway aceitar item de preço negativo.
   ------------------------------------------------------------------------- */
function itensParaCobranca(pedido) {
  const subtotalCent = emCentavos(pedido.subtotal);
  const descontoCent = emCentavos(pedido.descontoTotal || 0);
  const alvoCent = subtotalCent - descontoCent;

  const linhas = pedido.itens.map((i) => ({
    slug: i.slug,
    nome: i.nome,
    quantidade: i.quantidade,
    totalCent: emCentavos(i.precoTotal),
  }));

  if (descontoCent > 0 && subtotalCent > 0) {
    let distribuido = 0;
    linhas.forEach((linha, indice) => {
      if (indice === linhas.length - 1) {
        linha.totalCent = alvoCent - distribuido; // a última fecha a conta
      } else {
        linha.totalCent = Math.round((linha.totalCent * alvoCent) / subtotalCent);
        distribuido += linha.totalCent;
      }
    });
  }

  return linhas.map((linha) => ({
    slug: linha.slug,
    nome: linha.nome,
    quantidade: linha.quantidade,
    // Preço unitário já com o desconto embutido.
    unitarioCent: Math.round(linha.totalCent / linha.quantidade),
    totalCent: linha.totalCent,
  }));
}

module.exports = { montarPedido, novaReferencia, emCentavos, emReais, itensParaCobranca };
