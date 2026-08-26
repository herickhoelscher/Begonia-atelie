/* Teste de integração dos endpoints, com o Mercado Pago simulado.
   Roda com: node teste-api.js  (a partir da raiz do projeto) */

const crypto = require("crypto");
const path = require("path");

process.env.MP_ACCESS_TOKEN = "TEST-token-falso";
process.env.MP_WEBHOOK_SECRET = "segredo-de-teste";
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


/* --- Mercado Pago e Resend simulados ------------------------------------ */
const chamadas = [];
const PAGAMENTOS = new Map();

global.fetch = async (url, opcoes = {}) => {
  const corpo = opcoes.body ? JSON.parse(opcoes.body) : null;
  chamadas.push({ url, metodo: opcoes.method || "GET", corpo });

  const ok = (dados) => ({ ok: true, status: 200, text: async () => JSON.stringify(dados), json: async () => dados });

  if (url.includes("/checkout/preferences")) {
    return ok({ id: "pref-999", init_point: "https://mp.exemplo/pagar/pref-999", sandbox_init_point: "https://sandbox.mp/pref-999" });
  }
  if (url.includes("/v1/payments/")) {
    const id = url.split("/v1/payments/")[1];
    const p = PAGAMENTOS.get(id);
    if (!p) return { ok: false, status: 404, text: async () => '{"message":"nao encontrado"}' };
    return ok(p);
  }
  if (url.includes("/v1/payments")) {
    const id = "pay-" + (PAGAMENTOS.size + 1);
    const p = {
      id,
      status: "pending",
      external_reference: corpo.external_reference,
      transaction_amount: corpo.transaction_amount,
      payment_method_id: "pix",
      payment_type_id: "bank_transfer",
      point_of_interaction: { transaction_data: { qr_code: "00020126BR.GOV.BCB.PIX...", qr_code_base64: "iVBORw0KGgo=" } },
      date_of_expiration: new Date(Date.now() + 1800000).toISOString(),
    };
    PAGAMENTOS.set(id, p);
    return ok(p);
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
    socket: { remoteAddress: "203.0.113.9" },
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

const CLIENTE = { nome: "Ana Souza", email: "ana@exemplo.com", whatsapp: "(11) 98888-7777", cpf: "111.444.777-35" };
const ENTREGA = { cep: "01310-100", rua: "Av. Paulista", numero: "1000", complemento: "ap 12", bairro: "Bela Vista", cidade: "São Paulo", estado: "SP" };

(async () => {
  console.log("\n== /api/config ==");
  {
    const r = res();
    await api("config.js")(req({ metodo: "GET", caminho: "/api/config" }), r);
    checar("responde 200", r._status === 200);
    checar("não vaza access token", !r._corpo.includes("TEST-token-falso"));
    checar("traz regras de frete", r.json.envio.gratisAcimaDe === 120, r.json.envio);
    checar("expõe o desconto do Pix", r.json.descontoPix === 5);
    checar("expõe o desconto de primeira compra", r.json.descontoPrimeiraCompra === 10);
    checar("marca pagamento disponível", r.json.pagamentoDisponivel === true);
  }

  console.log("\n== /api/criar-pagamento: validação ==");
  {
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: { metodo: "pix", itens: [], cliente: {}, entrega: {} } }), r);
    checar("recusa sacola vazia", r._status === 422, r.json);
    checar("aponta os campos", Boolean(r.json.campos && r.json.campos.nome && r.json.campos.itens), r.json.campos);
  }
  {
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: { metodo: "pix", itens: [{ slug: "manta-tricolor", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA } }), r);
    checar("bloqueia peça sob encomenda", r._status === 422 && /encomenda/i.test(r.json.erro), r.json.erro);
  }
  {
    const r = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: { metodo: "pix", itens: [{ slug: "cardigan-outono", quantidade: 1 }], cliente: { ...CLIENTE, cpf: "12345678900" }, entrega: ENTREGA } }), r);
    checar("recusa CPF inválido no Pix", r._status === 422 && Boolean(r.json.campos.cpf));
  }

  console.log("\n== /api/criar-pagamento: preço é do servidor ==");
  let refPix = null;
  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      corpo: {
        metodo: "pix",
        // Preço forjado de propósito: R$ 1,00 numa peça de R$ 85,00.
        itens: [{ slug: "caneca-rustica", quantidade: 1, preco: 1, precoTotal: 1 }],
        cliente: CLIENTE, entrega: ENTREGA, observacoes: "Presente, pode embrulhar?",
      },
    }), r);
    refPix = r.json.referencia;
    checar("responde 200", r._status === 200, r.json);
    // 85,00 + frete sudeste 24,90 = 109,90 (abaixo de 120, então paga frete).
    // Menos 5% de desconto do Pix sobre as peças (4,25) = 105,65.
    checar("ignora o preço forjado e aplica o desconto do Pix", r.json.total === 105.65, { total: r.json.total });
    checar("mostra o desconto do Pix na resposta", r.json.descontos.some((d) => d.id === "pix" && d.valor === 4.25), r.json.descontos);
    checar("devolve copia-e-cola do Pix", typeof r.json.qrCodeTexto === "string" && r.json.qrCodeTexto.length > 10);
    checar("devolve imagem do QR", typeof r.json.qrCodeImagem === "string");
    checar("referência no formato certo", /^BA-[A-Z2-9]{8}$/.test(refPix || ""), refPix);
    const enviado = chamadas.filter((c) => c.url.includes("/v1/payments")).pop();
    checar("valor enviado ao MP é o do servidor", enviado.corpo.transaction_amount === 105.65, enviado.corpo.transaction_amount);
    checar("CPF vai para o MP", enviado.corpo.payer.identification.number === "11144477735");
  }

  console.log("\n== /api/criar-pagamento: frete grátis e cartão ==");
  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      // 389,00 + 85,00 = 474,00, acima do limite de 120 para frete grátis.
      corpo: { metodo: "cartao", itens: [{ slug: "cardigan-outono", quantidade: 1 }, { slug: "caneca-rustica", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA },
    }), r);
    checar("frete grátis acima de 120", r.json.frete === 0 && r.json.total === 474, { frete: r.json.frete, total: r.json.total });
    checar("cartão não ganha o desconto do Pix", r.json.descontos.length === 0, r.json.descontos);
    checar("devolve URL do checkout", String(r.json.url || "").startsWith("https://"));
    const pref = chamadas.filter((c) => c.url.includes("preferences")).pop();
    checar("crédito exclui débito", pref.corpo.payment_methods.excluded_payment_types.some((t) => t.id === "debit_card"));
    checar("webhook apontado para o site", pref.corpo.notification_url === "https://begonia.exemplo/api/webhook");
  }
  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      corpo: { metodo: "debito", itens: [{ slug: "cardigan-outono", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA },
    }), r);
    const pref = chamadas.filter((c) => c.url.includes("preferences")).pop();
    checar("débito exclui crédito", pref.corpo.payment_methods.excluded_payment_types.some((t) => t.id === "credit_card"));
    checar("débito não parcela", pref.corpo.payment_methods.installments === 1);
  }

  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      // 85,00 fica abaixo do limite de 120: frete do Sudeste é cobrado.
      corpo: { metodo: "cartao", itens: [{ slug: "caneca-rustica", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA },
    }), r);
    checar("abaixo de 120 paga frete", r.json.frete === 24.9 && r.json.total === 109.9, { frete: r.json.frete, total: r.json.total });
  }
  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      // Frete grátis agora vale para todas as regiões.
      corpo: { metodo: "cartao", itens: [{ slug: "cardigan-outono", quantidade: 1 }], cliente: CLIENTE, entrega: { ...ENTREGA, estado: "AM", cidade: "Manaus" } },
    }), r);
    checar("Norte também tem frete grátis acima de 120", r.json.frete === 0 && r.json.total === 389, { frete: r.json.frete, total: r.json.total });
  }
  {
    const r = res();
    await api("criar-pagamento.js")(req({
      caminho: "/api/criar-pagamento",
      // 85,00 no Norte, abaixo do limite: frete cheio da região.
      corpo: { metodo: "cartao", itens: [{ slug: "caneca-rustica", quantidade: 1 }], cliente: CLIENTE, entrega: { ...ENTREGA, estado: "AM", cidade: "Manaus" } },
    }), r);
    checar("Norte abaixo de 120 paga o frete da região", r.json.frete === 44.9 && r.json.total === 129.9, { frete: r.json.frete, total: r.json.total });
  }

  console.log("\n== /api/status-pagamento ==");
  {
    const r = res();
    await api("status-pagamento.js")(req({ metodo: "GET", caminho: "/api/status-pagamento?ref=" + refPix }), r);
    checar("responde 200", r._status === 200, r.json);
    checar("status pendente", r.json.status === "pendente");
    checar("não vaza e-mail", !r._corpo.includes("ana@exemplo.com"));
    checar("não vaza endereço", !r._corpo.includes("Paulista"));
    checar("não vaza CPF", !r._corpo.includes("11144477735"));
  }
  {
    const r = res();
    await api("status-pagamento.js")(req({ metodo: "GET", caminho: "/api/status-pagamento?ref=BA-ZZZZZZZZ" }), r);
    checar("404 em referência desconhecida", r._status === 404);
    const r2 = res();
    await api("status-pagamento.js")(req({ metodo: "GET", caminho: "/api/status-pagamento?ref=xx" }), r2);
    checar("400 em referência malformada", r2._status === 400);
  }

  console.log("\n== /api/webhook ==");
  const idPag = [...PAGAMENTOS.keys()][0];
  const assinar = (id, reqId) => {
    const ts = Math.floor(Date.now() / 1000);
    const v1 = crypto.createHmac("sha256", "segredo-de-teste").update(`id:${String(id).toLowerCase()};request-id:${reqId};ts:${ts};`).digest("hex");
    return { "x-signature": `ts=${ts},v1=${v1}`, "x-request-id": reqId };
  };
  {
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: { type: "payment", data: { id: idPag } }, cabecalhos: { "x-signature": "ts=1,v1=beef", "x-request-id": "r1" } }), r);
    checar("recusa assinatura inválida", r._status === 401, r.json);
  }
  {
    // Aprova o pagamento no MP simulado.
    const p = PAGAMENTOS.get(idPag);
    p.status = "approved";
    p.date_approved = new Date().toISOString();

    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: { type: "payment", data: { id: idPag } }, cabecalhos: assinar(idPag, "r2") }), r);
    checar("aceita assinatura válida", r._status === 200 && r.json.status === "aprovado", r.json);
    const emails = chamadas.filter((c) => c.url.includes("resend"));
    checar("avisou a dona", emails.some((e) => e.corpo.to[0] === "dona@exemplo.com"));
    checar("mandou recibo ao cliente", emails.some((e) => e.corpo.to[0] === "ana@exemplo.com"));
    checar("e-mail traz o endereço", emails[0].corpo.html.includes("Paulista"));
    checar("e-mail NÃO traz CPF", !emails[0].corpo.html.includes("11144477735"));
  }
  {
    const antes = chamadas.filter((c) => c.url.includes("resend")).length;
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: { type: "payment", data: { id: idPag } }, cabecalhos: assinar(idPag, "r3") }), r);
    const depois = chamadas.filter((c) => c.url.includes("resend")).length;
    checar("reenvio não duplica e-mail", antes === depois && r.json.notificacao === "ja-enviada", { antes, depois });
  }
  {
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: { type: "merchant_order", data: { id: 1 } } }), r);
    checar("ignora tópico que não é pagamento", r._status === 200 && Boolean(r.json.ignorado));
  }
  {
    const r = res();
    await api("status-pagamento.js")(req({ metodo: "GET", caminho: "/api/status-pagamento?ref=" + refPix }), r);
    checar("status vira aprovado após o webhook", r.json.status === "aprovado", r.json);
  }

  console.log("\n== valor divergente ==");
  {
    const r0 = res();
    await api("criar-pagamento.js")(req({ caminho: "/api/criar-pagamento", corpo: { metodo: "pix", itens: [{ slug: "hanger-plantas", quantidade: 1 }], cliente: CLIENTE, entrega: ENTREGA } }), r0);
    const idNovo = [...PAGAMENTOS.keys()].pop();
    const p = PAGAMENTOS.get(idNovo);
    p.status = "approved";
    p.transaction_amount = 1; // alguém pagou 1 real num pedido de 119,90
    const r = res();
    await api("webhook.js")(req({ caminho: "/api/webhook", corpo: { type: "payment", data: { id: idNovo } }, cabecalhos: assinar(idNovo, "r4") }), r);
    checar("recusa confirmar valor divergente", r.json.ignorado === "valor-divergente", r.json);
  }

  console.log(`\n${passou} passaram, ${falhou} falharam\n`);
  process.exit(falhou ? 1 : 0);
})();
