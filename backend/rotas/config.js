/* =========================================================================
   GET /api/config

   Entrega ao navegador só o que ele pode saber: a PUBLIC KEY do Mercado Pago,
   as regras de frete e os métodos de pagamento ativos. O access token nunca
   passa por aqui.

   Existe para que a chave pública não fique escrita no HTML: assim, produção
   e teste usam o mesmo código e trocam só a variável de ambiente.
   ========================================================================= */

const { rota, json } = require("../lib/http.js");
const { gateway } = require("../lib/gateway.js");
const { ENVIO, PAGAMENTO, UFS, DESCONTOS } = require("../../frontend/js/dados.js");
const { gatewayEscolhido, pagamentoConfigurado } = require("../config.js");

module.exports = rota(["GET"], async (req, res) => {
  const escolhido = gatewayEscolhido();

  // As capacidades vêm do próprio gateway. Se ele nem carregar (credencial
  // ausente, nome errado), o front cai no aviso de indisponível em vez de
  // quebrar a página.
  let capacidades = null;
  try {
    capacidades = gateway().capacidades || null;
  } catch (e) {
    console.error("[config] gateway não carregou:", e.message);
  }

  const metodosAtivos = capacidades
    ? PAGAMENTO.metodos.filter((m) => capacidades.metodos.includes(m.id))
    : PAGAMENTO.metodos;

  json(res, 200, {
    ok: true,
    publicKey: process.env.MP_PUBLIC_KEY || null,
    modo: process.env.MP_MODO === "teste" ? "teste" : "producao",
    // Quando falta configuração, o front avisa em vez de deixar o cliente
    // preencher tudo e falhar no último passo.
    pagamentoDisponivel: Boolean(capacidades) && pagamentoConfigurado(escolhido),
    // O front mostra um aviso na tela quando o gateway é o simulado, para
    // ninguém achar que fez uma compra de verdade.
    simulado: escolhido === "simulado",
    gateway: escolhido,
    capacidades,
    // Percentual do desconto no Pix, para a tela poder etiquetar a opção.
    // null quando o desconto está desligado.
    descontoPix: DESCONTOS.pix.ativo ? DESCONTOS.pix.percentual : null,
    descontoPrimeiraCompra: DESCONTOS.primeiraCompra.ativo ? DESCONTOS.primeiraCompra.percentual : null,
    freteGratisAcimaDe: ENVIO.gratisAcimaDe,
    metodos: metodosAtivos,
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
