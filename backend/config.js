/* =========================================================================
   Begônia Ateliê — configuração do pagamento, com padrão que já funciona.

   Por que estes valores estão VERSIONADOS e não só no ambiente:

   A InfinitePay não usa chave secreta. A conta é identificada pela
   InfiniteTag, que é pública — é o "@" impresso no perfil, no link de
   pagamento e na maquininha. Não há credencial para vazar, nada aqui
   assina requisição e nada aqui autoriza saque. Guardar isto num painel
   só criava uma forma silenciosa de o site subir sem pagamento: foi
   exatamente o que aconteceu na Vercel e na Cloudflare, porque a variável
   nunca foi cadastrada e o padrão antigo caía no Mercado Pago.

   Com o padrão aqui dentro, um deploy limpo já nasce vendendo. O ambiente
   continua tendo a palavra final, então dá para apontar para o simulado em
   desenvolvimento ou trocar de gateway sem tocar no código.

   O que NUNCA pode entrar neste arquivo: MP_ACCESS_TOKEN, RESEND_API_KEY,
   token do Upstash, ou qualquer coisa que dê acesso a dinheiro ou a dado
   pessoal. Esses continuam só em variável de ambiente. A regra prática é:
   se vazar e alguém puder usar contra a cliente, não mora aqui.
   ========================================================================= */

/* Padrões da loja. Valem quando o ambiente não diz nada. */
const PADRAO = {
  gateway: "infinitepay",
  // InfiniteTag da conta da cliente ($begoniaatelie), sem o cifrão.
  infinitepayHandle: "begoniaatelie",
};

/* Lê do ambiente tratando string vazia como ausência: na Vercel e na
   Cloudflare é comum a variável existir vazia, e "" não deve derrubar o
   padrão. */
function doAmbiente(nome) {
  const valor = process.env[nome];
  if (typeof valor !== "string") return null;
  const limpo = valor.trim();
  return limpo === "" ? null : limpo;
}

function gatewayEscolhido() {
  return doAmbiente("GATEWAY") || PADRAO.gateway;
}

function handleInfinitePay() {
  const h = doAmbiente("INFINITEPAY_HANDLE") || PADRAO.infinitepayHandle;
  return h.replace(/^\$/, ""); // a InfiniteTag é usada sem o cifrão
}

/* Dá para cobrar? Cada gateway depende de uma credencial diferente.
   Só o Mercado Pago pode responder não por falta de configuração — a
   InfinitePay sempre tem handle, nem que seja o padrão acima. */
function pagamentoConfigurado(escolhido = gatewayEscolhido()) {
  if (escolhido === "simulado") return true;
  if (escolhido === "infinitepay") return Boolean(handleInfinitePay());
  return Boolean(doAmbiente("MP_ACCESS_TOKEN"));
}

module.exports = { PADRAO, doAmbiente, gatewayEscolhido, handleInfinitePay, pagamentoConfigurado };
