/* =========================================================================
   Begônia Ateliê — acompanhamento do pedido.

   Duas situações caem aqui:
   • Pix: mostramos o QR code e o copia-e-cola, e ficamos perguntando ao
     servidor se o pagamento caiu.
   • Cartão: o Mercado Pago devolve a pessoa para cá depois de pagar.

   O QR vem do sessionStorage (foi gravado no checkout) porque a API de
   status não devolve dado de cobrança. O status, esse sim, vem sempre do
   servidor — nunca confiamos no que o navegador guardou.
   ========================================================================= */

const API = "/api";
const CHAVE_PEDIDO_ATUAL = "begonia:pedido-atual";

/* Espera crescente: começa rápido, vai desacelerando. Assim quem paga em
   dez segundos vê na hora, e quem deixa a aba aberta não martela a API. */
const ESPERAS = [3, 3, 4, 5, 6, 8, 10, 12, 15, 20];
let tentativa = 0;
let relogioExpiracao = null;

function referenciaDaUrl() {
  return String(new URLSearchParams(location.search).get("ref") || "").trim().toUpperCase();
}

function pedidoGuardado(referencia) {
  try {
    const bruto = JSON.parse(sessionStorage.getItem(CHAVE_PEDIDO_ATUAL));
    return bruto && bruto.referencia === referencia ? bruto : null;
  } catch {
    return null;
  }
}

const raiz = () => document.getElementById("pedido-conteudo");

function pintar(html) {
  raiz().innerHTML = html;
  montarIcones(raiz());
}

/* --- Pedaços reutilizados ----------------------------------------------- */

function resumoDoPedido(dados) {
  if (!dados.itens || !dados.itens.length) return "";
  return `
    <div class="bg-surface-container rounded-xl p-6 md:p-8 mt-10 text-left">
      <h2 class="font-headline text-headline-md text-on-surface mb-5">Seu pedido</h2>
      <ul class="space-y-3 mb-5">
        ${dados.itens
          .map(
            (i) => `
          <li class="flex justify-between gap-4 text-body-md">
            <span class="text-on-surface-variant">${i.quantidade} × ${i.nome}</span>
            <span class="whitespace-nowrap">${formatarPreco(i.precoTotal)}</span>
          </li>`
          )
          .join("")}
      </ul>
      <div class="stitch-rule my-5" role="presentation"></div>
      <dl class="space-y-2 text-body-md">
        ${
          typeof dados.subtotal === "number"
            ? `<div class="flex justify-between"><dt class="text-on-surface-variant">Subtotal</dt><dd>${formatarPreco(dados.subtotal)}</dd></div>`
            : ""
        }
        ${
          typeof dados.frete === "number"
            ? `<div class="flex justify-between"><dt class="text-on-surface-variant">Frete</dt><dd>${dados.frete === 0 ? "Grátis" : formatarPreco(dados.frete)}</dd></div>`
            : ""
        }
        <div class="flex justify-between items-baseline pt-3 border-t border-outline-variant/50">
          <dt class="font-headline text-body-lg">Total</dt>
          <dd class="font-headline text-headline-md text-primary">${formatarPreco(dados.total)}</dd>
        </div>
      </dl>
    </div>`;
}

function selo(iconeNome, corFundo, corTexto) {
  return `<div class="mx-auto grid place-items-center w-20 h-20 rounded-full ${corFundo} ${corTexto} mb-8">
            ${icone(iconeNome, "w-9 h-9")}
          </div>`;
}

/* --- Telas -------------------------------------------------------------- */

function telaCarregando() {
  pintar(`<p class="text-body-md text-on-surface-variant text-center py-24">Consultando seu pedido…</p>`);
}

function telaNaoEncontrado() {
  pintar(`
    <div class="text-center py-20">
      ${selo("busca", "bg-surface-container", "text-primary")}
      <h1 class="font-headline text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
        Não achamos esse pedido
      </h1>
      <p class="text-body-md text-on-surface-variant max-w-md mx-auto mb-10">
        Se você acabou de pagar, espere alguns segundos e atualize a página. Se o link veio
        de outro lugar, confira se está completo.
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <button type="button" onclick="location.reload()" class="btn btn-soft btn-sm">Atualizar</button>
        <a class="js-whatsapp btn btn-outline btn-sm" href="#" target="_blank" rel="noopener"
           data-mensagem="Olá! Fiz um pedido no site e não estou conseguindo acompanhar o status.">Falar com o ateliê</a>
      </div>
    </div>`);
  ligarLinksDeContato();
}

function telaAprovado(dados) {
  pintar(`
    <div class="text-center py-10">
      ${selo("confere", "bg-secondary-container", "text-on-secondary-fixed-variant")}
      <p class="text-label-sm uppercase tracking-[0.2em] text-secondary mb-4">Pagamento aprovado</p>
      <h1 class="font-headline text-headline-lg-mobile md:text-headline-xl text-primary mb-5">
        ${dados.primeiroNome ? `Obrigada, ${dados.primeiroNome}!` : "Obrigada!"}
      </h1>
      <p class="text-body-lg text-on-surface-variant max-w-lg mx-auto">
        Recebemos seu pagamento e o pedido
        <strong class="text-on-surface">${dados.referencia}</strong> já entrou na nossa fila.
        Mandamos o comprovante no seu e-mail, e o código de rastreio vai pelo WhatsApp assim
        que a peça for postada.
      </p>
      ${resumoDoPedido(dados)}
      <div class="flex flex-wrap justify-center gap-3 mt-10">
        <a href="loja.html" class="btn btn-primary">Continuar vendo peças</a>
        <a class="js-whatsapp btn btn-outline" href="#" target="_blank" rel="noopener"
           data-mensagem="Olá! É sobre o pedido ${dados.referencia}.">Falar com o ateliê</a>
      </div>
    </div>`);
  ligarLinksDeContato();
}

function telaRecusado(dados) {
  pintar(`
    <div class="text-center py-10">
      ${selo("fechar", "bg-error-container", "text-on-error-container")}
      <h1 class="font-headline text-headline-lg-mobile md:text-headline-lg text-primary mb-5">
        O pagamento não foi aprovado
      </h1>
      <p class="text-body-md text-on-surface-variant max-w-lg mx-auto mb-10">
        Nada foi cobrado. Pode ter sido um dado digitado diferente ou uma recusa do banco —
        acontece. Dá para tentar de novo com outra forma de pagamento, ou fechar com a gente
        pelo WhatsApp.
      </p>
      <div class="flex flex-wrap justify-center gap-3">
        <a href="loja.html" class="btn btn-primary">Voltar para a loja</a>
        <a class="js-whatsapp btn btn-outline" href="#" target="_blank" rel="noopener"
           data-mensagem="Olá! Meu pagamento do pedido ${dados.referencia} não passou. Podemos resolver por aqui?">Fechar pelo WhatsApp</a>
      </div>
      ${resumoDoPedido(dados)}
    </div>`);
  ligarLinksDeContato();
}

function telaPix(dados, guardado) {
  const temQr = guardado && (guardado.qrCodeImagem || guardado.qrCodeTexto);

  pintar(`
    <div class="py-6">
      <div class="text-center mb-10">
        <p class="text-label-sm uppercase tracking-[0.2em] text-secondary mb-4">Falta só pagar</p>
        <h1 class="font-headline text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
          Seu Pix está pronto
        </h1>
        <p class="text-body-md text-on-surface-variant max-w-md mx-auto">
          Abra o app do seu banco, escolha Pix e leia o código. Assim que o pagamento cair,
          esta página muda sozinha.
        </p>
      </div>

      ${
        temQr
          ? `
        <div class="grid md:grid-cols-2 gap-8 items-start">
          <div>
            ${guardado.qrCodeImagem ? `<div class="qr-moldura soft-shadow"><img src="data:image/png;base64,${guardado.qrCodeImagem}" alt="QR code do Pix no valor de ${formatarPreco(dados.total)}"></div>` : ""}
            <p id="pix-relogio" class="text-label-sm uppercase tracking-wider text-on-surface-variant text-center mt-4"></p>
          </div>
          <div>
            <p class="field-label">Ou use o copia-e-cola</p>
            <p class="pix-codigo mb-3" id="pix-codigo">${guardado.qrCodeTexto || ""}</p>
            <button type="button" id="pix-copiar" class="btn btn-soft btn-sm w-full">
              ${icone("copiar", "w-4 h-4")} <span>Copiar código</span>
            </button>
            <p class="flex items-center gap-2 text-body-md text-on-surface-variant mt-6">
              <span class="inline-block w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse shrink-0"></span>
              Aguardando o pagamento…
            </p>
          </div>
        </div>`
          : `
        <div class="text-center bg-surface-container rounded-xl p-8">
          <p class="text-body-md text-on-surface-variant mb-6">
            O código deste Pix foi gerado em outro dispositivo ou em outra aba. Se você já
            pagou, é só esperar — esta página confirma sozinha.
          </p>
          <p class="flex items-center justify-center gap-2 text-body-md text-on-surface-variant">
            <span class="inline-block w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            Aguardando o pagamento…
          </p>
        </div>`
      }

      ${resumoDoPedido(dados)}

      <p class="text-body-md text-on-surface-variant text-center mt-10">
        Pedido <strong class="text-on-surface">${dados.referencia}</strong>. Guarde essa referência.
      </p>
    </div>`);

  const botaoCopiar = document.getElementById("pix-copiar");
  if (botaoCopiar) {
    botaoCopiar.addEventListener("click", async () => {
      const texto = document.getElementById("pix-codigo").textContent.trim();
      const rotulo = botaoCopiar.querySelector("span");
      try {
        await navigator.clipboard.writeText(texto);
      } catch {
        // Navegador sem permissão de área de transferência: seleciona para o
        // usuário copiar com o teclado.
        const faixa = document.createRange();
        faixa.selectNodeContents(document.getElementById("pix-codigo"));
        const selecao = window.getSelection();
        selecao.removeAllRanges();
        selecao.addRange(faixa);
        rotulo.textContent = "Selecionado — use Ctrl+C";
        return;
      }
      rotulo.textContent = "Copiado!";
      anunciar("Código Pix copiado");
      setTimeout(() => (rotulo.textContent = "Copiar código"), 2500);
    });
  }

  if (guardado && guardado.expiraEm) iniciarRelogio(guardado.expiraEm);
}

function iniciarRelogio(expiraEm) {
  const alvo = new Date(expiraEm).getTime();
  const campo = document.getElementById("pix-relogio");
  if (!campo || Number.isNaN(alvo)) return;

  clearInterval(relogioExpiracao);
  const tique = () => {
    const restam = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
    if (restam === 0) {
      campo.textContent = "Este código expirou";
      campo.className = "text-label-sm uppercase tracking-wider text-error text-center mt-4";
      clearInterval(relogioExpiracao);
      return;
    }
    const min = String(Math.floor(restam / 60)).padStart(2, "0");
    const seg = String(restam % 60).padStart(2, "0");
    campo.textContent = `Código válido por ${min}:${seg}`;
  };
  tique();
  relogioExpiracao = setInterval(tique, 1000);
}

function ligarLinksDeContato() {
  document.querySelectorAll("#pedido-conteudo .js-whatsapp").forEach((el) => {
    el.href = linkWhatsApp(el.dataset.mensagem || "Olá! Vim pelo site do Begônia Ateliê.");
  });
}

/* --- Consulta ----------------------------------------------------------- */

async function consultar(referencia) {
  const guardado = pedidoGuardado(referencia);

  let dados;
  try {
    const resposta = await fetch(`${API}/status-pagamento?ref=${encodeURIComponent(referencia)}`);
    dados = await resposta.json();
    if (!resposta.ok || !dados.ok) {
      if (resposta.status === 404) return telaNaoEncontrado();
      throw new Error(dados.erro || "falhou");
    }
  } catch {
    // Falha de rede não deve apagar o QR da tela de quem está pagando.
    if (guardado && !raiz().querySelector("#pix-codigo")) {
      telaPix({ referencia, total: guardado.total, subtotal: guardado.subtotal, frete: guardado.frete, itens: guardado.itens }, guardado);
    }
    agendarProxima(referencia);
    return;
  }

  if (dados.status === "aprovado") {
    clearInterval(relogioExpiracao);
    sessionStorage.removeItem(CHAVE_PEDIDO_ATUAL);
    return telaAprovado(dados);
  }
  if (dados.status === "recusado" || dados.status === "falhou") {
    clearInterval(relogioExpiracao);
    return telaRecusado(dados);
  }

  // Pendente. Pix mostra o QR; cartão mostra a espera pela confirmação.
  if (dados.metodo === "pix") {
    if (!raiz().querySelector("#pix-codigo") && !raiz().querySelector(".animate-pulse")) {
      telaPix(dados, guardado);
    }
  } else {
    if (!raiz().querySelector("[data-aguardando-cartao]")) {
      pintar(`
        <div class="text-center py-16" data-aguardando-cartao>
          ${selo("relogio", "bg-surface-container", "text-primary")}
          <h1 class="font-headline text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
            Confirmando seu pagamento
          </h1>
          <p class="text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
            O banco está processando. Isso costuma levar alguns segundos — pode deixar esta
            página aberta.
          </p>
          <p class="flex items-center justify-center gap-2 text-body-md text-on-surface-variant">
            <span class="inline-block w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            Pedido ${dados.referencia}
          </p>
          ${resumoDoPedido(dados)}
        </div>`);
    }
  }

  agendarProxima(referencia);
}

function agendarProxima(referencia) {
  const espera = ESPERAS[Math.min(tentativa, ESPERAS.length - 1)];
  tentativa += 1;
  // Depois de uns 20 minutos de aba aberta, paramos de consultar.
  if (tentativa > 120) return;
  setTimeout(() => consultar(referencia), espera * 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const referencia = referenciaDaUrl();
  if (!/^BA-[A-Z2-9]{8}$/.test(referencia)) return telaNaoEncontrado();
  telaCarregando();
  consultar(referencia);
});
