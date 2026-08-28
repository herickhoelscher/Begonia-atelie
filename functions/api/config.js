/* Ponte para a Cloudflare Pages Functions.

   A Cloudflare procura as funções em /functions e entrega um Request,
   esperando um Response de volta. A lógica mora em backend/rotas/, escrita
   no formato clássico (req, res). Quem traduz é backend/lib/cloudflare.js.

   Na Vercel, quem faz esse papel é api/config.js. */
import ponte from "../../backend/lib/cloudflare.js";
import rota from "../../backend/rotas/config.js";

export const onRequest = ponte.paraCloudflare(rota);
