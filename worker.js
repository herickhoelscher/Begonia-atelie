/* =========================================================================
   Begônia Ateliê — entrada única do Worker da Cloudflare.

   Por que este arquivo existe:

   A Cloudflare tem dois modelos de deploy. O Pages procura funções soltas
   em /functions e serve a pasta estática sozinho. O Workers quer um único
   ponto de entrada (`main`) e entrega os arquivos estáticos por um binding.
   O projeto criado no painel é do segundo tipo — o build roda
   `npx wrangler deploy`, que é o comando do Workers.

   Então este arquivo faz o papel que as Pages Functions faziam: recebe tudo,
   manda /api/* para backend/rotas/ e devolve o resto para os arquivos de
   frontend/.

   As rotas continuam escritas no formato (req, res), o mesmo do Node e da
   Vercel. Quem traduz para Request/Response é backend/lib/cloudflare.js —
   o mesmo tradutor que as Pages Functions usam. Nada em backend/ sabe onde
   está rodando, que é justamente o ponto.
   ========================================================================= */

import ponte from "./backend/lib/cloudflare.js";

import rotaConfig from "./backend/rotas/config.js";
import rotaOrcamento from "./backend/rotas/orcamento.js";
import rotaCriarPagamento from "./backend/rotas/criar-pagamento.js";
import rotaStatusPagamento from "./backend/rotas/status-pagamento.js";
import rotaWebhook from "./backend/rotas/webhook.js";
import rotaSimuladoPagar from "./backend/rotas/simulado-pagar.js";

/* Mesma lista de endpoints que existe em /functions e em /api. Ao criar uma
   rota nova, ela precisa entrar aqui também, senão responde 404 só na
   Cloudflare — o tipo de erro que só aparece em produção. */
const rotas = {
  "/api/config": ponte.paraCloudflare(rotaConfig),
  "/api/orcamento": ponte.paraCloudflare(rotaOrcamento),
  "/api/criar-pagamento": ponte.paraCloudflare(rotaCriarPagamento),
  "/api/status-pagamento": ponte.paraCloudflare(rotaStatusPagamento),
  "/api/webhook": ponte.paraCloudflare(rotaWebhook),
  "/api/simulado-pagar": ponte.paraCloudflare(rotaSimuladoPagar),
};

function json(status, corpo) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Barra no fim não pode mudar o destino: /api/config e /api/config/ são
    // a mesma coisa. A raiz é a única que continua sendo "/".
    const caminho = url.pathname.replace(/\/+$/, "") || "/";

    const handler = rotas[caminho];
    if (handler) return handler({ request, env, ctx });

    // Um /api/ desconhecido tem que responder JSON, não a página 404 do
    // site: quem chama isso é o fetch do checkout, que espera JSON e
    // quebraria tentando ler HTML.
    if (caminho.startsWith("/api/")) {
      return json(404, { ok: false, erro: "Endpoint não encontrado." });
    }

    // Todo o resto é o site estático de frontend/.
    return env.ASSETS.fetch(request);
  },
};
