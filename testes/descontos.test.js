/* Testes das regras comerciais: frete grátis a partir de R$ 120,
   10% na primeira compra e 5% no Pix.
   Roda com: npm run teste:descontos */

const path = require("path");

process.env.GATEWAY = "infinitepay";
process.env.INFINITEPAY_HANDLE = "begoniaatelie";
process.env.SITE_URL = "https://begonia.exemplo";
// Simula o histórico configurado, para o desconto de primeira compra existir.
process.env.KV_REST_API_URL = "https://redis.exemplo";
process.env.KV_REST_API_TOKEN = "token-falso";

const RAIZ = process.argv[2] || process.cwd();
const api = (n) => require(path.join(RAIZ, "backend/rotas", n));

/* --- Catálogo de teste --------------------------------------------------
   Os testes usam peças próprias, injetadas no catálogo, em vez das peças
   reais. Assim mudar um preço na loja não quebra o teste do checkout, que é
   sobre a regra e não sobre o produto. */
const { PRODUTOS: CATALOGO } = require(path.join(RAIZ, "frontend/js/dados.js"));
CATALOGO.length = 0;
CATALOGO.push(
  {
    slug: "cardigan-outono", nome: "Cardigan Outono", preco: 389, categoria: "acessorios",
    disponibilidade: "pronta", destaque: true, tags: ["novo"], fotos: ["x.jpeg"],
    alt: "", resumo: "", descricao: "", materiais: [], medidas: "", cuidados: [], prazo: "",
  },
  {
    slug: "caneca-rustica", nome: "Caneca Rústica com Porta-copos", preco: 85, categoria: "acessorios",
    disponibilidade: "pronta", destaque: false, tags: [], fotos: ["x.jpeg"],
    alt: "", resumo: "", descricao: "", materiais: [], medidas: "", cuidados: [], prazo: "",
  },
  {
    slug: "hanger-plantas", nome: "Hanger para Plantas", preco: 95, categoria: "decoracao",
    disponibilidade: "pronta", destaque: false, tags: [], fotos: ["x.jpeg"],
    alt: "", resumo: "", descricao: "", materiais: [], medidas: "", cuidados: [], prazo: "",
  },
  {
    slug: "capa-almofada-trama", nome: "Capa de Almofada Trama", preco: 120, categoria: "decoracao",
    disponibilidade: "pronta", destaque: false, tags: [], fotos: ["x.jpeg"],
    alt: "", resumo: "", descricao: "", materiais: [], medidas: "", cuidados: [], prazo: "",
  },
  {
    slug: "manta-tricolor", nome: "Manta Tricolor", preco: 520, categoria: "decoracao",
    disponibilidade: "encomenda", destaque: true, tags: [], fotos: ["x.jpeg"],
    alt: "", resumo: "", descricao: "", materiais: [], medidas: "", cuidados: [], prazo: "",
  }
);

const { calcularDescontos, fretePara } = require(path.join(RAIZ, "frontend/js/dados.js"));

/* --- Redis e InfinitePay simulados -------------------------------------- */
const clientes = new Set();
const dados = new Map();

global.fetch = async (url, opcoes = {}) => {
  const corpo = opcoes.body ? JSON.parse(opcoes.body) : null;
  const ok = (d) => ({ ok: true, status: 200, text: async () => JSON.stringify(d), json: async () => d });

  if (String(url).includes("redis.exemplo")) {
    const [cmd, chave, valor] = corpo;
    if (cmd === "SISMEMBER") return ok({ result: clientes.has(valor) ? 1 : 0 });
    if (cmd === "SADD") { clientes.add(valor); return ok({ result: 1 }); }
    if (cmd === "SET") { dados.set(chave, valor); return ok({ result: "OK" }); }
    if (cmd === "GET") return ok({ result: dados.get(chave) || null });
    if (cmd === "INCR") { const n = (Number(dados.get(chave)) || 0) + 1; dados.set(chave, n); return ok({ result: n }); }
    return ok({ result: null });
  }
  if (String(url).endsWith("/links")) return ok({ url: "https://checkout.infinitepay.io/x/fat1" });
  throw new Error("URL não simulada: " + url);
};

function req({ metodo = "POST", caminho = "/", corpo = null }) {
  return { method: metodo, url: caminho, headers: { host: "begonia.exemplo" }, body: corpo, socket: { remoteAddress: "203.0.113.5" } };
}
function res() {
  const r = { _status: 0, _corpo: null, headersSent: false,
    setHeader() { return r; }, status(s) { r._status = s; return r; },
    send(c) { r._corpo = c; r.headersSent = true; return r; }, end() { r.headersSent = true; return r; },
    get json() { try { return JSON.parse(r._corpo); } catch { return r._corpo; } } };
  return r;
}

let passou = 0, falhou = 0;
function checar(nome, condicao, extra) {
  if (condicao) { passou++; console.log("  ok    " + nome); }
  else { falhou++; console.log("  FALHA " + nome + (extra ? "  ->  " + JSON.stringify(extra) : "")); }
}

const CLIENTE = { nome: "Ana Souza", email: "ana@exemplo.com", whatsapp: "(11) 98888-7777" };
const ENTREGA = { cep: "01310-100", rua: "Av. Paulista", numero: "1000", bairro: "Bela Vista", cidade: "São Paulo", estado: "SP" };

(async () => {
  console.log("\n== Frete grátis a partir de R$ 120 ==");
  checar("119 no Sudeste paga frete", fretePara("SP", 119) === 29.9);
  // A origem é Marechal Cândido Rondon (PR): o próprio estado é o mais
  // barato, e o Sul vem antes do Sudeste. Antes esta escada estava invertida.
  checar("mesmo estado da origem é o mais barato", fretePara("PR", 119) === 19.9);
  checar("Sul custa menos que Sudeste", fretePara("SC", 119) === 24.9 && fretePara("SC", 119) < fretePara("SP", 119));
  checar("PR acima de 120 também é grátis", fretePara("PR", 120) === 0);
  checar("120 no Sudeste é grátis", fretePara("SP", 120) === 0);
  checar("120 no Norte também é grátis", fretePara("AM", 120) === 0);
  checar("119 no Norte paga o frete da região", fretePara("AM", 119) === 44.9);

  console.log("\n== Percentuais ==");
  {
    const d = calcularDescontos({ subtotal: 200, metodo: "pix", primeiraCompra: true });
    checar("os dois descontos somam", d.length === 2);
    checar("10% + 5% = 30,00 em 200,00", d.reduce((s, x) => s + x.valor, 0) === 30, d);
    checar("não é em cascata", d.find((x) => x.id === "pix").valor === 10, d);
  }
  checar("cartão não ganha o desconto do Pix",
    calcularDescontos({ subtotal: 200, metodo: "cartao", primeiraCompra: false }).length === 0);
  checar("segunda compra no cartão não ganha nada",
    calcularDescontos({ subtotal: 200, metodo: "cartao", primeiraCompra: false }).length === 0);

  console.log("\n== /api/orcamento ==");
  {
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "cardigan-outono", quantidade: 1 }], estado: "SP", metodo: "pix", email: "ana@exemplo.com" } }), r);
    checar("responde 200", r._status === 200, r.json);
    checar("primeira compra reconhecida", r.json.primeiraCompra === true);
    checar("dois descontos", r.json.descontos.length === 2, r.json.descontos);
    // 389 − 38,90 − 19,45 = 330,65, frete grátis
    checar("total com os dois descontos", r.json.total === 330.65, { total: r.json.total });
    checar("frete grátis", r.json.frete === 0);
  }
  {
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "caneca-rustica", quantidade: 1 }], estado: "SP", metodo: "cartao", email: "ana@exemplo.com" } }), r);
    // 85 − 8,50 (primeira compra) + 29,90 de frete = 106,40
    checar("abaixo de 120 soma frete", r.json.total === 106.4, { total: r.json.total, frete: r.json.frete });
    checar("avisa quanto falta para o frete grátis", r.json.faltaParaFreteGratis === 35, r.json.faltaParaFreteGratis);
  }
  {
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "cardigan-outono", quantidade: 1 }], estado: "", metodo: "pix", email: "ana@exemplo.com" } }), r);
    checar("sem UF, frete fica em aberto", r.json.frete === null && r.json.total === null, r.json);
    checar("mas os descontos já aparecem", r.json.descontos.length === 2);
  }

  console.log("\n== Primeira compra só vale uma vez ==");
  let referencia = null;
  {
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: {
      metodo: "pix", itens: [{ slug: "cardigan-outono", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA } }), r);
    referencia = r.json.referencia;
    checar("primeira compra ganha os dois descontos", r.json.descontos.length === 2, r.json.descontos);
    checar("cobra 330,65", r.json.total === 330.65, { total: r.json.total });
  }
  {
    // O webhook marca o e-mail como cliente. Simulamos direto o registro.
    const armazenamento = require(path.join(RAIZ, "backend/lib/armazenamento.js"));
    await armazenamento.registrarCliente("ana@exemplo.com");

    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: {
      metodo: "pix", itens: [{ slug: "cardigan-outono", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA } }), r);
    checar("segunda compra perde o desconto de primeira", r.json.descontos.length === 1, r.json.descontos);
    checar("mas mantém o do Pix", r.json.descontos[0].id === "pix");
    // 389 − 19,45 = 369,55
    checar("cobra 369,55", r.json.total === 369.55, { total: r.json.total });
  }
  {
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: {
      metodo: "pix", itens: [{ slug: "cardigan-outono", quantidade: 1 }],
      cliente: { ...CLIENTE, email: "outra@exemplo.com" }, entrega: ENTREGA } }), r);
    checar("outro e-mail ainda é primeira compra", r.json.descontos.length === 2, r.json.descontos);
  }

  console.log("\n== O navegador não decide o desconto ==");
  {
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: {
      metodo: "pix",
      itens: [{ slug: "cardigan-outono", quantidade: 1 }],
      cliente: CLIENTE, entrega: ENTREGA,
      // Tentativas de forjar desconto pelo corpo da requisição.
      descontos: [{ id: "forjado", rotulo: "100% off", percentual: 100, valor: 389 }],
      descontoTotal: 389, total: 0, primeiraCompra: true,
    } }), r);
    checar("desconto forjado é ignorado", r.json.total === 369.55, { total: r.json.total });
    checar("primeiraCompra forjada é ignorada", r.json.descontos.length === 1, r.json.descontos);
  }

  console.log("");
  console.log("== O valor cobrado bate com o valor mostrado ==");
  {
    const { montarPedido, itensParaCobranca, emCentavos } = require(path.join(RAIZ, "backend/lib/pedido.js"));
    // Vários itens com desconto: o arredondamento não pode sobrar nem faltar.
    const casos = [
      { itens: [{ slug: "cardigan-outono", quantidade: 1 }, { slug: "caneca-rustica", quantidade: 1 }], metodo: "pix", primeira: true },
      { itens: [{ slug: "caneca-rustica", quantidade: 3 }, { slug: "hanger-plantas", quantidade: 1 }], metodo: "pix", primeira: false },
      { itens: [{ slug: "capa-almofada-trama", quantidade: 1 }, { slug: "hanger-plantas", quantidade: 2 }, { slug: "caneca-rustica", quantidade: 1 }], metodo: "pix", primeira: true },
    ];
    casos.forEach((caso, n) => {
      const { pedido } = montarPedido(caso.itens, "SP", { metodo: caso.metodo, primeiraCompra: caso.primeira });
      const linhas = itensParaCobranca(pedido);
      const somaItens = linhas.reduce((soma, l) => soma + l.totalCent, 0);
      const esperado = emCentavos(pedido.subtotal) - emCentavos(pedido.descontoTotal);
      checar("caso " + (n + 1) + ": soma dos itens bate com subtotal menos desconto", somaItens === esperado, { somaItens, esperado });
      checar("caso " + (n + 1) + ": nenhum preco negativo", linhas.every((l) => l.unitarioCent > 0));
    });
  }

  console.log(`\n${passou} passaram, ${falhou} falharam\n`);
  process.exit(falhou ? 1 : 0);
})();
