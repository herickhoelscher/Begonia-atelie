/* =========================================================================
   Begônia Ateliê — utilidades de HTTP para as funções serverless.
   Sem dependências: só o que a Vercel já entrega no runtime Node.
   ========================================================================= */

/* Origens autorizadas a chamar a API. Em produção, a própria loja.
   SITE_URL é definida nas variáveis de ambiente (ver .env.example). */
function origensPermitidas() {
  const lista = [
    process.env.SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // Desenvolvimento local.
    "http://localhost:3000",
    "http://localhost:4321",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4321",
  ].filter(Boolean);
  return [...new Set(lista.map((u) => u.replace(/\/$/, "")))];
}

function aplicarCabecalhos(req, res) {
  const origem = (req.headers.origin || "").replace(/\/$/, "");
  if (origem && origensPermitidas().includes(origem)) {
    res.setHeader("Access-Control-Allow-Origin", origem);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  // Nada aqui deve ser cacheado: são respostas de pedido e de pagamento.
  res.setHeader("Cache-Control", "no-store");
}

function json(res, status, corpo) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(corpo));
}

function erro(res, status, mensagem, campos) {
  json(res, status, { ok: false, erro: mensagem, campos: campos || undefined });
}

/* Corpo JSON, tolerante a runtimes que não fazem o parse sozinhos. */
async function lerCorpo(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body) {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  const pedacos = [];
  let tamanho = 0;
  for await (const pedaco of req) {
    tamanho += pedaco.length;
    // Um pedido legítimo não passa de alguns KB. Corta o resto.
    if (tamanho > 64 * 1024) throw new Error("corpo grande demais");
    pedacos.push(pedaco);
  }
  if (!pedacos.length) return null;
  try { return JSON.parse(Buffer.concat(pedacos).toString("utf8")); } catch { return null; }
}

/* IP de quem chamou, para limitar taxa. */
function ipDoPedido(req) {
  const encaminhado = req.headers["x-forwarded-for"];
  if (typeof encaminhado === "string" && encaminhado) return encaminhado.split(",")[0].trim();
  return req.socket?.remoteAddress || "desconhecido";
}

/* Envolve um handler: CORS, OPTIONS, método e erro não tratado.
   Assim cada endpoint cuida só da própria regra de negócio. */
function rota(metodosAceitos, handler) {
  return async (req, res) => {
    aplicarCabecalhos(req, res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (!metodosAceitos.includes(req.method)) {
      return erro(res, 405, `Método ${req.method} não é aceito aqui.`);
    }
    try {
      await handler(req, res);
    } catch (e) {
      // O detalhe fica no log da Vercel; o cliente recebe uma frase útil.
      console.error("[begonia] falha não tratada:", e);
      if (!res.headersSent) {
        erro(res, 500, "Alguma coisa falhou do nosso lado. Tente de novo em instantes.");
      }
    }
  };
}

module.exports = { rota, json, erro, lerCorpo, ipDoPedido, origensPermitidas };
