/* =========================================================================
   Begônia Ateliê — implementação do gateway com Mercado Pago.

   Fala com a API REST direto por fetch: zero dependências para instalar,
   auditar ou manter atualizadas. O access token vive só aqui, no servidor.

   Este arquivo é o ÚNICO que conhece o Mercado Pago. Trocar de gateway
   significa escrever outro arquivo com as mesmas funções exportadas e
   apontar gateway.js para ele.
   ========================================================================= */

const crypto = require("crypto");

const BASE = "https://api.mercadopago.com";

function token() {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error("MP_ACCESS_TOKEN não está definido nas variáveis de ambiente.");
  return t;
}

async function chamar(caminho, { metodo = "GET", corpo, idempotencia } = {}) {
  const cabecalhos = {
    Authorization: `Bearer ${token()}`,
    "Content-Type": "application/json",
  };
  // Evita cobrar duas vezes se a função serverless for reexecutada.
  if (idempotencia) cabecalhos["X-Idempotency-Key"] = idempotencia;

  const resposta = await fetch(`${BASE}${caminho}`, {
    method: metodo,
    headers: cabecalhos,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  const texto = await resposta.text();
  let dados = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = { bruto: texto };
  }

  if (!resposta.ok) {
    // Loga o detalhe para nós; quem chamou decide o que mostrar ao cliente.
    console.error("[mercadopago] %s %s -> %s %s", metodo, caminho, resposta.status, texto.slice(0, 500));
    const e = new Error((dados && dados.message) || `Mercado Pago respondeu ${resposta.status}`);
    e.status = resposta.status;
    e.detalhes = dados;
    throw e;
  }
  return dados;
}

/* Normaliza os muitos status do MP para os três que o site entende. */
function traduzirStatus(status) {
  switch (status) {
    case "approved":
      return "aprovado";
    case "pending":
    case "in_process":
    case "authorized":
      return "pendente";
    case "rejected":
    case "cancelled":
    case "refunded":
    case "charged_back":
      return "recusado";
    default:
      return "pendente";
  }
}

/* -------------------------------------------------------------------------
   Cartão de crédito e débito — Checkout Pro.
   O cliente digita o cartão no ambiente do Mercado Pago. Nosso código nunca
   vê, transporta nem guarda número de cartão.
   ------------------------------------------------------------------------- */
async function criarPagamentoCartao({ referencia, pedido, cliente, metodo, urlSite }) {
  const tiposExcluidos =
    metodo === "debito"
      ? [{ id: "ticket" }, { id: "bank_transfer" }, { id: "atm" }, { id: "credit_card" }]
      : [{ id: "ticket" }, { id: "bank_transfer" }, { id: "atm" }, { id: "debit_card" }];

  const partesNome = cliente.nome.split(" ");
  const primeiroNome = partesNome[0];
  const sobrenome = partesNome.slice(1).join(" ") || primeiroNome;

  const itens = pedido.itens.map((i) => ({
    id: i.slug,
    title: i.nome,
    quantity: i.quantidade,
    unit_price: i.precoUnitario,
    currency_id: "BRL",
  }));
  if (pedido.frete > 0) {
    itens.push({ id: "frete", title: "Frete", quantity: 1, unit_price: pedido.frete, currency_id: "BRL" });
  }

  const preferencia = await chamar("/checkout/preferences", {
    metodo: "POST",
    idempotencia: `pref-${referencia}`,
    corpo: {
      items: itens,
      external_reference: referencia,
      statement_descriptor: "BEGONIA ATELIE",
      payer: {
        name: primeiroNome,
        surname: sobrenome,
        email: cliente.email,
        ...(cliente.cpf ? { identification: { type: "CPF", number: cliente.cpf } } : {}),
      },
      payment_methods: {
        excluded_payment_types: tiposExcluidos,
        installments: metodo === "debito" ? 1 : Number(process.env.MP_MAX_PARCELAS || 6),
      },
      back_urls: {
        success: `${urlSite}/pedido.html?ref=${referencia}`,
        pending: `${urlSite}/pedido.html?ref=${referencia}`,
        failure: `${urlSite}/pedido.html?ref=${referencia}`,
      },
      auto_return: "approved",
      notification_url: `${urlSite}/api/webhook`,
    },
  });

  return {
    tipo: "redirecionamento",
    idGateway: String(preferencia.id),
    // sandbox_init_point é o ambiente de teste; init_point é o de verdade.
    url:
      process.env.MP_MODO === "teste" && preferencia.sandbox_init_point
        ? preferencia.sandbox_init_point
        : preferencia.init_point,
  };
}

/* -------------------------------------------------------------------------
   Pix — cobrança dinâmica com QR code.
   ------------------------------------------------------------------------- */
async function criarPagamentoPix({ referencia, pedido, cliente, urlSite }) {
  const partesNome = cliente.nome.split(" ");
  const primeiroNome = partesNome[0];
  const sobrenome = partesNome.slice(1).join(" ") || primeiroNome;

  const minutos = Number(process.env.PIX_EXPIRA_MINUTOS || 30);
  const expiraEm = new Date(Date.now() + minutos * 60 * 1000);

  const pagamento = await chamar("/v1/payments", {
    metodo: "POST",
    idempotencia: `pix-${referencia}`,
    corpo: {
      transaction_amount: pedido.total,
      payment_method_id: "pix",
      description: `Begônia Ateliê — pedido ${referencia}`,
      external_reference: referencia,
      notification_url: `${urlSite}/api/webhook`,
      date_of_expiration: expiraEm.toISOString().replace("Z", "-00:00"),
      payer: {
        email: cliente.email,
        first_name: primeiroNome,
        last_name: sobrenome,
        identification: { type: "CPF", number: cliente.cpf },
      },
    },
  });

  const dados = (pagamento && pagamento.point_of_interaction && pagamento.point_of_interaction.transaction_data) || {};
  return {
    tipo: "pix",
    idGateway: String(pagamento.id),
    status: traduzirStatus(pagamento.status),
    qrCodeTexto: dados.qr_code || null, // copia-e-cola
    qrCodeImagem: dados.qr_code_base64 || null, // PNG em base64
    expiraEm: pagamento.date_of_expiration || expiraEm.toISOString(),
  };
}

/* -------------------------------------------------------------------------
   Consulta de status — usada pelo polling do Pix e pelo webhook.
   ------------------------------------------------------------------------- */
async function consultarPagamento(idPagamento) {
  const p = await chamar(`/v1/payments/${encodeURIComponent(idPagamento)}`);
  return {
    idGateway: String(p.id),
    referencia: p.external_reference || null,
    status: traduzirStatus(p.status),
    statusOriginal: p.status,
    detalheStatus: p.status_detail || null,
    valor: p.transaction_amount,
    metodo: p.payment_method_id,
    tipoMetodo: p.payment_type_id,
    pagoEm: p.date_approved || null,
    // Os últimos 4 dígitos vêm do MP só para o comprovante. Nunca o número inteiro.
    cartaoFinal: (p.card && p.card.last_four_digits) || null,
  };
}

/* -------------------------------------------------------------------------
   Validação da assinatura do webhook.
   Sem isso, qualquer pessoa poderia postar "pagamento aprovado" no nosso
   endpoint e disparar um pedido que ninguém pagou.
   ------------------------------------------------------------------------- */
function validarWebhook({ cabecalhos, idRecurso }) {
  const segredo = process.env.MP_WEBHOOK_SECRET;
  if (!segredo) {
    console.warn("[mercadopago] MP_WEBHOOK_SECRET ausente: assinatura do webhook NÃO verificada.");
    return { valido: false, motivo: "segredo-ausente" };
  }

  const assinatura = cabecalhos["x-signature"];
  const idRequisicao = cabecalhos["x-request-id"];
  if (!assinatura || !idRequisicao) return { valido: false, motivo: "cabecalhos-ausentes" };

  const partes = {};
  String(assinatura)
    .split(",")
    .forEach((pedaco) => {
      const igual = pedaco.indexOf("=");
      if (igual < 0) return;
      partes[pedaco.slice(0, igual).trim()] = pedaco.slice(igual + 1).trim();
    });
  if (!partes.ts || !partes.v1) return { valido: false, motivo: "assinatura-malformada" };

  // O MP documenta o id alfanumérico em minúsculas dentro do manifesto.
  const id = String(idRecurso).toLowerCase();
  const manifesto = `id:${id};request-id:${idRequisicao};ts:${partes.ts};`;
  const esperado = crypto.createHmac("sha256", segredo).update(manifesto).digest("hex");

  const a = Buffer.from(esperado, "utf8");
  const b = Buffer.from(partes.v1, "utf8");
  const confere = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!confere) return { valido: false, motivo: "assinatura-nao-confere" };

  // Rejeita reenvio antigo (mais de 10 minutos) para cortar replay.
  const idadeSegundos = Math.abs(Date.now() / 1000 - Number(partes.ts));
  if (Number.isFinite(idadeSegundos) && idadeSegundos > 600) {
    return { valido: false, motivo: "assinatura-expirada" };
  }
  return { valido: true };
}

module.exports = {
  nome: "mercadopago",
  criarPagamentoCartao,
  criarPagamentoPix,
  consultarPagamento,
  validarWebhook,
  traduzirStatus,
};
