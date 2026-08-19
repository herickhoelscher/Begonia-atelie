/* =========================================================================
   Begônia Ateliê — servidor de desenvolvimento.

   O `http-server` só entrega arquivos: a pasta /api fica parada no disco e
   /api/config responde 404, o que faz o checkout mostrar "pagamento fora do
   ar". Este servidor serve os arquivos estáticos E executa as funções de
   /api, do mesmo jeito que a Vercel faz em produção — sem precisar de conta,
   login ou `vercel link`.

   Rode com:  npm run dev
   ========================================================================= */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const RAIZ = __dirname;
const PORTA = Number(process.env.PORT || 4321);

/* -------------------------------------------------------------------------
   .env.local -> process.env
   Leitor mínimo: sem dependência, sem mágica. Ignora comentário e linha
   vazia, e não sobrescreve variável que já veio do sistema.
   ------------------------------------------------------------------------- */
function carregarEnv() {
  const arquivo = path.join(RAIZ, ".env.local");
  if (!fs.existsSync(arquivo)) return [];
  const definidas = [];
  for (const linha of fs.readFileSync(arquivo, "utf8").split(/\r?\n/)) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith("#")) continue;
    const igual = limpa.indexOf("=");
    if (igual < 1) continue;
    const chave = limpa.slice(0, igual).trim();
    let valor = limpa.slice(igual + 1).trim();
    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }
    if (process.env[chave] === undefined) {
      process.env[chave] = valor;
      definidas.push(chave);
    }
  }
  return definidas;
}

/* -------------------------------------------------------------------------
   Vercel acrescenta .status() e .send() na resposta. Aqui a gente põe os
   mesmos, para as funções de /api rodarem sem saber onde estão.
   ------------------------------------------------------------------------- */
function adaptarResposta(res) {
  res.status = (codigo) => {
    res.statusCode = codigo;
    return res;
  };
  res.send = (corpo) => {
    if (corpo === undefined || corpo === null) return res.end();
    if (Buffer.isBuffer(corpo) || typeof corpo === "string") return res.end(corpo);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify(corpo));
  };
  res.json = (corpo) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify(corpo));
  };
  return res;
}

/* Corpo JSON já parseado, como a Vercel entrega. */
function lerCorpoBruto(req) {
  return new Promise((resolve) => {
    const pedacos = [];
    req.on("data", (p) => pedacos.push(p));
    req.on("end", () => resolve(Buffer.concat(pedacos)));
    req.on("error", () => resolve(Buffer.alloc(0)));
  });
}

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function servirEstatico(caminho, res) {
  // Impede sair da pasta do projeto com ../../
  const destino = path.normalize(path.join(RAIZ, decodeURIComponent(caminho)));
  if (!destino.startsWith(RAIZ)) {
    res.statusCode = 403;
    return res.end("Fora do projeto.");
  }

  let arquivo = destino;
  if (fs.existsSync(arquivo) && fs.statSync(arquivo).isDirectory()) {
    arquivo = path.join(arquivo, "index.html");
  }
  if (!fs.existsSync(arquivo)) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.end("<h1>404</h1><p>Não achei <code>" + caminho + "</code>.</p>");
  }

  res.setHeader("Content-Type", TIPOS[path.extname(arquivo).toLowerCase()] || "application/octet-stream");
  res.setHeader("Cache-Control", "no-store"); // desenvolvimento: sempre fresco
  fs.createReadStream(arquivo).pipe(res);
}

async function rodarFuncaoApi(nome, req, res) {
  const arquivo = path.join(RAIZ, "api", nome + ".js");
  if (!fs.existsSync(arquivo)) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ ok: false, erro: `Não existe /api/${nome}.` }));
  }

  // Recarrega a cada chamada: editar um arquivo de /api não exige reiniciar.
  Object.keys(require.cache)
    .filter((k) => k.includes(path.join(RAIZ, "api")) || k.includes(path.join(RAIZ, "src", "js", "dados.js")))
    .forEach((k) => delete require.cache[k]);

  const bruto = await lerCorpoBruto(req);
  if (bruto.length) {
    try {
      req.body = JSON.parse(bruto.toString("utf8"));
    } catch {
      req.body = bruto.toString("utf8");
    }
  }

  const handler = require(arquivo);
  await handler(req, adaptarResposta(res));
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORTA}`);
  const caminho = url.pathname;

  if (caminho.startsWith("/api/")) {
    const nome = caminho.slice(5).replace(/\/$/, "");
    try {
      await rodarFuncaoApi(nome, req, res);
    } catch (e) {
      console.error("[dev] erro em /api/%s:", nome, e);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ ok: false, erro: e.message }));
      }
    }
    return;
  }

  servirEstatico(caminho === "/" ? "/index.html" : caminho, res);
});

const carregadas = carregarEnv();
servidor.listen(PORTA, () => {
  const gateway = process.env.GATEWAY || "mercadopago";
  console.log("");
  console.log("  Begônia Ateliê rodando em  http://localhost:" + PORTA);
  console.log("  Funções de /api: ativas");
  console.log(
    "  .env.local: " + (carregadas.length ? carregadas.length + " variáveis carregadas" : "não encontrado")
  );
  console.log("  Gateway de pagamento: " + gateway + (gateway === "simulado" ? "  (nenhuma cobrança real)" : ""));
  if (!process.env.MP_ACCESS_TOKEN && gateway !== "simulado") {
    console.log("");
    console.log("  Aviso: MP_ACCESS_TOKEN não está definido, então o checkout vai");
    console.log("  mostrar 'pagamento fora do ar'. Use GATEWAY=simulado no .env.local");
    console.log("  para testar o fluxo sem conta no Mercado Pago.");
  }
  console.log("");
});
