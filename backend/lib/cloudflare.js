/* =========================================================================
   Begônia Ateliê — ponte entre a Cloudflare e as rotas do backend.

   As rotas em backend/rotas/ são escritas no formato clássico (req, res),
   que é o mesmo do Node e da Vercel. A Cloudflare entrega outra coisa: um
   objeto Request e espera um Response de volta.

   Este arquivo traduz um no outro. A vantagem de traduzir aqui, em vez de
   reescrever as rotas, é que o mesmo código roda em três lugares sem
   mudança: no dev-server local, na Cloudflare e nos testes.
   ========================================================================= */

/* As variáveis de ambiente da Cloudflare chegam num objeto por requisição,
   e não em process.env. Como todo o backend lê process.env, copiamos uma
   vez por requisição. Precisa de nodejs_compat ligado no wrangler.toml. */
function espelharAmbiente(env) {
  if (!env || typeof process === "undefined" || !process.env) return;
  for (const chave of Object.keys(env)) {
    const valor = env[chave];
    // Bindings (KV, D1) não são texto e não têm o que fazer em process.env.
    if (typeof valor === "string") process.env[chave] = valor;
  }
}

/* Monta o `req` que as rotas esperam a partir do Request da Cloudflare. */
async function montarRequisicao(request) {
  const url = new URL(request.url);

  const cabecalhos = {};
  for (const [nome, valor] of request.headers) cabecalhos[nome.toLowerCase()] = valor;

  let corpo = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const texto = await request.text();
    if (texto) {
      try {
        corpo = JSON.parse(texto);
      } catch {
        corpo = texto;
      }
    }
  }

  return {
    method: request.method,
    // As rotas usam req.url com caminho + query, como no Node.
    url: url.pathname + url.search,
    headers: cabecalhos,
    body: corpo,
    socket: {
      // A Cloudflare entrega o IP real neste cabeçalho.
      remoteAddress: cabecalhos["cf-connecting-ip"] || cabecalhos["x-forwarded-for"] || "desconhecido",
    },
  };
}

/* Monta um `res` que, em vez de escrever num socket, junta a resposta para
   virar um Response no fim. */
function montarResposta() {
  const estado = { status: 200, cabecalhos: new Headers(), corpo: null, terminou: false };

  const res = {
    get headersSent() {
      return estado.terminou;
    },
    setHeader(nome, valor) {
      estado.cabecalhos.set(nome, valor);
      return res;
    },
    status(codigo) {
      estado.status = codigo;
      return res;
    },
    send(corpo) {
      estado.corpo = corpo == null ? null : typeof corpo === "string" ? corpo : JSON.stringify(corpo);
      estado.terminou = true;
      return res;
    },
    json(corpo) {
      estado.cabecalhos.set("Content-Type", "application/json; charset=utf-8");
      return res.send(JSON.stringify(corpo));
    },
    end() {
      estado.terminou = true;
      return res;
    },
  };

  return { res, estado };
}

/* Envolve uma rota (req, res) num handler de Pages Function. */
function paraCloudflare(rota) {
  return async ({ request, env }) => {
    espelharAmbiente(env);

    const req = await montarRequisicao(request);
    const { res, estado } = montarResposta();

    try {
      await rota(req, res);
    } catch (e) {
      console.error("[cloudflare] rota falhou:", e);
      if (!estado.terminou) {
        estado.status = 500;
        estado.cabecalhos.set("Content-Type", "application/json; charset=utf-8");
        estado.corpo = JSON.stringify({
          ok: false,
          erro: "Alguma coisa falhou do nosso lado. Tente de novo em instantes.",
        });
      }
    }

    return new Response(estado.corpo, { status: estado.status, headers: estado.cabecalhos });
  };
}

module.exports = { paraCloudflare, espelharAmbiente };
