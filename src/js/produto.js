/* =========================================================================
   Begônia Ateliê — página de detalhe da peça.
   A peça vem da query string: produto.html?slug=cardigan-outono
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const slug = new URLSearchParams(location.search).get("slug");
  const p = slug ? produtoPorSlug(slug) : null;
  const raiz = document.getElementById("produto-conteudo");

  if (!p) {
    document.title = "Peça não encontrada — Begônia Ateliê";
    raiz.innerHTML = `
      <div class="text-center py-24">
        <h1 class="font-headline text-headline-lg text-primary mb-4">Essa peça não está mais aqui</h1>
        <p class="text-body-md text-on-surface-variant max-w-md mx-auto mb-10">
          Pode ter sido vendida ou trocado de nome. Dá uma olhada no que está no ateliê agora.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <a href="loja.html" class="btn btn-primary">Ver a loja</a>
          <a href="sob-encomenda.html" class="btn btn-outline">Encomendar sob medida</a>
        </div>
      </div>`;
    document.getElementById("produto-relacionados").remove();
    return;
  }

  document.title = `${p.nome} — Begônia Ateliê`;
  document.querySelector('meta[name="description"]').content = p.resumo;

  const categoria = CATEGORIAS.find((c) => c.id === p.categoria);
  const pronta = p.disponibilidade === "pronta";
  const etiquetas = [
    ...p.tags.map((t) => TAGS[t]).filter(Boolean),
    pronta ? TAGS.pronta : TAGS.encomenda,
  ];
  const favoritado = Favoritos.tem(p.slug);

  const mensagem = `Olá! Tenho interesse na peça "${p.nome}" (${formatarPreco(p.preco)}), que vi no site. Pode me contar sobre prazo e envio?`;

  raiz.innerHTML = `
    <nav aria-label="Você está aqui" class="mb-8">
      <ol class="flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
        <li><a class="hover:text-primary transition-colors" href="index.html">Início</a></li>
        <li aria-hidden="true">${icone("chevronDir", "w-4 h-4")}</li>
        <li><a class="hover:text-primary transition-colors" href="loja.html">Loja</a></li>
        <li aria-hidden="true">${icone("chevronDir", "w-4 h-4")}</li>
        <li><a class="hover:text-primary transition-colors" href="loja.html?cat=${p.categoria}">${categoria.nome}</a></li>
        <li aria-hidden="true">${icone("chevronDir", "w-4 h-4")}</li>
        <li><span class="text-primary" aria-current="page">${p.nome}</span></li>
      </ol>
    </nav>

    <div class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

      <div class="relative rounded-xl overflow-hidden soft-shadow-lg bg-surface-container-lowest">
        <img src="${caminhoImagem(p)}" alt="${p.alt}" width="1200" height="1500" fetchpriority="high"
             class="w-full h-auto object-cover aspect-4/5">
        <div class="absolute top-4 left-4 flex flex-col items-start gap-2">
          ${etiquetas.map((t) => `<span class="tag ${t.classe}">${t.texto}</span>`).join("")}
        </div>
      </div>

      <div class="lg:sticky lg:top-40">
        <p class="text-label-sm uppercase tracking-[0.2em] text-secondary mb-4">${categoria.nome}</p>
        <h1 class="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">${p.nome}</h1>
        <p class="font-headline text-headline-md text-primary mb-6">${formatarPreco(p.preco)}</p>

        <p class="text-body-lg text-on-surface-variant mb-6">${p.resumo}</p>
        <p class="text-body-md text-on-surface-variant mb-8">${p.descricao}</p>

        <div class="flex items-center gap-3 p-4 rounded-md bg-surface-container-low mb-8">
          <span class="text-secondary shrink-0">${icone(pronta ? "seta" : "relogio", "w-5 h-5")}</span>
          <p class="text-body-md text-on-surface-variant">
            <strong class="text-on-surface">${pronta ? "Pronta entrega." : "Sob encomenda."}</strong>
            ${p.prazo}.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mb-4">
          ${
            pronta
              ? `<button type="button" id="comprar-agora" class="btn btn-primary flex-1">
                   ${icone("sacola", "w-4 h-4")} Comprar agora
                 </button>
                 <button type="button" id="favoritar-produto" class="btn btn-soft" aria-pressed="${favoritado}">
                   <span id="favoritar-icone">${icone(favoritado ? "confere" : "mais", "w-4 h-4")}</span>
                   <span id="favoritar-texto">${favoritado ? "Na sacola" : "Adicionar à sacola"}</span>
                 </button>`
              : `<a href="${linkWhatsApp(mensagem)}" target="_blank" rel="noopener" class="btn btn-primary flex-1">
                   ${icone("whatsapp", "w-4 h-4")} Pedir pelo WhatsApp
                 </a>
                 <button type="button" id="favoritar-produto" class="btn btn-soft" aria-pressed="${favoritado}">
                   <span id="favoritar-icone">${icone(favoritado ? "confere" : "mais", "w-4 h-4")}</span>
                   <span id="favoritar-texto">${favoritado ? "Na sacola" : "Guardar na sacola"}</span>
                 </button>`
          }
        </div>

        <p class="text-label-sm text-on-surface-variant normal-case tracking-normal mb-10">
          ${
            pronta
              ? `${icone("cadeado", "w-3.5 h-3.5 inline-block align-[-2px] mr-1")}Pix, cartão de crédito ou débito. O cartão é digitado no ambiente do Mercado Pago.`
              : "Peça sob medida tem preço fechado na conversa — por isso ela é combinada pelo WhatsApp, e não pelo checkout."
          }
        </p>

        <dl class="divide-y divide-outline-variant/40 border-y border-outline-variant/40">
          <div class="py-5">
            <dt class="text-label-sm uppercase tracking-wider text-on-surface mb-3">Materiais</dt>
            <dd><ul class="leaf-list space-y-2 text-body-md text-on-surface-variant">
              ${p.materiais.map((m) => `<li>${m}</li>`).join("")}
            </ul></dd>
          </div>
          <div class="py-5">
            <dt class="text-label-sm uppercase tracking-wider text-on-surface mb-3">Medidas</dt>
            <dd class="text-body-md text-on-surface-variant">${p.medidas}</dd>
          </div>
          <div class="py-5">
            <dt class="text-label-sm uppercase tracking-wider text-on-surface mb-3">Como cuidar</dt>
            <dd><ul class="leaf-list space-y-2 text-body-md text-on-surface-variant">
              ${p.cuidados.map((c) => `<li>${c}</li>`).join("")}
            </ul></dd>
          </div>
        </dl>

        <p class="text-body-md text-on-surface-variant mt-8">
          Quer essa peça em outra cor ou medida?
          <a href="sob-encomenda.html" class="text-primary underline underline-offset-4 hover:no-underline">Faça uma encomenda</a>.
        </p>
      </div>
    </div>`;

  // Botão de guardar na sacola, com rótulo escrito por extenso.
  const botao = document.getElementById("favoritar-produto");
  const rotuloGuardar = pronta ? "Adicionar à sacola" : "Guardar na sacola";
  botao.addEventListener("click", () => {
    const agora = Favoritos.alternar(p.slug);
    botao.setAttribute("aria-pressed", String(agora));
    document.getElementById("favoritar-icone").innerHTML = icone(agora ? "confere" : "mais", "w-4 h-4");
    document.getElementById("favoritar-texto").textContent = agora ? "Na sacola" : rotuloGuardar;
    anunciar(agora ? `${p.nome} entrou na sacola` : `${p.nome} saiu da sacola`);
  });

  // "Comprar agora": põe na sacola (sem duplicar) e segue direto para o checkout.
  const comprar = document.getElementById("comprar-agora");
  if (comprar) {
    comprar.addEventListener("click", () => {
      if (!Favoritos.tem(p.slug)) Favoritos.adicionar(p.slug, 1);
      window.location.href = "checkout.html";
    });
  }

  // Relacionados: mesma categoria primeiro, completando com o resto.
  // Só marcamos data-grade agora, para a grade não renderizar antes de
  // sabermos qual peça excluir.
  const grade = document.querySelector("#produto-relacionados .grade-relacionados");
  grade.dataset.grade = "tudo";
  grade.dataset.gradeLimite = "4";
  grade.dataset.gradeExcluir = p.slug;
  grade.dataset.gradeCategoria = p.categoria;
  montarGrades();
});
