/* =========================================================================
   Begônia Ateliê — filtros, ordenação e paginação da loja.
   Todo o estado vive na URL, então um filtro aplicado pode ser compartilhado.
   ========================================================================= */

const POR_PAGINA = 8;
const PRECO_TETO = Math.ceil(Math.max(...PRODUTOS.map((p) => p.preco)) / 50) * 50;

const estado = {
  categorias: new Set(),
  disponibilidade: new Set(),
  precoMax: PRECO_TETO,
  ordem: "relevancia",
  pagina: 1,
};

/* --- Estado ↔ URL -------------------------------------------------------- */

function lerEstadoDaUrl() {
  const q = new URLSearchParams(location.search);
  const cat = q.get("cat");
  const disp = q.get("disp");
  if (cat) cat.split(",").forEach((c) => estado.categorias.add(c));
  if (disp) disp.split(",").forEach((d) => estado.disponibilidade.add(d));
  if (q.get("max")) estado.precoMax = Number(q.get("max")) || PRECO_TETO;
  if (q.get("ordem")) estado.ordem = q.get("ordem");
  if (q.get("pagina")) estado.pagina = Math.max(1, Number(q.get("pagina")) || 1);
}

function gravarEstadoNaUrl() {
  const q = new URLSearchParams();
  if (estado.categorias.size) q.set("cat", [...estado.categorias].join(","));
  if (estado.disponibilidade.size) q.set("disp", [...estado.disponibilidade].join(","));
  if (estado.precoMax < PRECO_TETO) q.set("max", estado.precoMax);
  if (estado.ordem !== "relevancia") q.set("ordem", estado.ordem);
  if (estado.pagina > 1) q.set("pagina", estado.pagina);
  const busca = q.toString();
  history.replaceState(null, "", busca ? `?${busca}` : location.pathname);
}

/* --- Seleção ------------------------------------------------------------- */

function produtosFiltrados() {
  let lista = PRODUTOS.filter((p) => {
    if (estado.categorias.size && !estado.categorias.has(p.categoria)) return false;
    if (estado.disponibilidade.size && !estado.disponibilidade.has(p.disponibilidade)) return false;
    if (p.preco > estado.precoMax) return false;
    return true;
  });

  const ordenadores = {
    menor: (a, b) => a.preco - b.preco,
    maior: (a, b) => b.preco - a.preco,
    novidades: (a, b) => Number(b.tags.includes("novo")) - Number(a.tags.includes("novo")),
    relevancia: (a, b) => Number(b.destaque) - Number(a.destaque),
  };
  return lista.sort(ordenadores[estado.ordem] || ordenadores.relevancia);
}

/* --- Desenho ------------------------------------------------------------- */

function desenhar() {
  const lista = produtosFiltrados();
  const paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  estado.pagina = Math.min(estado.pagina, paginas);

  const inicio = (estado.pagina - 1) * POR_PAGINA;
  const visiveis = lista.slice(inicio, inicio + POR_PAGINA);

  const grade = document.getElementById("loja-grade");
  const contagem = document.getElementById("loja-contagem");
  const paginacao = document.getElementById("loja-paginacao");

  contagem.textContent = lista.length
    ? `Exibindo ${visiveis.length} de ${lista.length} ${lista.length === 1 ? "peça" : "peças"}`
    : "Nenhuma peça encontrada";

  if (!lista.length) {
    grade.className = "";
    grade.innerHTML = `
      <div class="text-center py-20 px-6 bg-surface-container-low rounded-xl">
        <p class="font-headline text-headline-md text-on-surface mb-3">Nada por aqui com esses filtros</p>
        <p class="text-body-md text-on-surface-variant mb-8 max-w-md mx-auto">
          Solte um filtro ou dois — ou peça a peça do jeito que você quer, sob medida.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <button type="button" id="limpar-vazio" class="btn btn-soft btn-sm">Limpar filtros</button>
          <a href="sob-encomenda.html" class="btn btn-outline btn-sm">Encomendar sob medida</a>
        </div>
      </div>`;
    document.getElementById("limpar-vazio").addEventListener("click", limparFiltros);
    paginacao.innerHTML = "";
    return;
  }

  grade.className = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12";
  grade.innerHTML = visiveis.map(cartaoProduto).join("");
  ligarBotoesFavoritar(grade);

  paginacao.innerHTML =
    paginas <= 1
      ? ""
      : `
      <button type="button" class="js-pagina grid place-items-center w-10 h-10 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
              data-pagina="${estado.pagina - 1}" ${estado.pagina === 1 ? "disabled" : ""} aria-label="Página anterior">
        ${icone("chevronEsq", "w-5 h-5")}
      </button>
      ${Array.from({ length: paginas }, (_, i) => i + 1)
        .map(
          (n) => `
        <button type="button" class="js-pagina grid place-items-center w-10 h-10 rounded-full text-label-sm transition-colors ${
          n === estado.pagina
            ? "bg-primary text-on-primary"
            : "border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
        }" data-pagina="${n}" ${n === estado.pagina ? 'aria-current="page"' : ""}>${n}</button>`
        )
        .join("")}
      <button type="button" class="js-pagina grid place-items-center w-10 h-10 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
              data-pagina="${estado.pagina + 1}" ${estado.pagina === paginas ? "disabled" : ""} aria-label="Próxima página">
        ${icone("chevronDir", "w-5 h-5")}
      </button>`;

  paginacao.querySelectorAll(".js-pagina").forEach((btn) => {
    btn.addEventListener("click", () => {
      estado.pagina = Number(btn.dataset.pagina);
      gravarEstadoNaUrl();
      desenhar();
      document.getElementById("loja-topo").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* --- Controles ----------------------------------------------------------- */

function sincronizarControles() {
  document.querySelectorAll(".js-filtro-categoria").forEach((el) => {
    el.checked = estado.categorias.has(el.value);
  });
  document.querySelectorAll(".js-filtro-disp").forEach((el) => {
    el.setAttribute("aria-pressed", String(estado.disponibilidade.has(el.dataset.valor)));
  });
  const faixa = document.getElementById("filtro-preco");
  faixa.value = estado.precoMax;
  rotularPreco();
  document.getElementById("filtro-ordem").value = estado.ordem;
}

/* No teto da faixa não existe filtro de preço — o rótulo diz isso em vez de
   mostrar um número que não limita nada. */
function rotularPreco() {
  document.getElementById("filtro-preco-valor").textContent =
    estado.precoMax >= PRECO_TETO ? "Qualquer preço" : `Até ${formatarPreco(estado.precoMax)}`;
}

function aoMudarFiltro() {
  estado.pagina = 1;
  gravarEstadoNaUrl();
  sincronizarControles();
  desenhar();
}

function limparFiltros() {
  estado.categorias.clear();
  estado.disponibilidade.clear();
  estado.precoMax = PRECO_TETO;
  estado.ordem = "relevancia";
  aoMudarFiltro();
}

document.addEventListener("DOMContentLoaded", () => {
  // Preenche as caixas de categoria a partir de dados.js.
  document.getElementById("filtro-categorias").innerHTML = CATEGORIAS.map(
    (c) => `
    <li>
      <label class="flex items-center gap-3 cursor-pointer group text-body-md text-on-surface-variant">
        <input type="checkbox" value="${c.id}"
               class="js-filtro-categoria w-4 h-4 rounded-sm border-outline-variant text-primary accent-primary">
        <span class="group-hover:text-primary transition-colors">${c.nome}</span>
      </label>
    </li>`
  ).join("");

  // A faixa de preço vai até o teto real do catálogo.
  const faixa = document.getElementById("filtro-preco");
  faixa.max = PRECO_TETO;
  faixa.value = PRECO_TETO;
  document.getElementById("filtro-preco-teto").textContent = formatarPreco(PRECO_TETO);

  lerEstadoDaUrl();
  sincronizarControles();
  desenhar();

  document.querySelectorAll(".js-filtro-categoria").forEach((el) => {
    el.addEventListener("change", () => {
      if (el.checked) estado.categorias.add(el.value);
      else estado.categorias.delete(el.value);
      aoMudarFiltro();
    });
  });

  document.querySelectorAll(".js-filtro-disp").forEach((el) => {
    el.addEventListener("click", () => {
      const v = el.dataset.valor;
      if (estado.disponibilidade.has(v)) estado.disponibilidade.delete(v);
      else estado.disponibilidade.add(v);
      aoMudarFiltro();
    });
  });

  faixa.addEventListener("input", () => {
    estado.precoMax = Number(faixa.value);
    rotularPreco();
  });
  faixa.addEventListener("change", aoMudarFiltro);

  document.getElementById("filtro-ordem").addEventListener("change", (e) => {
    estado.ordem = e.target.value;
    aoMudarFiltro();
  });

  document.getElementById("limpar-filtros").addEventListener("click", limparFiltros);

  // No mobile os filtros ficam recolhidos.
  const alternar = document.getElementById("alternar-filtros");
  const painel = document.getElementById("painel-filtros");
  alternar.addEventListener("click", () => {
    const aberto = painel.classList.toggle("hidden");
    alternar.setAttribute("aria-expanded", String(!aberto));
    alternar.querySelector("span").textContent = aberto ? "Filtrar" : "Fechar filtros";
  });
});
