/* Ponte para a Vercel.

   A Vercel procura as funções em /api na raiz do repositório. A lógica mora
   em backend/rotas/, junto do resto do backend — este arquivo só reexporta,
   para a separação de pastas não brigar com a convenção da plataforma.
   Na Cloudflare, quem faz esse papel é backend/lib/cloudflare.js. */
module.exports = require("../backend/rotas/config.js");
