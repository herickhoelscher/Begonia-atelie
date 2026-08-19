/* =========================================================================
   GET /api/config

   Entrega ao navegador só o que ele pode saber: a PUBLIC KEY do Mercado Pago,
   as regras de frete e os métodos de pagamento ativos. O access token nunca
   passa por aqui.

   Existe para que a chave pública não fique escrita no HTML: assim, produção
   e teste usam o mesmo código e trocam só a variável de ambiente.
   ========================================================================= */

const { rota, json } = require("./_lib/http.js");
const { ENVIO, PAGAMENTO, UFS } = require("../src/js/dados.js");

module.exports = rota(["GET"], async (req, res) => {
  json(res, 200, {
    ok: true,
    publicKey: process.env.MP_PUBLIC_KEY || null,
    modo: process.env.MP_MODO === "teste" ? "teste" : "producao",
    // Quando falta configuração, o front avisa em vez de deixar o cliente
    // preencher tudo e falhar no último passo.
    pagamentoDisponivel: Boolean(process.env.MP_ACCESS_TOKEN) || process.env.GATEWAY === "simulado",
    // O front mostra um aviso na tela quando o gateway é o simulado, para
    // ninguém achar que fez uma compra de verdade.
    simulado: process.env.GATEWAY === "simulado",
    metodos: PAGAMENTO.metodos,
    maxParcelas: Number(process.env.MP_MAX_PARCELAS || PAGAMENTO.maxParcelas),
    maxQuantidadePorPeca: PAGAMENTO.maxQuantidadePorPeca,
    envio: {
      gratisAcimaDe: ENVIO.gratisAcimaDe,
      regioesComFreteGratis: ENVIO.regioesComFreteGratis,
      tabela: ENVIO.tabela,
    },
    ufs: UFS,
  });
});
