/* Testes do gateway InfinitePay, com a API deles simulada.
   Roda com: npm run teste:infinitepay */

const path = require("path");

process.env.GATEWAY = "infinitepay";
process.env.INFINITEPAY_HANDLE = "$begoniaatelie";
process.env.SITE_URL = "https://begonia.exemplo";
process.env.EMAIL_DONA = "dona@exemplo.com";
process.env.RESEND_API_KEY = "re_falso";
process.env.EMAIL_REMETENTE = "loja@begonia.exemplo";

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


/* --- InfinitePay e Resend simulados ------------------------------------- */
const chamadas = [];
const FATURAS = new Map(); // slug -> { orderNsu, amountCentavos, pago }

global.fetch = async (url, opcoes = {}) => {
  const corpo = opcoes.body ? JSON.parse(opcoes.body) : null;
  chamadas.push({ url, corpo });
  const ok = (dados) => ({ ok: true, status: 200, text: async () => JSON.stringify(dados) });

  if (url.endsWith("/links")) {
    const slug = "fat" + (FATURAS.size + 1);
    const total = corpo.items.reduce((s, i) => s + i.price * i.quantity, 0);
    FATURAS.set(slug, { orderNsu: corpo.order_nsu, amountCentavos: total, pago: false });
    // A API real devolve o handle no caminho e o link cifrado na query —
    // sem slug. O slug só chega depois, no invoice_slug do webhook.
    return ok({ url: `https://checkout.infinitepay.io/${corpo.handle}?lenc=FAKE-${slug}` });
  }
  if (url.endsWith("/payment_check")) {
    const f = FATURAS.get(corpo.slug);
    if (!f) return ok({ success: false, paid: false });
    return ok({
      success: true,
      paid: f.pago,
      amount: f.amountCentavos,
      paid_amount: f.amountCentavos + 10,
      installments: 1,
      capture_method: "pix",
    });
  }
  if (url.includes("api.resend.com")) return ok({ id: "email-1" });
  throw new Error("URL não simulada: " + url);
};

/* --- Requisição e resposta falsas --------------------------------------- */
function req({ metodo = "POST", caminho = "/", corpo = null, cabecalhos = {} }) {
  return {
    method: metodo,
    url: caminho,
    headers: { host: "begonia.exemplo", origin: "https://begonia.exemplo", ...cabecalhos },
    body: corpo,
    socket: { remoteAddress: "203.0.113.77" },
  };
}
function res() {
  const r = {
    _status: 0,
    _corpo: null,
    headersSent: false,
    setHeader() { return r; },
    status(s) { r._status = s; return r; },
    send(c) { r._corpo = c; r.headersSent = true; return r; },
    end() { r.headersSent = true; return r; },
    get json() { try { return JSON.parse(r._corpo); } catch { return r._corpo; } },
  };
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
  console.log("\n== /api/config com InfinitePay ==");
  {
    const r = res();
    await api("config.js")(req({ metodo: "GET", caminho: "/api/config" }), r);
    checar("responde 200", r._status === 200, r.json);
    checar("gateway é infinitepay", r.json.gateway === "infinitepay");
    checar("pagamento disponível com o handle", r.json.pagamentoDisponivel === true);
    checar("não oferece débito", !r.json.metodos.some((m) => m.id === "debito"), r.json.metodos.map((m) => m.id));
    checar("oferece Pix e crédito", r.json.metodos.length === 2);
    checar("escolha acontece no gateway", r.json.capacidades.escolhaNoGateway === true);
    checar("não exige CPF", r.json.capacidades.exigeCpf === false);
    checar("não desenha QR no site", r.json.capacidades.pixInline === false);
    checar("não vaza o handle", !r._corpo.includes("begoniaatelie"));
  }

  console.log("\n== /api/criar-pagamento ==");
  let referencia = null;
  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      corpo: {
        metodo: "checkout",
        // Preço forjado: R$ 1,00 numa peça de R$ 389,00.
        itens: [{ slug: "cardigan-outono", quantidade: 1, preco: 1 }],
        cliente: CLIENTE, entrega: ENTREGA,
      },
    }), r);
    referencia = r.json.referencia;
    checar("responde 200", r._status === 200, r.json);
    checar("aceita o método 'checkout'", r.json.metodo === "checkout");
    checar("devolve redirecionamento", r.json.tipo === "redirecionamento");
    checar("URL é do checkout da InfinitePay", String(r.json.url).includes("checkout.infinitepay.io"));
    // A URL da API não traz slug: guardar o handle no lugar dele quebraria
    // o payment_check mais tarde.
    const pedidoSalvo = await require(path.join(RAIZ, "backend/lib/armazenamento.js")).lerPedido(referencia);
    checar("não confunde o handle com o slug",
      !String(pedidoSalvo.pagamento.idGateway).startsWith("begoniaatelie|"), pedidoSalvo.pagamento.idGateway);
    // 389,00 está acima do limite de 120: frete grátis. Sem desconto de
    // primeira compra porque o histórico não está configurado neste teste.
    checar("ignora o preço forjado", r.json.total === 389, { total: r.json.total });

    const enviado = chamadas.filter((c) => c.url.endsWith("/links")).pop();
    checar("valores vão em CENTAVOS", enviado.corpo.items[0].price === 38900, enviado.corpo.items[0]);
    checar("frete grátis não vira item", !enviado.corpo.items.some((i) => i.description === "Frete"), enviado.corpo.items);
    checar("handle vai sem o cifrão", enviado.corpo.handle === "begoniaatelie");
    checar("order_nsu é a nossa referência", enviado.corpo.order_nsu === referencia);
    checar("webhook apontado para o site", enviado.corpo.webhook_url === "https://begonia.exemplo/api/webhook");
    checar("retorno aponta para o pedido", enviado.corpo.redirect_url.includes(`/pedido.html?ref=${referencia}`));
    checar("não manda CPF", !JSON.stringify(enviado.corpo).includes("cpf"));
  }

  console.log("\n== CPF não é exigido ==");
  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      corpo: { metodo: "checkout", itens: [{ slug: "caneca-rustica", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA },
    }), r);
    checar("passa sem CPF", r._status === 200, r.json);
    // 85,00 está abaixo de 120: o frete entra como item na cobrança.
    const enviado = chamadas.filter((c) => c.url.endsWith("/links")).pop();
    checar("abaixo de 120, frete vira item de 29,90",
      enviado.corpo.items.some((i) => i.description === "Frete" && i.price === 2990), enviado.corpo.items);
    checar("total com frete", r.json.total === 114.9, { total: r.json.total });
  }

  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      corpo: { metodo: "pix", itens: [{ slug: "cardigan-outono", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA },
    }), r);
    // 389 menos 5% = 369,55, com frete grátis
    checar("declarar Pix dá 5% de desconto", r.json.total === 369.55, { total: r.json.total });
    const enviado = chamadas.filter((c) => c.url.endsWith("/links")).pop();
    const somaItens = enviado.corpo.items.reduce((s, i) => s + i.price * i.quantity, 0);
    checar("o link é criado já com o desconto aplicado", somaItens === 36955, { somaItens });
  }

  console.log("\n== webhook: as três conferências ==");
  const slug = [...FATURAS.keys()][0];
  const corpoWebhook = (extra = {}) => ({
    invoice_slug: slug,
    order_nsu: referencia,
    transaction_nsu: "tx-abc-123",
    amount: 38900,
    paid_amount: 38900,
    installments: 1,
    capture_method: "pix",
    receipt_url: "https://comprovante.exemplo/1",
    ...extra,
  });

  {
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: corpoWebhook({ order_nsu: undefined }) }), r);
    checar("ignora webhook sem order_nsu", r._status === 200 && Boolean(r.json.ignorado), r.json);
  }
  {
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: corpoWebhook({ order_nsu: "PEDIDO-FALSO" }) }), r);
    checar("recusa order_nsu fora do formato", r._status === 401, r.json);
  }
  {
    // Referência com formato válido, mas que nunca existiu no nosso histórico.
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: corpoWebhook({ order_nsu: "BA-ZZZZZZZZ", invoice_slug: "inexistente" }) }), r);
    checar("ignora pedido desconhecido", r._status === 200 && r.json.ignorado === "pedido-desconhecido", r.json);
  }
  {
    // Webhook forjado: diz que pagou, mas a fatura na InfinitePay não está paga.
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: corpoWebhook() }), r);
    const emails = chamadas.filter((c) => c.url.includes("resend")).length;
    checar("webhook forjado não confirma (fonte diz não pago)", r.json.status === "pendente", r.json);
    checar("webhook forjado não dispara e-mail", emails === 0, { emails });
  }
  {
    // Agora o pagamento existe de verdade, mas com valor menor que o pedido.
    FATURAS.get(slug).pago = true;
    FATURAS.get(slug).amountCentavos = 100; // R$ 1,00 num pedido de R$ 413,90
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: corpoWebhook() }), r);
    checar("recusa valor divergente", r.json.ignorado === "valor-divergente", r.json);
  }
  {
    // Pagamento legítimo.
    FATURAS.get(slug).amountCentavos = 38900;
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: corpoWebhook() }), r);
    checar("confirma pagamento legítimo", r.json.status === "aprovado", r.json);
    const emails = chamadas.filter((c) => c.url.includes("resend"));
    checar("avisa a dona", emails.some((e) => e.corpo.to[0] === "dona@exemplo.com"));
    checar("manda recibo ao cliente", emails.some((e) => e.corpo.to[0] === "ana@exemplo.com"));
  }
  {
    const antes = chamadas.filter((c) => c.url.includes("resend")).length;
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: corpoWebhook() }), r);
    const depois = chamadas.filter((c) => c.url.includes("resend")).length;
    checar("reenvio não duplica e-mail", antes === depois, { antes, depois });
  }

  console.log("\n== /api/status-pagamento ==");
  {
    const r = res();
    await api("status-pagamento.js")(req({ metodo: "GET", caminho: "/api/status-pagamento?ref=" + referencia }), r);
    checar("status aprovado", r.json.status === "aprovado", r.json);
    checar("não vaza endereço", !r._corpo.includes("Paulista"));
    checar("não vaza e-mail", !r._corpo.includes("ana@exemplo.com"));
  }

  console.log(`\n${passou} passaram, ${falhou} falharam\n`);
  process.exit(falhou ? 1 : 0);
})();
