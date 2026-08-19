/* =========================================================================
   Begônia Ateliê — armazenamento leve dos pedidos.

   Usa a API REST do Upstash Redis (o Redis do marketplace da Vercel), por
   fetch, sem SDK. Se as variáveis não estiverem definidas, cai para memória
   e avisa no log: o site continua vendendo, só perde o histórico entre
   execuções. Nunca deixamos o pagamento falhar por causa do histórico.

   O que é guardado: cliente, endereço, itens, valores e status.
   O que NUNCA é guardado: qualquer dado de cartão (nem os últimos dígitos
   entram no registro) e o CPF — ele é enviado só ao Mercado Pago, que é
   quem precisa dele por obrigação legal.
   ========================================================================= */

const URL_REDIS = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_REDIS = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const configurado = Boolean(URL_REDIS && TOKEN_REDIS);

/* Retenção dos dados pessoais do pedido. LGPD: guardar só pelo tempo
   necessário. 180 dias cobre prazo de troca e conferência fiscal. */
const DIAS_RETENCAO = Number(process.env.RETENCAO_PEDIDOS_DIAS || 180);
const SEGUNDOS_RETENCAO = DIAS_RETENCAO * 24 * 60 * 60;

/* Reserva de memória para quando o Redis não está configurado.

   Fica pendurada em globalThis, e não numa variável do módulo, para
   sobreviver a recarregamento de módulo — o servidor de desenvolvimento
   limpa o require.cache a cada chamada para permitir editar /api sem
   reiniciar, e sem isto o pedido salvo sumiria entre uma requisição e a
   seguinte. Em produção o efeito é o mesmo de antes: um Map por instância. */
const memoria = globalThis.__begoniaMemoria || (globalThis.__begoniaMemoria = new Map());

async function comando(...args) {
  if (!configurado) return null;
  const resposta = await fetch(URL_REDIS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN_REDIS}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!resposta.ok) {
    console.error("[armazenamento] Redis respondeu %s", resposta.status);
    return null;
  }
  const dados = await resposta.json();
  return dados ? dados.result : null;
}

function avisarSeSemRedis(operacao) {
  if (!configurado) {
    console.warn(
      "[armazenamento] Redis não configurado (%s foi para a memória). " +
        "Defina KV_REST_API_URL e KV_REST_API_TOKEN para ter histórico de verdade.",
      operacao
    );
  }
}

/* --- Pedidos ------------------------------------------------------------ */

function chavePedido(referencia) {
  return `begonia:pedido:${referencia}`;
}

async function salvarPedido(referencia, dados) {
  const registro = JSON.stringify({ ...dados, atualizadoEm: new Date().toISOString() });
  avisarSeSemRedis("salvarPedido");
  if (!configurado) {
    memoria.set(chavePedido(referencia), registro);
    return true;
  }
  await comando("SET", chavePedido(referencia), registro, "EX", SEGUNDOS_RETENCAO);
  // Índice cronológico, para a dona conseguir listar os pedidos depois.
  await comando("ZADD", "begonia:pedidos", Date.now(), referencia);
  return true;
}

async function lerPedido(referencia) {
  const bruto = configurado
    ? await comando("GET", chavePedido(referencia))
    : memoria.get(chavePedido(referencia));
  if (!bruto) return null;
  try {
    return typeof bruto === "string" ? JSON.parse(bruto) : bruto;
  } catch {
    return null;
  }
}

async function atualizarPedido(referencia, mudancas) {
  const atual = (await lerPedido(referencia)) || {};
  return salvarPedido(referencia, { ...atual, ...mudancas });
}

/* --- Trava de notificação ----------------------------------------------
   O Mercado Pago reenvia o webhook várias vezes para o mesmo pagamento.
   Esta trava garante que a dona receba UM e-mail por pedido, não cinco.
   SET NX é atômico: só o primeiro a chegar recebe true.
   ----------------------------------------------------------------------- */
async function reservarNotificacao(referencia) {
  const chave = `begonia:notificado:${referencia}`;
  if (!configurado) {
    avisarSeSemRedis("reservarNotificacao");
    if (memoria.has(chave)) return false;
    memoria.set(chave, "1");
    return true;
  }
  const resultado = await comando("SET", chave, new Date().toISOString(), "NX", "EX", SEGUNDOS_RETENCAO);
  return resultado === "OK";
}

/* Libera a trava se a notificação falhou, para o próximo reenvio tentar. */
async function liberarNotificacao(referencia) {
  const chave = `begonia:notificado:${referencia}`;
  if (!configurado) {
    memoria.delete(chave);
    return;
  }
  await comando("DEL", chave);
}

/* --- Limite de taxa -----------------------------------------------------
   Trava simples por IP, para ninguém usar o endpoint de pagamento como
   metralhadora contra a nossa conta do Mercado Pago.
   ----------------------------------------------------------------------- */
async function dentroDoLimite(chaveBruta, limite, janelaSegundos) {
  const chave = `begonia:taxa:${chaveBruta}`;
  if (!configurado) {
    const agora = Date.now();
    const registro = memoria.get(chave) || { contagem: 0, expira: agora + janelaSegundos * 1000 };
    if (agora > registro.expira) {
      registro.contagem = 0;
      registro.expira = agora + janelaSegundos * 1000;
    }
    registro.contagem += 1;
    memoria.set(chave, registro);
    return registro.contagem <= limite;
  }
  const contagem = await comando("INCR", chave);
  if (contagem === 1) await comando("EXPIRE", chave, janelaSegundos);
  return Number(contagem) <= limite;
}

module.exports = {
  configurado,
  salvarPedido,
  lerPedido,
  atualizarPedido,
  reservarNotificacao,
  liberarNotificacao,
  dentroDoLimite,
};
