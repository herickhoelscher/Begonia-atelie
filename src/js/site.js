/* =========================================================================
   Begônia Ateliê — comportamento compartilhado por todas as páginas.
   Depende de dados.js, que precisa ser carregado antes.
   ========================================================================= */

/* --- Ícones em SVG inline ------------------------------------------------
   Preferimos SVG a fonte de ícone: nada de ver a palavra "shopping_cart"
   piscando na tela enquanto a fonte carrega. */
const ICONS = {
  busca: '<path d="M11 4a7 7 0 1 0 4.19 12.6l3.6 3.6a1 1 0 0 0 1.42-1.41l-3.6-3.6A7 7 0 0 0 11 4Zm-5 7a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"/>',
  coracao: '<path d="M12 20.7 10.6 19.4C5.4 14.7 2 11.6 2 7.9 2 5.1 4.2 3 7 3c1.7 0 3.3.8 4.3 2.1l.7.9.7-.9C13.7 3.8 15.3 3 17 3c2.8 0 5 2.1 5 4.9 0 3.7-3.4 6.8-8.6 11.5L12 20.7Z"/>',
  coracaoVazio: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 19.2s-6.7-4.3-6.7-8.9a3.7 3.7 0 0 1 6.7-2.2 3.7 3.7 0 0 1 6.7 2.2c0 4.6-6.7 8.9-6.7 8.9Z"/>',
  menu: '<path d="M4 7h16a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2Zm16 4H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2Zm0 6H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2Z"/>',
  fechar: '<path d="M6.4 5A1 1 0 0 0 5 6.4L10.6 12 5 17.6A1 1 0 0 0 6.4 19L12 13.4 17.6 19a1 1 0 0 0 1.4-1.4L13.4 12 19 6.4A1 1 0 0 0 17.6 5L12 10.6 6.4 5Z"/>',
  seta: '<path d="M13.3 5.3a1 1 0 0 0 0 1.4L17.6 11H4a1 1 0 0 0 0 2h13.6l-4.3 4.3a1 1 0 0 0 1.4 1.4l6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 0 0-1.4 0Z"/>',
  chevronEsq: '<path d="M14.7 5.3a1 1 0 0 0-1.4 0l-6 6a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4-1.4L9.4 12l5.3-5.3a1 1 0 0 0 0-1.4Z"/>',
  chevronDir: '<path d="M9.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l5.3-5.3-5.3-5.3a1 1 0 0 1 0-1.4Z"/>',
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 2a8 8 0 1 1-4.1 14.9l-.4-.2-2.6.7.7-2.5-.3-.4A8 8 0 0 1 12 4Zm-3.3 4.3c-.2 0-.5 0-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.7 3 .6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.6-.3-1.6-.8c-.2 0-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.4Z"/>',
  instagram: '<path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm4.5-2.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/>',
  email: '<path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.2l8 4.8 8-4.8V7H4Zm16 2.5-7.5 4.5a1 1 0 0 1-1 0L4 9.5V17h16V9.5Z"/>',
  local: '<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/>',
  sacola: '<path d="M7 7V6a5 5 0 0 1 10 0v1h2.2a1 1 0 0 1 1 .9l1.1 12A2 2 0 0 1 19.3 22H4.7a2 2 0 0 1-2-2.1l1.1-12a1 1 0 0 1 1-.9H7Zm2 0h6V6a3 3 0 0 0-6 0v1ZM5.7 9l-1 11h14.6l-1-11H17v2a1 1 0 1 1-2 0V9H9v2a1 1 0 1 1-2 0V9H5.7Z"/>',
  mais: '<path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5Z"/>',
  menos: '<path d="M5 11h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2Z"/>',
  cadeado: '<path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm3 8H9V7a3 3 0 0 1 6 0v3Zm-9 2h12v8H6v-8Zm6 2a1.5 1.5 0 0 0-.8 2.8V18a.8.8 0 0 0 1.6 0v-1.2A1.5 1.5 0 0 0 12 14Z"/>',
  copiar: '<path d="M9 2h9a2 2 0 0 1 2 2v11h-2V4H9V2Zm-3 4h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2v12h9V8H6Z"/>',
  confere: '<path d="M20.3 5.7a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4l4.3 4.29 9.3-9.29a1 1 0 0 1 1.4 0Z"/>',
  pix: '<path d="M12 2.6 8.9 5.7a3 3 0 0 1-2.1.9H5.7L2.6 9.7a3.2 3.2 0 0 0 0 4.6l3.1 3.1h1.1a3 3 0 0 1 2.1.9l3.1 3.1 3.1-3.1a3 3 0 0 1 2.1-.9h1.1l3.1-3.1a3.2 3.2 0 0 0 0-4.6l-3.1-3.1h-1.1a3 3 0 0 1-2.1-.9L12 2.6Zm0 3.1 2.1 2.1a5 5 0 0 0 3.1 1.4L19 11a1.2 1.2 0 0 1 0 1.8l-1.8 1.8a5 5 0 0 0-3.1 1.4L12 18.3l-2.1-2.1a5 5 0 0 0-3.1-1.4L5 12.8a1.2 1.2 0 0 1 0-1.8l1.8-1.8a5 5 0 0 0 3.1-1.4L12 5.7Z"/>',
  cartao: '<path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Zm2 0v2h14V6H5Zm14 4H5v8h14v-8ZM7 15h4a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2Z"/>',
  relogio: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 3v5.4l4.2 2.5.8-1.4-3-1.8V7h-2Z"/>',
};

/* Devolve o markup de um ícone. */
function icone(nome, classe = "w-5 h-5") {
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="${classe}">${ICONS[nome]}</svg>`;
}

/* Substitui <i data-icone="busca"> pelo SVG correspondente. */
function montarIcones(raiz = document) {
  raiz.querySelectorAll("[data-icone]").forEach((el) => {
    const nome = el.dataset.icone;
    if (!ICONS[nome]) return;
    const classe = el.dataset.iconeClasse || "w-5 h-5";
    el.outerHTML = icone(nome, classe);
  });
}

/* =========================================================================
   Sacola — nasceu da lista de favoritos e continua na mesma chave do
   localStorage, para ninguém perder o que já tinha salvo.

   O formato antigo era ["slug", "slug"]. O novo guarda quantidade:
   [{ slug, quantidade }]. A leitura converte o formato antigo na hora, então
   quem visitou o site antes do checkout existir não perde nada.

   Peça de PRONTA ENTREGA é paga no checkout. Peça SOB ENCOMENDA continua
   fechando pelo WhatsApp, porque o preço final depende de medida e cor.
   ========================================================================= */

const CHAVE_FAVORITOS = "begonia:favoritos";

const Favoritos = {
  ler() {
    let bruto;
    try {
      bruto = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS));
    } catch {
      return [];
    }
    if (!Array.isArray(bruto)) return [];
    return bruto
      .map((item) => {
        // Formato antigo: só a string do slug.
        if (typeof item === "string") return { slug: item, quantidade: 1 };
        if (item && typeof item.slug === "string") {
          const q = Number(item.quantidade);
          return { slug: item.slug, quantidade: Number.isInteger(q) && q > 0 ? q : 1 };
        }
        return null;
      })
      .filter(Boolean);
  },

  gravar(lista) {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(lista));
    document.dispatchEvent(new CustomEvent("favoritos:mudou"));
  },

  tem(slug) {
    return this.ler().some((i) => i.slug === slug);
  },

  quantidade(slug) {
    const item = this.ler().find((i) => i.slug === slug);
    return item ? item.quantidade : 0;
  },

  alternar(slug) {
    const lista = this.ler();
    const i = lista.findIndex((item) => item.slug === slug);
    if (i >= 0) lista.splice(i, 1);
    else lista.push({ slug, quantidade: 1 });
    this.gravar(lista);
    return i < 0;
  },

  adicionar(slug, quantidade = 1) {
    const lista = this.ler();
    const item = lista.find((i) => i.slug === slug);
    if (item) item.quantidade = Math.min(item.quantidade + quantidade, LIMITE_POR_PECA);
    else lista.push({ slug, quantidade: Math.min(quantidade, LIMITE_POR_PECA) });
    this.gravar(lista);
  },

  definirQuantidade(slug, quantidade) {
    const lista = this.ler();
    const item = lista.find((i) => i.slug === slug);
    if (!item) return;
    const q = Math.max(1, Math.min(Number(quantidade) || 1, LIMITE_POR_PECA));
    item.quantidade = q;
    this.gravar(lista);
  },

  remover(slug) {
    this.gravar(this.ler().filter((i) => i.slug !== slug));
  },

  limpar(slugs) {
    if (!slugs) return this.gravar([]);
    this.gravar(this.ler().filter((i) => !slugs.includes(i.slug)));
  },

  /* Itens com o produto já resolvido, ignorando slug que saiu do catálogo. */
  itens() {
    return this.ler()
      .map((i) => {
        const produto = produtoPorSlug(i.slug);
        return produto ? { produto, quantidade: i.quantidade } : null;
      })
      .filter(Boolean);
  },

  /* Separado pelo que dá para pagar online e pelo que não dá. */
  separados() {
    const itens = this.itens();
    return {
      compraveis: itens.filter((i) => i.produto.disponibilidade === "pronta"),
      encomendas: itens.filter((i) => i.produto.disponibilidade !== "pronta"),
    };
  },

  subtotal(itens) {
    return (itens || this.separados().compraveis).reduce(
      (soma, i) => soma + i.produto.preco * i.quantidade,
      0
    );
  },

  /* Total de peças, para o contador do cabeçalho. */
  contagem() {
    return this.itens().reduce((soma, i) => soma + i.quantidade, 0);
  },
};

/* Teto por peça: cada uma é feita à mão, ninguém pede trinta de uma vez.
   O servidor aplica o mesmo limite, este aqui é só para a tela. */
const LIMITE_POR_PECA = typeof PAGAMENTO !== "undefined" ? PAGAMENTO.maxQuantidadePorPeca : 5;

/* =========================================================================
   Cartão de produto — usado na home, na loja e nos relacionados.
   ========================================================================= */

function cartaoProduto(p) {
  const etiquetaDisponibilidade =
    p.disponibilidade === "pronta" ? TAGS.pronta : TAGS.encomenda;
  const etiquetas = [...p.tags.map((t) => TAGS[t]).filter(Boolean), etiquetaDisponibilidade];
  const favoritado = Favoritos.tem(p.slug);

  return `
    <article class="group">
      <div class="relative bg-surface-container-lowest rounded-xl overflow-hidden aspect-4/5 mb-4 soft-shadow transition-transform duration-500 group-hover:-translate-y-1">
        <a href="produto.html?slug=${p.slug}" class="block w-full h-full">
          <img src="${caminhoImagem(p)}" alt="${p.alt}" loading="lazy" width="1200" height="1500"
               class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        </a>
        <div class="absolute top-3 left-3 flex flex-col items-start gap-2 pointer-events-none">
          ${etiquetas.map((t) => `<span class="tag ${t.classe}">${t.texto}</span>`).join("")}
        </div>
        <button type="button"
                class="js-favoritar absolute bottom-3 right-3 grid place-items-center w-10 h-10 rounded-full bg-surface/90 hover:bg-surface text-primary shadow-sm transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 focus-visible:opacity-100"
                data-slug="${p.slug}"
                aria-pressed="${favoritado}"
                aria-label="${favoritado ? "Remover" : "Salvar"} ${p.nome} nos favoritos">
          ${icone(favoritado ? "coracao" : "coracaoVazio", "w-5 h-5")}
        </button>
      </div>
      <h3 class="font-headline text-body-lg text-on-surface transition-colors group-hover:text-primary">
        <a href="produto.html?slug=${p.slug}" class="after:absolute after:inset-0 md:after:content-none">${p.nome}</a>
      </h3>
      <p class="text-body-md text-on-surface-variant mt-1">${formatarPreco(p.preco)}</p>
    </article>`;
}

/* Preenche qualquer <div data-grade="destaque|pronta|encomenda|tudo">.
   Usado na home e nos relacionados da página de produto. */
function montarGrades() {
  document.querySelectorAll("[data-grade]").forEach((el) => {
    const modo = el.dataset.grade;
    const limite = Number(el.dataset.gradeLimite) || 4;
    const excluir = el.dataset.gradeExcluir;
    const categoria = el.dataset.gradeCategoria;

    let lista = PRODUTOS.filter((p) => p.slug !== excluir);
    if (modo === "destaque") lista = lista.filter((p) => p.destaque);
    else if (modo === "pronta") lista = lista.filter((p) => p.disponibilidade === "pronta");
    else if (modo === "encomenda") lista = lista.filter((p) => p.disponibilidade === "encomenda");
    if (categoria) {
      const mesmaCategoria = lista.filter((p) => p.categoria === categoria);
      // Se a categoria não enche a grade, completa com o resto do catálogo.
      lista = [...mesmaCategoria, ...lista.filter((p) => p.categoria !== categoria)];
    }

    el.innerHTML = lista.slice(0, limite).map(cartaoProduto).join("");
    ligarBotoesFavoritar(el);
  });
}

/* Liga os botões de favoritar dentro de um contêiner recém-renderizado. */
function ligarBotoesFavoritar(raiz = document) {
  raiz.querySelectorAll(".js-favoritar").forEach((btn) => {
    if (btn.dataset.ligado) return;
    btn.dataset.ligado = "1";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const slug = btn.dataset.slug;
      const agora = Favoritos.alternar(slug);
      const produto = produtoPorSlug(slug);
      btn.setAttribute("aria-pressed", String(agora));
      btn.setAttribute(
        "aria-label",
        `${agora ? "Remover" : "Salvar"} ${produto.nome} nos favoritos`
      );
      btn.innerHTML = icone(agora ? "coracao" : "coracaoVazio", "w-5 h-5");
      anunciar(agora ? `${produto.nome} salvo nos favoritos` : `${produto.nome} removido dos favoritos`);
    });
  });
}

/* Região viva para leitores de tela. */
function anunciar(texto) {
  let regiao = document.getElementById("anuncios");
  if (!regiao) {
    regiao = document.createElement("div");
    regiao.id = "anuncios";
    regiao.className = "sr-only";
    regiao.setAttribute("role", "status");
    regiao.setAttribute("aria-live", "polite");
    document.body.appendChild(regiao);
  }
  regiao.textContent = texto;
}

/* =========================================================================
   Painéis deslizantes: menu mobile, busca e favoritos.
   ========================================================================= */

function abrirPainel(id) {
  const painel = document.getElementById(id);
  if (!painel) return;
  painel.classList.remove("hidden");
  requestAnimationFrame(() => painel.dataset.aberto = "1");
  document.body.classList.add("no-scroll");
  const focavel = painel.querySelector("input, button, a");
  if (focavel) focavel.focus();
}

function fecharPainel(id) {
  const painel = document.getElementById(id);
  if (!painel) return;
  delete painel.dataset.aberto;
  document.body.classList.remove("no-scroll");
  setTimeout(() => painel.classList.add("hidden"), 300);
}

function fecharTodosPaineis() {
  document.querySelectorAll("[data-painel]").forEach((p) => fecharPainel(p.id));
}

/* =========================================================================
   Gaveta da sacola
   ========================================================================= */

function linhaSacola({ produto, quantidade }, comQuantidade) {
  const controles = comQuantidade
    ? `
      <div class="flex items-center gap-1 mt-3">
        <button type="button" class="js-qtd stepper" data-slug="${produto.slug}" data-passo="-1"
                aria-label="Tirar uma unidade de ${produto.nome}" ${quantidade <= 1 ? "disabled" : ""}>
          ${icone("menos", "w-4 h-4")}
        </button>
        <span class="w-9 text-center text-body-md tabular-nums" aria-live="polite"
              aria-label="${quantidade} ${quantidade === 1 ? "unidade" : "unidades"}">${quantidade}</span>
        <button type="button" class="js-qtd stepper" data-slug="${produto.slug}" data-passo="1"
                aria-label="Somar uma unidade de ${produto.nome}" ${quantidade >= LIMITE_POR_PECA ? "disabled" : ""}>
          ${icone("mais", "w-4 h-4")}
        </button>
      </div>`
    : `<p class="text-label-sm uppercase tracking-wider text-tertiary mt-3">Fechamos pelo WhatsApp</p>`;

  return `
    <li class="flex gap-4 py-5 border-b border-outline-variant/40 last:border-0">
      <a href="produto.html?slug=${produto.slug}" class="shrink-0">
        <img src="${caminhoImagem(produto)}" alt="${produto.alt}" loading="lazy"
             class="w-20 h-24 object-cover rounded-md">
      </a>
      <div class="flex-1 min-w-0">
        <a href="produto.html?slug=${produto.slug}"
           class="font-headline text-body-lg text-on-surface hover:text-primary transition-colors">${produto.nome}</a>
        <p class="text-body-md text-on-surface-variant mt-1">
          ${formatarPreco(produto.preco * quantidade)}
          ${quantidade > 1 ? `<span class="text-label-sm text-on-surface-variant/70">(${formatarPreco(produto.preco)} cada)</span>` : ""}
        </p>
        ${controles}
      </div>
      <button type="button" class="js-remover-favorito shrink-0 self-start p-2 -m-2 text-on-surface-variant hover:text-primary transition-colors"
              data-slug="${produto.slug}" aria-label="Tirar ${produto.nome} da sacola">
        ${icone("fechar", "w-4 h-4")}
      </button>
    </li>`;
}

function renderizarFavoritos() {
  const corpo = document.getElementById("favoritos-corpo");
  const rodape = document.getElementById("favoritos-rodape");
  if (!corpo) return;

  const { compraveis, encomendas } = Favoritos.separados();
  const total = Favoritos.contagem();

  // Contador no cabeçalho.
  document.querySelectorAll(".js-contador-favoritos").forEach((el) => {
    el.textContent = total;
    el.classList.toggle("hidden", total === 0);
  });

  if (total === 0) {
    corpo.innerHTML = `
      <div class="text-center py-16 px-6">
        <div class="mx-auto grid place-items-center w-16 h-16 rounded-full bg-surface-container text-primary mb-6">
          ${icone("sacola", "w-8 h-8")}
        </div>
        <p class="font-headline text-headline-md text-on-surface mb-2">Sua sacola está vazia</p>
        <p class="text-body-md text-on-surface-variant mb-8">
          Guarde aqui as peças que você quiser levar.
        </p>
        <a href="loja.html" class="btn btn-outline btn-sm">Ver a loja</a>
      </div>`;
    rodape.classList.add("hidden");
    return;
  }

  const grupo = (titulo, itens, comQuantidade) =>
    itens.length
      ? `<li>
           <p class="text-label-sm uppercase tracking-wider text-on-surface-variant pt-5 pb-1">${titulo}</p>
           <ul>${itens.map((i) => linhaSacola(i, comQuantidade)).join("")}</ul>
         </li>`
      : "";

  // Sem peça sob encomenda na sacola, o título de grupo vira ruído.
  corpo.innerHTML =
    encomendas.length === 0
      ? compraveis.map((i) => linhaSacola(i, true)).join("")
      : grupo("Pronta entrega", compraveis, true) + grupo("Sob encomenda", encomendas, false);

  const subtotal = Favoritos.subtotal(compraveis);
  const listaEncomendas = encomendas
    .map((i) => `• ${i.quantidade}x ${i.produto.nome} — ${formatarPreco(i.produto.preco * i.quantidade)}`)
    .join("\n");
  const mensagemEncomenda = `Olá! Vim pelo site e queria encomendar:

${listaEncomendas}

Podemos conversar sobre cores, medidas e prazo?`;

  rodape.classList.remove("hidden");
  rodape.innerHTML = `
    ${
      compraveis.length
        ? `<div class="flex items-baseline justify-between mb-2">
             <span class="text-label-sm uppercase tracking-wider text-on-surface-variant">Subtotal</span>
             <span class="font-headline text-headline-md text-primary">${formatarPreco(subtotal)}</span>
           </div>
           <p class="text-label-sm text-on-surface-variant normal-case tracking-normal mb-5">
             O frete aparece no próximo passo, depois do CEP.
           </p>
           <a href="checkout.html" class="btn btn-primary w-full">
             ${icone("sacola", "w-4 h-4")} Finalizar compra
           </a>`
        : ""
    }
    ${
      encomendas.length
        ? `<a href="${linkWhatsApp(mensagemEncomenda)}" target="_blank" rel="noopener"
              class="btn btn-outline w-full ${compraveis.length ? "mt-3" : ""}">
             ${icone("whatsapp", "w-4 h-4")} Pedir encomendas pelo WhatsApp
           </a>
           <p class="text-label-sm text-on-surface-variant text-center mt-4 normal-case tracking-normal">
             Peça sob medida tem preço fechado na conversa, por isso não entra no checkout.
           </p>`
        : ""
    }`;

  corpo.querySelectorAll(".js-remover-favorito").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = produtoPorSlug(btn.dataset.slug);
      Favoritos.remover(btn.dataset.slug);
      anunciar(`${p.nome} saiu da sacola`);
    });
  });

  corpo.querySelectorAll(".js-qtd").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.slug;
      const passo = Number(btn.dataset.passo);
      const nova = Favoritos.quantidade(slug) + passo;
      Favoritos.definirQuantidade(slug, nova);
      anunciar(`${produtoPorSlug(slug).nome}: ${Favoritos.quantidade(slug)}`);
    });
  });
}

/* =========================================================================
   Busca
   ========================================================================= */

function ligarBusca() {
  const campo = document.getElementById("busca-campo");
  const saida = document.getElementById("busca-resultados");
  if (!campo || !saida) return;

  // Compara sem acento: quem busca "macrame" tem de achar "macramê".
  const normalizar = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function buscar() {
    const termo = normalizar(campo.value.trim());
    if (termo.length < 2) {
      saida.innerHTML = `
        <p class="text-body-md text-on-surface-variant text-center py-10">
          Digite ao menos duas letras — tente "cardigan", "macramê" ou "planta".
        </p>`;
      return;
    }

    const nomeCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.nome || "";
    const achados = PRODUTOS.filter((p) =>
      normalizar(`${p.nome} ${p.resumo} ${nomeCategoria(p.categoria)}`).includes(termo)
    );

    if (achados.length === 0) {
      saida.innerHTML = `
        <p class="text-body-md text-on-surface-variant text-center py-10">
          Não encontramos nada para “${campo.value.trim()}”.
          <a href="sob-encomenda.html" class="text-primary underline underline-offset-4">Que tal encomendar sob medida?</a>
        </p>`;
      return;
    }

    saida.innerHTML = `
      <p class="text-label-sm uppercase tracking-wider text-on-surface-variant mb-4">
        ${achados.length} ${achados.length === 1 ? "peça encontrada" : "peças encontradas"}
      </p>
      <ul class="space-y-2">
        ${achados
          .map(
            (p) => `
          <li>
            <a href="produto.html?slug=${p.slug}"
               class="flex gap-4 items-center p-3 rounded-lg hover:bg-surface-container transition-colors">
              <img src="${caminhoImagem(p)}" alt="" loading="lazy" class="w-14 h-16 object-cover rounded-md">
              <span class="min-w-0">
                <span class="block font-headline text-body-lg text-on-surface">${p.nome}</span>
                <span class="block text-body-md text-on-surface-variant truncate">${p.resumo}</span>
              </span>
              <span class="ml-auto text-body-md text-primary whitespace-nowrap">${formatarPreco(p.preco)}</span>
            </a>
          </li>`
          )
          .join("")}
      </ul>`;
  }

  campo.addEventListener("input", buscar);
  buscar();
}

/* =========================================================================
   Revelação suave no scroll
   ========================================================================= */

function ligarRevelacao() {
  const alvos = document.querySelectorAll(".reveal");
  if (!alvos.length) return;

  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    alvos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("is-visible");
        observador.unobserve(entrada.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );

  alvos.forEach((el) => observador.observe(el));
}

/* =========================================================================
   Inicialização
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  montarIcones();

  // Sombra do cabeçalho ao rolar.
  const cabecalho = document.getElementById("cabecalho");
  if (cabecalho) {
    const aoRolar = () => cabecalho.classList.toggle("shadow-md", window.scrollY > 10);
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
  }

  // Abrir e fechar painéis.
  document.querySelectorAll("[data-abrir]").forEach((btn) => {
    btn.addEventListener("click", () => abrirPainel(btn.dataset.abrir));
  });
  document.querySelectorAll("[data-fechar]").forEach((btn) => {
    btn.addEventListener("click", () => fecharPainel(btn.dataset.fechar));
  });
  document.querySelectorAll("[data-painel] [data-fundo]").forEach((fundo) => {
    fundo.addEventListener("click", () => fecharPainel(fundo.closest("[data-painel]").id));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharTodosPaineis();
  });

  // Ano corrente no rodapé.
  document.querySelectorAll(".js-ano").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Links de contato montados a partir de dados.js.
  document.querySelectorAll(".js-whatsapp").forEach((el) => {
    el.href = linkWhatsApp(el.dataset.mensagem || "Olá! Vim pelo site do Begônia Ateliê.");
  });
  document.querySelectorAll(".js-instagram").forEach((el) => (el.href = ATELIE.instagram));
  document.querySelectorAll(".js-email").forEach((el) => {
    el.href = `mailto:${ATELIE.email}`;
    if (el.dataset.texto === "1") el.textContent = ATELIE.email;
  });

  montarGrades();
  renderizarFavoritos();
  document.addEventListener("favoritos:mudou", renderizarFavoritos);

  ligarBusca();
  ligarBotoesFavoritar();
  ligarRevelacao();
});
