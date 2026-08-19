/* =========================================================================
   Begônia Ateliê — briefing de encomenda.
   Não há back-end: o formulário monta uma mensagem de WhatsApp já escrita,
   que é como o ateliê atende de verdade.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* --- Cartela de fios --------------------------------------------------- */
  const cartela = document.getElementById("cartela");
  if (cartela) {
    cartela.innerHTML = CARTELA.map(
      (c) => `
      <li class="flex flex-col items-center gap-3">
        <span class="w-24 h-24 rounded-full soft-shadow border border-white/20" style="background-color:${c.cor}"></span>
        <span class="text-label-sm uppercase tracking-wider text-on-surface text-center">${c.nome}</span>
      </li>`
    ).join("");
  }

  /* --- Seletor de cores no formulário ------------------------------------ */
  const cores = document.getElementById("form-cores");
  if (cores) {
    cores.innerHTML = CARTELA.map(
      (c, i) => `
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="cor" value="${c.nome}" id="cor-${i}" class="sr-only peer">
        <span class="flex items-center gap-2 px-3 py-2 rounded-full border border-outline-variant text-label-sm text-on-surface-variant transition-colors peer-checked:border-primary peer-checked:bg-primary-fixed/40 peer-checked:text-on-primary-fixed peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-primary peer-focus-visible:outline-offset-2">
          <span class="w-4 h-4 rounded-full border border-black/10" style="background-color:${c.cor}"></span>
          ${c.nome}
        </span>
      </label>`
    ).join("");
  }

  /* --- Peças oferecidas como base ---------------------------------------- */
  const tipo = document.getElementById("form-peca");
  if (tipo) {
    const grupos = CATEGORIAS.map((c) => {
      const itens = PRODUTOS.filter((p) => p.categoria === c.id);
      return `<optgroup label="${c.nome}">${itens
        .map((p) => `<option value="${p.nome}">${p.nome}</option>`)
        .join("")}</optgroup>`;
    }).join("");
    tipo.insertAdjacentHTML("beforeend", grupos);

    // Se a pessoa chegou de uma peça específica, já vem escolhida.
    const slug = new URLSearchParams(location.search).get("peca");
    const escolhida = slug ? produtoPorSlug(slug) : null;
    if (escolhida) tipo.value = escolhida.nome;
  }

  /* --- Envio -------------------------------------------------------------- */
  const form = document.getElementById("form-encomenda");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const dados = new FormData(form);
    const escolhidas = dados.getAll("cor");
    const erro = document.getElementById("form-erro");

    const nome = (dados.get("nome") || "").toString().trim();
    if (!nome) {
      erro.textContent = "Como podemos te chamar?";
      erro.classList.remove("hidden");
      form.querySelector("[name=nome]").focus();
      return;
    }
    if (escolhidas.length === 0) {
      erro.textContent = "Escolha ao menos uma cor da cartela.";
      erro.classList.remove("hidden");
      document.getElementById("cor-0").focus();
      return;
    }
    erro.classList.add("hidden");

    const linhas = [
      `Olá! Sou ${nome} e queria fazer uma encomenda.`,
      "",
      `Peça: ${dados.get("peca")}`,
      `Cores: ${escolhidas.join(", ")}`,
    ];
    if (dados.get("medidas")) linhas.push(`Medidas / tamanho: ${dados.get("medidas")}`);
    if (dados.get("prazo")) linhas.push(`Prazo desejado: ${dados.get("prazo")}`);
    if (dados.get("observacoes")) linhas.push("", `Observações: ${dados.get("observacoes")}`);

    window.open(linkWhatsApp(linhas.join("\n")), "_blank", "noopener");

    const ok = document.getElementById("form-ok");
    ok.classList.remove("hidden");
    ok.focus();
  });
});
