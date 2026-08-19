/* =========================================================================
   Begônia Ateliê — checkout.

   Este arquivo monta o formulário, calcula o que mostrar na tela e chama
   /api/criar-pagamento. Ele NÃO decide preço: o valor exibido aqui é uma
   prévia calculada com as mesmas regras de dados.js, e quem fecha a conta
   é sempre o servidor. Se os dois discordarem, vale o servidor.

   Nenhum dado de cartão passa por este código. Para cartão, mandamos a
   pessoa para o ambiente do Mercado Pago.
   ========================================================================= */

const API = "/api";
const CHAVE_PEDIDO_ATUAL = "begonia:pedido-atual";
const CHAVE_RASCUNHO = "begonia:checkout-rascunho";

let CONFIG = null;

/* Atalhos para o que o gateway ativo sabe fazer. */
function capacidades() {
  return (CONFIG && CONFIG.capacidades) || {};
}
function escolhaNoGateway() {
  return Boolean(capacidades().escolhaNoGateway);
}

/* Nome do provedor, declarado pelo próprio gateway. */
function nomeProvedor() {
  return capacidades().rotulo || "nosso provedor de pagamento";
}

/* --- Máscaras: ajudam a digitar, não substituem validação --------------- */

function mascararCep(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function mascararCpf(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

function mascararTelefone(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/* --- Erros por campo ---------------------------------------------------- */

function marcarErro(campo, mensagem) {
  const input = document.getElementById(`c-${campo}`);
  if (!input) return;
  input.setAttribute("aria-invalid", "true");
  let aviso = document.getElementById(`erro-${campo}`);
  if (!aviso) {
    aviso = document.createElement("span");
    aviso.id = `erro-${campo}`;
    aviso.className = "erro-campo";
    input.insertAdjacentElement("afterend", aviso);
  }
  aviso.textContent = mensagem;
  input.setAttribute("aria-describedby", aviso.id);
}

function limparErros() {
  document.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  document.querySelectorAll(".erro-campo").forEach((el) => el.remove());
  const geral = document.getElementById("c-erro");
  geral.classList.add("hidden");
  geral.textContent = "";
}

function mostrarErroGeral(texto) {
  const geral = document.getElementById("c-erro");
  geral.textContent = texto;
  geral.classList.remove("hidden");
  geral.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* --- Resumo do pedido --------------------------------------------------- */

function itensCompraveis() {
  return Favoritos.separados().compraveis;
}

function ufEscolhida() {
  return document.getElementById("c-estado").value;
}

/* Prévia do frete, com as mesmas regras que o servidor aplica. */
function calcularResumo() {
  const itens = itensCompraveis();
  const subtotal = itens.reduce((s, i) => s + i.produto.preco * i.quantidade, 0);
  const uf = ufEscolhida();
  const frete = uf ? fretePara(uf, subtotal) : null;
  return { itens, subtotal, frete, total: frete === null ? null : subtotal + frete };
}

function renderizarResumo() {
  const { itens, subtotal, frete, total } = calcularResumo();

  document.getElementById("c-itens").innerHTML = itens
    .map(
      (i) => `
      <li class="flex gap-3 items-start">
        <img src="${caminhoImagem(i.produto)}" alt="" loading="lazy"
             class="w-14 h-16 object-cover rounded-md shrink-0">
        <div class="flex-1 min-w-0">
          <p class="font-headline text-body-md text-on-surface leading-snug">${i.produto.nome}</p>
          <p class="text-label-sm text-on-surface-variant normal-case tracking-normal mt-1">
            ${i.quantidade} × ${formatarPreco(i.produto.preco)}
          </p>
        </div>
        <span class="text-body-md whitespace-nowrap">${formatarPreco(i.produto.preco * i.quantidade)}</span>
      </li>`
    )
    .join("");

  document.getElementById("c-subtotal").textContent = formatarPreco(subtotal);

  const campoFrete = document.getElementById("c-frete");
  if (frete === null) {
    campoFrete.textContent = "Informe o CEP";
    campoFrete.className = "text-right text-on-surface-variant";
  } else if (frete === 0) {
    campoFrete.textContent = "Grátis";
    campoFrete.className = "text-right text-secondary font-semibold";
  } else {
    campoFrete.textContent = formatarPreco(frete);
    campoFrete.className = "text-right";
  }

  document.getElementById("c-total").textContent = total === null ? "—" : formatarPreco(total);
}

/* --- Progresso ---------------------------------------------------------- */

function secaoCompleta(secao) {
  const obrigatorios = document.querySelectorAll(`[data-secao="${secao}"] [required]`);
  return [...obrigatorios].every((el) => el.value.trim() !== "");
}

function atualizarPassos() {
  const estados = {
    dados: secaoCompleta("dados"),
    entrega: secaoCompleta("entrega"),
    // Quando a forma de pagamento é escolhida na página do gateway, não há
    // nada a preencher aqui: o passo conta como pronto.
    pagamento: escolhaNoGateway() || Boolean(document.querySelector('input[name="metodo"]:checked')),
  };
  const ordem = ["dados", "entrega", "pagamento"];
  const atual = ordem.find((s) => !estados[s]) || "pagamento";

  // Um passo só conta como concluído quando ele E todos os anteriores estão
  // prontos. Sem isso, "Pagamento" nasceria verde só porque o Pix já vem
  // marcado, com os dados ainda em branco.
  let anterioresOk = true;
  ordem.forEach((nome) => {
    const el = document.querySelector(`.passo[data-passo="${nome}"]`);
    if (!el) return;
    el.removeAttribute("aria-current");
    el.removeAttribute("data-concluido");
    const concluido = anterioresOk && estados[nome];
    if (concluido) el.setAttribute("data-concluido", "1");
    if (nome === atual) el.setAttribute("aria-current", "step");
    anterioresOk = anterioresOk && estados[nome];
  });
}

/* --- Rascunho: ninguém quer redigitar o endereço ------------------------ */

function salvarRascunho() {
  const dados = {};
  document.querySelectorAll("#form-checkout input, #form-checkout select, #form-checkout textarea").forEach((el) => {
    // O CPF não fica salvo no navegador: é dado sensível e some ao sair.
    if (!el.name || el.name === "cpf" || el.type === "radio") return;
    dados[el.name] = el.value;
  });
  try {
    sessionStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(dados));
  } catch {
    /* sessionStorage cheio ou bloqueado: seguir sem rascunho é aceitável. */
  }
}

function carregarRascunho() {
  let dados;
  try {
    dados = JSON.parse(sessionStorage.getItem(CHAVE_RASCUNHO));
  } catch {
    return;
  }
  if (!dados) return;
  Object.entries(dados).forEach(([nome, valor]) => {
    const el = document.querySelector(`#form-checkout [name="${nome}"]`);
    if (el) el.value = valor;
  });
}

/* --- Busca de endereço pelo CEP ---------------------------------------- */

async function buscarCep(cep) {
  const aviso = document.getElementById("c-cep-aviso");
  const digitos = cep.replace(/\D/g, "");
  if (digitos.length !== 8) return;

  aviso.textContent = "Procurando o endereço…";
  aviso.classList.remove("hidden");

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
    const dados = await resposta.json();
    if (dados.erro) {
      aviso.textContent = "CEP não encontrado. Preencha o endereço à mão.";
      return;
    }
    // Só preenche o que estiver vazio, para não apagar correção manual.
    const preencher = (id, valor) => {
      const el = document.getElementById(id);
      if (el && valor && !el.value.trim()) el.value = valor;
    };
    preencher("c-rua", dados.logradouro);
    preencher("c-bairro", dados.bairro);
    preencher("c-cidade", dados.localidade);
    const estado = document.getElementById("c-estado");
    if (dados.uf && !estado.value) estado.value = dados.uf;

    aviso.classList.add("hidden");
    renderizarResumo();
    atualizarPassos();
    document.getElementById("c-numero").focus();
  } catch {
    // Sem internet ou serviço fora: o formulário continua utilizável à mão.
    aviso.textContent = "Não consegui buscar o CEP agora. Pode preencher à mão.";
  }
}

/* --- Envio -------------------------------------------------------------- */

async function enviar(evento) {
  evento.preventDefault();
  limparErros();

  const botao = document.getElementById("c-enviar");
  const textoBotao = document.getElementById("c-enviar-texto");
  const escolhido = document.querySelector('input[name="metodo"]:checked');

  // "checkout" avisa ao servidor que a forma será escolhida no gateway.
  const metodo = escolhaNoGateway() ? "checkout" : escolhido && escolhido.value;

  if (!metodo) {
    mostrarErroGeral("Escolha como você quer pagar.");
    return;
  }

  const itens = itensCompraveis().map((i) => ({ slug: i.produto.slug, quantidade: i.quantidade }));
  if (!itens.length) {
    mostrarErroGeral("Sua sacola está vazia.");
    return;
  }

  const valor = (id) => document.getElementById(id).value.trim();
  const corpo = {
    metodo,
    itens,
    cliente: {
      nome: valor("c-nome"),
      email: valor("c-email"),
      whatsapp: valor("c-whatsapp"),
      cpf: valor("c-cpf"),
    },
    entrega: {
      cep: valor("c-cep"),
      rua: valor("c-rua"),
      numero: valor("c-numero"),
      complemento: valor("c-complemento"),
      bairro: valor("c-bairro"),
      cidade: valor("c-cidade"),
      estado: valor("c-estado"),
    },
    observacoes: valor("c-observacoes"),
  };

  botao.disabled = true;
  textoBotao.textContent = "Abrindo o pagamento…";

  let resposta, dados;
  try {
    resposta = await fetch(`${API}/criar-pagamento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    dados = await resposta.json();
  } catch {
    botao.disabled = false;
    textoBotao.textContent = "Ir para o pagamento";
    mostrarErroGeral("Não conseguimos falar com o servidor. Confira sua conexão e tente de novo.");
    return;
  }

  if (!resposta.ok || !dados.ok) {
    botao.disabled = false;
    textoBotao.textContent = "Ir para o pagamento";
    if (dados && dados.campos) {
      Object.entries(dados.campos).forEach(([campo, mensagem]) => marcarErro(campo, mensagem));
      const primeiro = document.querySelector("[aria-invalid]");
      if (primeiro) primeiro.focus();
    }
    mostrarErroGeral((dados && dados.erro) || "Não foi possível seguir para o pagamento.");
    return;
  }

  // Guarda o necessário para a tela de acompanhamento — inclusive o QR do Pix,
  // que só vem nesta resposta.
  try {
    sessionStorage.setItem(
      CHAVE_PEDIDO_ATUAL,
      JSON.stringify({
        referencia: dados.referencia,
        metodo: dados.metodo,
        total: dados.total,
        subtotal: dados.subtotal,
        frete: dados.frete,
        itens: dados.itens,
        qrCodeTexto: dados.qrCodeTexto,
        qrCodeImagem: dados.qrCodeImagem,
        expiraEm: dados.expiraEm,
      })
    );
  } catch {
    /* Sem sessionStorage a tela de pedido busca tudo pela API. */
  }

  // A sacola só é esvaziada depois que o pagamento é criado com sucesso.
  Favoritos.limpar(itens.map((i) => i.slug));
  sessionStorage.removeItem(CHAVE_RASCUNHO);

  if (dados.tipo === "redirecionamento" && dados.url) {
    window.location.href = dados.url;
  } else {
    window.location.href = `pedido.html?ref=${encodeURIComponent(dados.referencia)}`;
  }
}

/* --- Montagem ----------------------------------------------------------- */

function montarMetodos() {
  const caixa = document.getElementById("c-metodos");
  const iconePorMetodo = { pix: "pix", cartao: "cartao", debito: "cartao" };
  const metodos = CONFIG && CONFIG.metodos ? CONFIG.metodos : PAGAMENTO.metodos;
  const provedor = nomeProvedor();

  // Gateway de link único (InfinitePay): a forma de pagamento é escolhida na
  // página dele. Mostrar um seletor aqui seria prometer uma escolha que a
  // gente não controla — então listamos o que é aceito e explicamos onde
  // escolher.
  if (escolhaNoGateway()) {
    caixa.removeAttribute("role");
    caixa.removeAttribute("aria-label");
    caixa.innerHTML = `
      <div class="p-5 rounded-md bg-surface-container-low">
        <p class="text-body-md text-on-surface mb-4">
          Você escolhe como pagar na próxima etapa, direto em ${provedor}.
        </p>
        <ul class="flex flex-wrap gap-3">
          ${metodos
            .map(
              (m) => `
            <li class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant">
              <span class="text-primary">${icone(iconePorMetodo[m.id] || "cartao", "w-5 h-5")}</span>
              <span class="text-body-md text-on-surface">${m.nome}</span>
            </li>`
            )
            .join("")}
        </ul>
      </div>`;
    return;
  }

  caixa.innerHTML = metodos
    .map(
      (m, indice) => `
      <label class="metodo">
        <input type="radio" name="metodo" value="${m.id}" class="mt-1 accent-primary w-4 h-4"
               ${indice === 0 ? "checked" : ""}>
        <span class="text-primary shrink-0 mt-0.5">${icone(iconePorMetodo[m.id] || "cartao", "w-6 h-6")}</span>
        <span class="min-w-0">
          <span class="block font-headline text-body-lg text-on-surface">${m.nome}</span>
          <span class="block text-body-md text-on-surface-variant">${m.descricao}</span>
        </span>
      </label>`
    )
    .join("");
}

function montarEstados() {
  const select = document.getElementById("c-estado");
  const lista = CONFIG && CONFIG.ufs ? CONFIG.ufs : UFS;
  select.innerHTML =
    '<option value="">UF</option>' + lista.map((uf) => `<option value="${uf}">${uf}</option>`).join("");
}

/* O CPF só aparece quando o gateway precisa dele. O Mercado Pago exige para
   emitir o Pix; a InfinitePay coleta o que precisa na página dela, então o
   campo some — um dado sensível a menos passando por aqui. */
function ajustarCpf() {
  const campo = document.getElementById("c-cpf");
  const nota = document.getElementById("c-cpf-nota");
  const bloco = campo.closest("div");

  if (!capacidades().exigeCpf) {
    campo.required = false;
    campo.value = "";
    bloco.classList.add("hidden");
    return;
  }

  bloco.classList.remove("hidden");
  const metodo = document.querySelector('input[name="metodo"]:checked');
  const ehPix = metodo && metodo.value === "pix";
  campo.required = ehPix;
  nota.textContent = ehPix ? "— obrigatório para pagar no Pix" : "— opcional no cartão";
}

document.addEventListener("DOMContentLoaded", async () => {
  const vazio = document.getElementById("checkout-vazio");
  const indisponivel = document.getElementById("checkout-indisponivel");
  const conteudo = document.getElementById("checkout-conteudo");

  if (itensCompraveis().length === 0) {
    const encomendas = Favoritos.separados().encomendas;
    // Sacola só com peça sob encomenda não é sacola vazia: é outro caminho.
    // Dizer "está vazia" aqui faria a pessoa achar que perdeu o que escolheu.
    if (encomendas.length) {
      const lista = encomendas
        .map((i) => `• ${i.quantidade}x ${i.produto.nome} — ${formatarPreco(i.produto.preco * i.quantidade)}`)
        .join("\n");
      vazio.querySelector("h1").textContent = "Essas peças são feitas sob medida";
      vazio.querySelector("p").textContent =
        "Elas continuam guardadas na sua sacola. Como o preço final depende de cor, medida e prazo, a gente fecha esse tipo de peça conversando.";
      const acao = vazio.querySelector("a");
      acao.textContent = "Combinar pelo WhatsApp";
      acao.href = linkWhatsApp(`Olá! Vim pelo site e queria encomendar:

${lista}

Podemos conversar sobre cores, medidas e prazo?`);
      acao.target = "_blank";
      acao.rel = "noopener";
    }
    vazio.classList.remove("hidden");
    montarIcones(vazio);
    return;
  }

  // Pergunta ao servidor o que está ativo antes de mostrar o formulário.
  try {
    const resposta = await fetch(`${API}/config`);
    CONFIG = await resposta.json();
  } catch {
    CONFIG = null;
  }

  if (!CONFIG || !CONFIG.pagamentoDisponivel) {
    const itens = itensCompraveis();
    const lista = itens
      .map((i) => `• ${i.quantidade}x ${i.produto.nome} — ${formatarPreco(i.produto.preco * i.quantidade)}`)
      .join("\n");
    const total = itens.reduce((s, i) => s + i.produto.preco * i.quantidade, 0);
    document.getElementById("checkout-whatsapp-alternativo").href = linkWhatsApp(
      `Olá! Quero fechar este pedido:\n\n${lista}\n\nTotal das peças: ${formatarPreco(total)}`
    );
    indisponivel.classList.remove("hidden");
    montarIcones(indisponivel);
    return;
  }

  conteudo.classList.remove("hidden");

  // O selo cita o provedor certo, seja qual for o gateway ativo.
  const selo = conteudo.querySelector(".selo-seguro");
  if (selo) {
    selo.lastChild.textContent =
      ` Os dados do cartão são digitados em ${nomeProvedor()}, não aqui. Este site nunca vê o número do seu cartão.`;
  }

  // Modo simulado: ninguém pode achar que fez uma compra de verdade.
  if (CONFIG.simulado) {
    conteudo.insertAdjacentHTML(
      "afterbegin",
      `<p class="flex items-start gap-3 p-4 mb-8 rounded-md bg-tertiary-fixed text-on-tertiary-fixed text-body-md">
         <span class="shrink-0 mt-0.5">${icone("relogio", "w-5 h-5")}</span>
         <span><strong>Modo de teste.</strong> O pagamento é simulado e aprova sozinho em alguns
         segundos. Nada é cobrado e nenhuma peça é reservada.</span>
       </p>`
    );
  }

  montarEstados();
  montarMetodos();
  montarIcones(conteudo);
  carregarRascunho();
  ajustarCpf();
  renderizarResumo();
  atualizarPassos();

  // Máscaras.
  const cep = document.getElementById("c-cep");
  cep.addEventListener("input", () => (cep.value = mascararCep(cep.value)));
  cep.addEventListener("blur", () => buscarCep(cep.value));

  const cpf = document.getElementById("c-cpf");
  cpf.addEventListener("input", () => (cpf.value = mascararCpf(cpf.value)));

  const tel = document.getElementById("c-whatsapp");
  tel.addEventListener("input", () => (tel.value = mascararTelefone(tel.value)));

  // Frete e progresso reagem ao que a pessoa preenche.
  document.getElementById("c-estado").addEventListener("change", () => {
    renderizarResumo();
    atualizarPassos();
  });
  document.getElementById("form-checkout").addEventListener("input", () => {
    atualizarPassos();
    salvarRascunho();
  });
  document.getElementById("form-checkout").addEventListener("change", (e) => {
    if (e.target.name === "metodo") ajustarCpf();
    atualizarPassos();
  });

  document.getElementById("form-checkout").addEventListener("submit", enviar);

  // Se a sacola mudar pela gaveta enquanto o checkout está aberto.
  document.addEventListener("favoritos:mudou", () => {
    if (itensCompraveis().length === 0) {
      window.location.reload();
      return;
    }
    renderizarResumo();
  });
});
