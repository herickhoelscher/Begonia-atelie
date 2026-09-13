/* Testes das regras comerciais: frete pago sempre, pela tabela de região,
   10% na primeira compra e 7% no Pix.
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
  console.log("\n== Todo pedido paga frete ==");
  checar("119 no Sudeste paga frete", fretePara("SP", 119) === 39.9);
  // A origem é Marechal Cândido Rondon (PR): o próprio estado é o mais
  // barato, e o Sul vem antes do Sudeste. Antes esta escada estava invertida.
  checar("mesmo estado da origem é o mais barato", fretePara("PR", 119) === 22.9);
  checar("Sul custa menos que Sudeste", fretePara("SC", 119) === 34.9 && fretePara("SC", 119) < fretePara("SP", 119));
  checar("119 no Norte paga o frete da região", fretePara("AM", 119) === 82.9);
  // O frete grátis acabou. Estes quatro travam a regra nova: nenhum valor de
  // pedido, por maior que seja, zera o frete em nenhuma região.
  checar("PR acima de 120 continua pagando", fretePara("PR", 120) === 22.9);
  checar("120 no Sudeste continua pagando", fretePara("SP", 120) === 39.9);
  checar("120 no Norte continua pagando", fretePara("AM", 120) === 82.9);
  checar("nem pedido alto ganha frete grátis", fretePara("SP", 10000) === 39.9);
  checar("UF inválida continua em aberto", fretePara("XX", 500) === null);

  console.log("\n== Percentuais ==");
  {
    const d = calcularDescontos({ subtotal: 200, metodo: "pix", primeiraCompra: true });
    checar("os dois descontos somam", d.length === 2);
    checar("10% + 7% = 34,00 em 200,00", d.reduce((s, x) => s + x.valor, 0) === 34, d);
    // Em cascata o Pix cairia sobre os 180 que sobraram (12,60). Aqui ele é
    // 7% dos 200 cheios.
    checar("não é em cascata", d.find((x) => x.id === "pix").valor === 14, d);
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
    // 389 − 38,90 (primeira compra) − 27,23 (Pix) + 39,90 de frete = 362,77
    checar("total com os dois descontos", r.json.total === 362.77, { total: r.json.total });
    checar("frete cobrado mesmo num pedido alto", r.json.frete === 39.9, { frete: r.json.frete });
  }
  {
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "caneca-rustica", quantidade: 1 }], estado: "SP", metodo: "cartao", email: "ana@exemplo.com" } }), r);
    // 85 − 8,50 (primeira compra) + 39,90 de frete = 116,40
    checar("pedido pequeno soma frete", r.json.total === 116.4, { total: r.json.total, frete: r.json.frete });
    // Sem frete grátis não há meta a alcançar: o checkout não tem o que anunciar.
    checar("não anuncia meta de frete grátis", r.json.faltaParaFreteGratis === null, r.json.faltaParaFreteGratis);
    checar("nunca marca o pedido como frete grátis", r.json.freteGratis === false, r.json.freteGratis);
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
    checar("cobra 362,77", r.json.total === 362.77, { total: r.json.total });
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
    // 389 − 27,23 (só o Pix) + 39,90 de frete = 401,67
    checar("cobra 401,67", r.json.total === 401.67, { total: r.json.total });
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
    checar("desconto forjado é ignorado", r.json.total === 401.67, { total: r.json.total });
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

  console.log("\n== Retirada em mãos (Marechal) ==");
  {
    const { montarPedido } = require(path.join(RAIZ, "backend/lib/pedido.js"));

    const entrega = montarPedido([{ slug: "caneca-rustica", quantidade: 1 }], "SP", {}).pedido;
    const retira = montarPedido([{ slug: "caneca-rustica", quantidade: 1 }], "SP", { retirada: true }).pedido;

    checar("entrega normal cobra frete", entrega.frete === 39.9, { frete: entrega.frete });
    checar("retirada não cobra frete", retira.frete === 0, { frete: retira.frete });
    checar("retirada some do total", retira.total === 85, { total: retira.total });
    checar("pedido sai marcado como retirada", retira.retirada === true);
    // Retirada NAO e "frete gratis": e ausencia de envio. Se viesse true, o
    // e-mail da dona anunciaria frete gratis num pedido que ela entrega na mao.
    checar("retirada não se disfarça de frete grátis", retira.freteGratis === false, { freteGratis: retira.freteGratis });
    checar("retirada não anuncia meta de frete", retira.faltaParaFreteGratis === null);

    // A UF deixa de importar: quem retira nao posta nada.
    const longe = montarPedido([{ slug: "caneca-rustica", quantidade: 1 }], "AM", { retirada: true }).pedido;
    checar("retirada ignora a UF mais cara", longe.frete === 0 && longe.total === 85, { total: longe.total });
  }

  console.log("\n== /api/orcamento com retirada ==");
  {
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "caneca-rustica", quantidade: 1 }], estado: "SP", metodo: "cartao",
      email: "retira@exemplo.com", retirada: true, cep: "85960-000" } }), r);
    checar("responde 200", r._status === 200, r.json);
    checar("frete zerado na resposta", r.json.frete === 0, { frete: r.json.frete });
    checar("resposta avisa que é retirada", r.json.retirada === true);
    // 85 - 8,50 (primeira compra) + 0 de frete = 76,50
    checar("total sem frete", r.json.total === 76.5, { total: r.json.total });
  }
  {
    // O navegador nao decide: mandar retirada de mentira num pedido normal
    // continua passando pelo servidor, que e quem zera (ou nao) o frete.
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "caneca-rustica", quantidade: 1 }], estado: "SP", metodo: "cartao",
      email: "retira@exemplo.com", retirada: false, cep: "85960-000" } }), r);
    checar("sem retirada o frete volta", r.json.frete === 39.9 && r.json.retirada === false, { frete: r.json.frete });
  }
  {
    // A TENTATIVA DE BURLAR: retirada declarada com CEP da Av. Paulista.
    // O orcamento nao devolve erro, so ignora a retirada e cobra o frete --
    // e um endpoint que roda a cada digitada, nao lugar de dar erro na cara.
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "caneca-rustica", quantidade: 1 }], estado: "SP", metodo: "cartao",
      email: "espertinho@exemplo.com", retirada: true, cep: "01310-100" } }), r);
    checar("CEP de fora não ganha retirada", r.json.retirada === false, { retirada: r.json.retirada });
    checar("e continua pagando frete", r.json.frete === 39.9, { frete: r.json.frete });
  }
  {
    // Retirada sem CEP nenhum tambem nao passa.
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "caneca-rustica", quantidade: 1 }], estado: "SP", metodo: "cartao",
      email: "espertinho@exemplo.com", retirada: true } }), r);
    checar("retirada sem CEP é ignorada", r.json.retirada === false && r.json.frete === 39.9, r.json.frete);
  }

  console.log("\n== /api/criar-pagamento sem endereço, retirando ==");
  {
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: {
      metodo: "checkout", retirada: true,
      itens: [{ slug: "caneca-rustica", quantidade: 1 }],
      cliente: CLIENTE,
      // So o CEP: rua, numero e bairro nao sao pedidos de quem retira.
      entrega: { cep: "85960-000" },
    } }), r);
    checar("passa só com o CEP de Marechal", r._status === 200, r.json);
    checar("cobra sem frete", r.json.frete === 0, { frete: r.json.frete });
  }
  {
    // A MESMA tentativa de burlar, agora onde ela custaria dinheiro: aqui o
    // servidor recusa o pedido, em vez de so corrigir a conta.
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: {
      metodo: "checkout", retirada: true,
      itens: [{ slug: "caneca-rustica", quantidade: 1 }],
      cliente: CLIENTE, entrega: { cep: "01310-100" },
    } }), r);
    checar("CEP de fora é recusado na cobrança", r._status === 422, { status: r._status });
    checar("e o erro aponta o campo CEP", Boolean(r.json.campos && r.json.campos.cep), r.json.campos);
  }
  {
    // Retirada sem CEP: recusada tambem.
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: {
      metodo: "checkout", retirada: true,
      itens: [{ slug: "caneca-rustica", quantidade: 1 }],
      cliente: CLIENTE, entrega: {},
    } }), r);
    checar("retirada sem CEP é recusada", r._status === 422 && Boolean(r.json.campos.cep), r.json.campos);
  }
  {
    // A mesma chamada SEM retirada tem de continuar exigindo o endereco.
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: {
      metodo: "checkout", itens: [{ slug: "caneca-rustica", quantidade: 1 }],
      cliente: CLIENTE, entrega: {},
    } }), r);
    checar("sem retirada, endereço volta a ser obrigatório", r._status === 422, { status: r._status });
  }

  console.log("\n== Faixa de CEP de Marechal ==");
  {
    const { cepEhDaCidadeDaRetirada: daCidade, RETIRADA } = require(path.join(RAIZ, "frontend/js/dados.js"));
    checar("85960-000 é de Marechal", daCidade("85960-000"));
    checar("85977-999 ainda é Marechal", daCidade("85977999"));
    checar("aceita com e sem máscara", daCidade("85963-500") && daCidade("85963500"));
    // Vizinhos, conferidos no ViaCEP: abaixo e Maripa, acima e Guaira.
    checar("85955 (Maripá) fica de fora", !daCidade("85955000"));
    checar("85980 (Guaíra) fica de fora", !daCidade("85980000"));
    checar("CEP de São Paulo fica de fora", !daCidade("01310-100"));
    checar("CEP incompleto não vale", !daCidade("8596") && !daCidade(""));
    checar("lixo nao quebra a funcao", !daCidade(null) && !daCidade("abcdefgh"));
    checar("a faixa está declarada", RETIRADA.cepDe === 85960000 && RETIRADA.cepAte === 85979999);
  }

  console.log("\n== Brinde a partir de R$ 150 ==");
  {
    const { brindePara, BRINDE } = require(path.join(RAIZ, "frontend/js/dados.js"));
    checar("o limite é 150", BRINDE.aPartirDe === 150);

    // O numero da imagem que a cliente mandou: 80,91 faltando 269,09 para 350.
    // Aqui o limite e 150, entao 80,91 faltam 69,09.
    const pouco = brindePara(80.91);
    checar("abaixo do limite, calcula quanto falta", pouco.falta === 69.09 && pouco.ganhou === false, pouco);

    const exato = brindePara(150);
    checar("no limite exato, ganha", exato.ganhou === true && exato.falta === 0, exato);

    const acima = brindePara(400);
    checar("acima do limite, continua ganhando", acima.ganhou === true && acima.falta === 0, acima);

    const zero = brindePara(0);
    checar("sacola vazia falta o valor inteiro", zero.falta === 150, zero);

    // A barra vai de 0% (sacola vazia) a 100% (150 reais). E a mesma conta que
    // checkout.js desenha: (limite - falta) / limite.
    const porcento = (subtotal) => {
      const b = brindePara(subtotal);
      return Math.min(100, Math.round(((b.aPartirDe - b.falta) / b.aPartirDe) * 100));
    };
    checar("barra em 0% com sacola vazia", porcento(0) === 0, porcento(0));
    checar("barra em 50% na metade", porcento(75) === 50, porcento(75));
    checar("barra em 80% com 120", porcento(120) === 80, porcento(120));
    checar("barra cheia em 150", porcento(150) === 100, porcento(150));
    checar("barra não passa de 100%", porcento(1000) === 100, porcento(1000));
  }
  {
    // O brinde olha o SUBTOTAL, nunca o total. Um pedido de 150 com 7% de
    // desconto vira 139,50 -- se a conta fosse pelo total, o brinde sumiria
    // da tela depois de ja ter aparecido.
    const { montarPedido } = require(path.join(RAIZ, "backend/lib/pedido.js"));
    const p = montarPedido([{ slug: "capa-almofada-trama", quantidade: 1 }], "SP", { metodo: "pix" }).pedido;
    checar("subtotal 120 ainda não ganha", p.brinde.ganhou === false && p.brinde.falta === 30, p.brinde);

    const dois = montarPedido([{ slug: "capa-almofada-trama", quantidade: 1 }, { slug: "caneca-rustica", quantidade: 1 }], "SP", { metodo: "pix" }).pedido;
    checar("subtotal 205 ganha o brinde", dois.brinde.ganhou === true, dois.brinde);
    // O que importa e que o desconto EXISTIU e o brinde sobreviveu a ele.
    // (total nao serve de prova aqui: ele ainda soma o frete por cima.)
    checar("o desconto do Pix não tira o brinde",
      dois.descontoTotal > 0 && dois.subtotal === 205 && dois.brinde.ganhou === true,
      { subtotal: dois.subtotal, desconto: dois.descontoTotal, brinde: dois.brinde });
  }
  {
    // A barra tem de aparecer antes do CEP: ela so depende das pecas.
    const r = res();
    await api("orcamento.js")(req({ caminho: "/api/orcamento", corpo: {
      itens: [{ slug: "caneca-rustica", quantidade: 1 }], estado: "", metodo: "pix", email: "b@exemplo.com" } }), r);
    checar("brinde já vem sem UF", r.json.brinde && r.json.brinde.falta === 65, r.json.brinde);
    checar("mas o frete continua em aberto", r.json.frete === null);
  }

  console.log("\n== Aviso de venda para mais de uma caixa ==");
  {
    const { listaDeDestinatarios: lista } = require(path.join(RAIZ, "backend/lib/notificacao.js"));
    const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    checar("duas pessoas viram dois destinatarios",
      igual(lista("milena@x.com,herick@y.com"), ["milena@x.com", "herick@y.com"]),
      lista("milena@x.com,herick@y.com"));
    checar("espaco e ponto e virgula tambem separam",
      igual(lista(" a@x.com ;  b@y.com , "), ["a@x.com", "b@y.com"]));
    checar("um endereco so continua funcionando",
      igual(lista("so-um@x.com"), ["so-um@x.com"]));
    // Vazio tem de virar lista vazia, para enviarEmail recusar com motivo
    // claro em vez de mandar um `to` invalido para o Resend.
    checar("vazio nao vira destinatario fantasma",
      lista("").length === 0 && lista(null).length === 0 && lista(",,").length === 0);
  }

  console.log("\n== Peca oculta nao vaza para a loja ==");
  {
    const { produtosVisiveis, produtoPorSlug } = require(path.join(RAIZ, "frontend/js/dados.js"));
    const antes = produtosVisiveis().length;
    CATALOGO.push({
      slug: "peca-oculta", nome: "Oculta", preco: 0.01, oculto: true, categoria: "acessorios",
      disponibilidade: "pronta", destaque: true, tags: [], fotos: [],
      alt: "", resumo: "", descricao: "", materiais: [], medidas: "", cuidados: [], prazo: "",
    });
    checar("a peca entrou no catalogo", CATALOGO.length === antes + 1);
    checar("mas nao conta como visivel", produtosVisiveis().length === antes, produtosVisiveis().length);
    checar("nao aparece na listagem", !produtosVisiveis().some((p) => p.slug === "peca-oculta"));
    // Continua existindo para o link direto e para o servidor cobrar -- e o
    // que permite testar um pagamento sem por a peca na vitrine.
    checar("mas e achavel pelo slug", produtoPorSlug("peca-oculta") !== null);
    // destaque: true de proposito acima: nem assim ela pode vazar para a home.
    checar("nem o destaque a traz de volta", !produtosVisiveis().some((p) => p.destaque && p.oculto));
    CATALOGO.pop();
  }

  console.log("\n== Cartela do macrame: 3 cores, nao 53 ==");
  {
    const { CORES_MACRAME, CARTELA, coresDe } = require(path.join(RAIZ, "frontend/js/dados.js"));
    checar("sao exatamente tres", CORES_MACRAME.length === 3, CORES_MACRAME.map((c) => c.nome));
    checar("verde oliva, terracota e off-white",
      CORES_MACRAME.map((c) => c.nome).join(",") === "Verde Oliva,Terracota,Branco Off-White");

    CATALOGO.push({
      slug: "peca-macrame", nome: "Macrame", preco: 90, categoria: "decoracao",
      disponibilidade: "encomenda", destaque: false, tags: [], cores: CORES_MACRAME,
      fotos: [], alt: "", resumo: "", descricao: "", materiais: [], medidas: "", cuidados: [], prazo: "",
    });
    checar("peca de macrame usa a cartela dela", coresDe(CATALOGO[CATALOGO.length - 1]).length === 3);
    checar("peca de croche continua com as 53", coresDe(CATALOGO[0]).length === CARTELA.length);

    // O ponto do teste: antes a cor era conferida contra a CARTELA global, e
    // uma peca de macrame aceitaria "Amarelo Neon" -- cor que so existe no fio
    // de croche e que ela nao tem como produzir em macrame.
    const { validarItens } = require(path.join(RAIZ, "backend/lib/validacao.js"));
    const comCor = (slug, cor) => validarItens([{ slug, quantidade: 1, cor }], 5).itens[0].cor;

    checar("macrame aceita Terracota", comCor("peca-macrame", "Terracota") === "Terracota");
    checar("macrame RECUSA cor do croche", comCor("peca-macrame", "Amarelo Neon") === null);
    checar("croche aceita Amarelo Neon", comCor("cardigan-outono", "Amarelo Neon") === "Amarelo Neon");
    checar("croche recusa cor inventada", comCor("cardigan-outono", "Roxo Fluorescente") === null);
    // Slug desconhecido cai na cartela do croche e a cor e descartada de
    // qualquer jeito -- montarPedido recusa a peca logo depois.
    checar("slug desconhecido nao quebra", comCor("nao-existe", "Terracota") === null);
    CATALOGO.pop();
  }

  console.log(`\n${passou} passaram, ${falhou} falharam\n`);
  process.exit(falhou ? 1 : 0);
})();
