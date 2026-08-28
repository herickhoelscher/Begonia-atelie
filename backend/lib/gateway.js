/* =========================================================================
   Begônia Ateliê — porta de entrada única para pagamento.

   O resto do backend importa SÓ este arquivo e nunca o gateway concreto.
   Para trocar o Mercado Pago por outro provedor:
     1. escreva api/_lib/outro.js exportando as mesmas funções
        (criarPagamentoCartao, criarPagamentoPix, consultarPagamento,
         validarWebhook, traduzirStatus);
     2. registre-o no mapa abaixo e defina GATEWAY=outro no ambiente.
   Nenhum endpoint precisa mudar.
   ========================================================================= */

const { gatewayEscolhido } = require("../config.js");

const implementacoes = {
  mercadopago: () => require("../gateways/mercadopago.js"),
  infinitepay: () => require("../gateways/infinitepay.js"),
  // Só para desenvolvimento: aprova sozinho, não cobra ninguém.
  // O próprio arquivo se recusa a rodar em produção.
  simulado: () => require("../gateways/simulado.js"),
};

function gateway() {
  const escolhido = gatewayEscolhido();
  const carregar = implementacoes[escolhido];
  if (!carregar) {
    throw new Error(
      `Gateway "${escolhido}" não existe. Opções: ${Object.keys(implementacoes).join(", ")}`
    );
  }
  return carregar();
}

module.exports = { gateway };
