/* =========================================================================
   Begônia Ateliê — dados do ateliê e catálogo de peças.
   Este é o único arquivo que precisa ser editado para trocar contato,
   preços ou produtos. Tudo o mais lê daqui.
   ========================================================================= */

const ATELIE = {
  nome: "Begônia Ateliê",
  // TROCAR: número real, formato internacional, só dígitos.
  whatsapp: "5511999990000",
  instagram: "https://instagram.com/begoniaatelie",
  email: "contato@begoniaatelie.com.br",
  cidade: "São Paulo, SP",
  horario: "Segunda a sexta, das 9h às 18h",
};

/* Monta um link de WhatsApp com mensagem pré-preenchida. */
function linkWhatsApp(mensagem) {
  return `https://wa.me/${ATELIE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/* Preço em reais, no formato brasileiro. */
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

const CATEGORIAS = [
  { id: "cardigans", nome: "Cardigans" },
  { id: "decoracao", nome: "Decoração" },
  { id: "suportes", nome: "Suportes de Planta" },
  { id: "acessorios", nome: "Acessórios" },
];

/* Cada peça é feita à mão, então "disponibilidade" é a informação que mais
   importa para quem compra: sai hoje ou é tecida sob medida. */
const PRODUTOS = [
  {
    slug: "cardigan-outono",
    nome: "Cardigan Outono",
    preco: 389,
    categoria: "cardigans",
    disponibilidade: "pronta",
    destaque: true,
    tags: ["novo"],
    img: "cardigan-outono",
    alt: "Cardigan de tricô grosso em terracota pendurado em cabide de madeira, com a textura do fio bem visível à luz natural.",
    resumo: "Tricô grosso em terracota, com caimento solto e bolsos embutidos.",
    descricao:
      "Um cardigan para os dias em que a manhã está fria e a tarde não. Tricotado em ponto arroz com fio grosso de algodão, ganha corpo sem pesar no ombro. Os bolsos são embutidos no próprio ponto, sem costura aparente.",
    materiais: ["100% algodão ecológico", "Fio grosso, ponto arroz", "Botões de coco natural"],
    medidas: "Tamanho único, veste do P ao G. Comprimento 72 cm.",
    cuidados: ["Lavar à mão em água fria", "Secar na horizontal, à sombra", "Não usar secadora"],
    prazo: "Envio em até 2 dias úteis",
  },
  {
    slug: "painel-macrame-raizes",
    nome: "Painel Macramê 'Raízes'",
    preco: 450,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    img: "painel-macrame-raizes",
    alt: "Painel de macramê com nós geométricos e franja longa em corda de algodão cru, pendurado em parede clara.",
    resumo: "Painel de parede em nós geométricos, com franja longa em algodão cru.",
    descricao:
      "O painel que dá nome à nossa primeira coleção. São quatro semanas de trabalho entre o desenho dos nós e o acabamento da franja — cada peça sai um pouco diferente da anterior, e é isso mesmo que a gente quer.",
    materiais: ["Corda de algodão cru sem tingimento", "Bastão de madeira roliça", "Nós losango e cabeça de turco"],
    medidas: "Sob medida. Padrão: 90 cm de largura × 140 cm de altura.",
    cuidados: ["Espanar com pincel macio", "Manter longe de umidade direta", "Não lavar"],
    prazo: "Produção em 3 a 4 semanas",
  },
  {
    slug: "capa-almofada-trama",
    nome: "Capa de Almofada Trama",
    preco: 120,
    categoria: "decoracao",
    disponibilidade: "pronta",
    destaque: true,
    tags: [],
    img: "capa-almofada-trama",
    alt: "Duas capas de almofada tecidas à mão, uma em verde oliva e outra em rosa seco, sobre sofá de linho claro.",
    resumo: "Tecida no tear, em oliva seca ou rosa seco. Vendida em par.",
    descricao:
      "Feita no tear de mesa, com trama aberta que deixa a luz passar. Vendemos em par porque almofada sozinha em sofá nunca ficou boa. Fechamento por botão de madeira, sem zíper.",
    materiais: ["Algodão e linho", "Tecida em tear manual", "Botões de madeira"],
    medidas: "45 × 45 cm. Enchimento não incluso.",
    cuidados: ["Lavar à mão", "Secar à sombra", "Passar do avesso em temperatura baixa"],
    prazo: "Envio em até 2 dias úteis",
  },
  {
    slug: "sueter-mostarda",
    nome: "Suéter Mostarda",
    preco: 410,
    categoria: "cardigans",
    disponibilidade: "pronta",
    destaque: false,
    tags: ["ultimas"],
    img: "sueter-mostarda",
    alt: "Suéter de tricô grosso em amarelo mostarda, dobrado sobre banqueta de madeira clara.",
    resumo: "Tricô oversized em mostarda queimada, gola redonda alta.",
    descricao:
      "Oversized de propósito: a manga cai na altura do dedo e a barra passa do quadril. O tom mostarda vem de tingimento com casca de cebola, então há variação leve de lote para lote.",
    materiais: ["Lã merino e algodão", "Tingimento natural", "Ponto meia com canelado duplo"],
    medidas: "Tamanho único oversized, veste do M ao GG.",
    cuidados: ["Lavar à mão em água fria", "Secar na horizontal", "Guardar dobrado, nunca no cabide"],
    prazo: "Últimas peças — envio em até 2 dias úteis",
  },
  {
    slug: "caneca-rustica",
    nome: "Caneca Rústica com Porta-copos",
    preco: 85,
    categoria: "acessorios",
    disponibilidade: "pronta",
    destaque: false,
    tags: [],
    img: "caneca-rustica",
    alt: "Caneca de cerâmica com esmalte branco fosco salpicado, ao lado de porta-copos de macramê em rosa seco.",
    resumo: "Caneca de cerâmica esmaltada acompanhada de porta-copos de macramê.",
    descricao:
      "A caneca vem da nossa parceria com um ateliê de cerâmica aqui do bairro; o porta-copos é nosso. Juntos, viraram o presente que mais sai — e o que a gente mais usa aqui dentro.",
    materiais: ["Cerâmica de alta temperatura", "Esmalte fosco atóxico", "Porta-copos em algodão"],
    medidas: "Caneca 300 ml. Porta-copos 11 cm de diâmetro.",
    cuidados: ["Caneca pode ir à máquina", "Porta-copos: lavar à mão", "Não levar a caneca ao micro-ondas"],
    prazo: "Envio em até 2 dias úteis",
  },
  {
    slug: "manta-tricolor",
    nome: "Manta Tricolor",
    preco: 520,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    img: "manta-tricolor",
    alt: "Manta tecida em branco quente, terracota e verde oliva, caída sobre o braço de uma poltrona.",
    resumo: "Manta de sofá em três tons terrosos, tecida ponto a ponto.",
    descricao:
      "Grande o bastante para cobrir duas pessoas, o que era o requisito da primeira cliente que a encomendou. As três faixas de cor podem ser escolhidas na nossa cartela — a combinação da foto é terracota, cru e oliva.",
    materiais: ["Algodão penteado", "Três cores à sua escolha", "Acabamento em franja torcida"],
    medidas: "Sob medida. Padrão: 130 × 170 cm.",
    cuidados: ["Lavar à mão ou ciclo delicado", "Secar na horizontal", "Não torcer"],
    prazo: "Produção em 3 a 5 semanas",
  },
  {
    slug: "hanger-plantas",
    nome: "Hanger para Plantas",
    preco: 95,
    categoria: "suportes",
    disponibilidade: "pronta",
    destaque: true,
    tags: ["mais-vendido"],
    img: "hanger-plantas",
    alt: "Suporte de macramê em corda de algodão natural segurando um vaso de terracota com jiboia.",
    resumo: "Suporte de macramê em algodão natural, para vasos de até 18 cm.",
    descricao:
      "O primeiro produto do ateliê e ainda o mais vendido. Nós simples, corda grossa, sem argola de metal — a alça é feita no próprio nó, que é mais bonito e não enferruja.",
    materiais: ["Corda de algodão 5 mm", "Sem partes metálicas", "Comprimento ajustável no nó"],
    medidas: "110 cm de comprimento. Vaso de até 18 cm de diâmetro.",
    cuidados: ["Espanar com pincel macio", "Retirar o vaso antes de regar", "Não lavar em máquina"],
    prazo: "Envio em até 2 dias úteis",
  },
  {
    slug: "cardigan-leve-rose",
    nome: "Cardigan Leve Rosé",
    preco: 320,
    categoria: "cardigans",
    disponibilidade: "pronta",
    destaque: false,
    tags: [],
    img: "cardigan-leve-rose",
    alt: "Cardigan de tricô fino em rosa seco, com caimento leve, exposto em manequim de arame.",
    resumo: "Tricô fino em rosa seco, para meia-estação.",
    descricao:
      "Fio fino e ponto aberto: é o cardigan de jogar por cima quando o ar-condicionado do escritório está ganhando. Leve o suficiente para caber dobrado na bolsa.",
    materiais: ["Algodão penteado fino", "Ponto aberto", "Sem botões — caimento solto"],
    medidas: "Tamanho único, veste do PP ao M. Comprimento 65 cm.",
    cuidados: ["Lavar à mão em água fria", "Secar na horizontal", "Não usar secadora"],
    prazo: "Envio em até 2 dias úteis",
  },
  {
    slug: "suporte-duplo-pothos",
    nome: "Suporte Duplo Pothos",
    preco: 130,
    categoria: "suportes",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    img: "cat-suportes-planta",
    alt: "Suporte de macramê em algodão cru com jiboia frondosa, pendurado em parede branca quente.",
    resumo: "Dois vasos em um só suporte, para cantos com pouca parede.",
    descricao:
      "Nasceu de um pedido: a cliente tinha duas jiboias e um gancho só. Os vasos ficam em alturas diferentes, o que dá volume à parede sem ocupar chão.",
    materiais: ["Corda de algodão 5 mm", "Dois níveis de apoio", "Sem partes metálicas"],
    medidas: "Sob medida. Padrão: 150 cm, vasos de até 16 cm.",
    cuidados: ["Espanar com pincel macio", "Retirar os vasos antes de regar", "Não lavar"],
    prazo: "Produção em 2 a 3 semanas",
  },
  {
    slug: "cardigan-terra-batida",
    nome: "Cardigan Terra Batida",
    preco: 445,
    categoria: "cardigans",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    img: "cat-cardigans",
    alt: "Pilha de cardigans de tricô grosso em tons de mostarda, terracota e verde oliva sobre mesa rústica.",
    resumo: "Feito na sua medida e na cor da cartela que você escolher.",
    descricao:
      "É o nosso modelo base para encomenda: você escolhe a cor na cartela, passa suas medidas e a gente tricota. Também é o modelo em que mais aceitamos ajuste de manga e comprimento.",
    materiais: ["100% algodão ecológico", "Cor à sua escolha na cartela", "Ponto arroz com canelado nos punhos"],
    medidas: "Sob medida, a partir das suas medidas de ombro, busto e comprimento.",
    cuidados: ["Lavar à mão em água fria", "Secar na horizontal", "Guardar dobrado"],
    prazo: "Produção em 4 a 6 semanas",
  },
  {
    slug: "almofada-franjada-areia",
    nome: "Almofada Franjada Areia",
    preco: 165,
    categoria: "decoracao",
    disponibilidade: "pronta",
    destaque: false,
    tags: [],
    img: "cat-decoracao",
    alt: "Sala aconchegante com almofada decorativa tecida à mão e detalhe de franja, sobre sofá de linho claro.",
    resumo: "Trama texturizada em areia, com franja longa em três lados.",
    descricao:
      "A franja é feita fio a fio depois da trama pronta — leva quase tanto tempo quanto tecer a almofada inteira, e é o detalhe pelo qual as pessoas param na frente dela.",
    materiais: ["Algodão cru e linho", "Franja aplicada à mão", "Fechamento por botão"],
    medidas: "50 × 50 cm. Enchimento incluso.",
    cuidados: ["Lavar à mão", "Pentear a franja com os dedos após secar", "Secar à sombra"],
    prazo: "Envio em até 2 dias úteis",
  },
  {
    slug: "cestos-croche-trio",
    nome: "Trio de Cestos de Crochê",
    preco: 210,
    categoria: "acessorios",
    disponibilidade: "pronta",
    destaque: false,
    tags: ["novo"],
    img: "cat-pronta-entrega",
    alt: "Três cestos de crochê em rosa seco e bege quente, organizando objetos pequenos sobre prateleira clara.",
    resumo: "Três tamanhos encaixáveis, em rosa seco e bege quente.",
    descricao:
      "Para o que sempre fica solto pela casa: chaves, controle, novelo. Os três encaixam um dentro do outro quando não estão em uso, o que resolve o problema de onde guardar o organizador.",
    materiais: ["Fio de malha reciclada", "Base reforçada em ponto baixo", "Três tamanhos encaixáveis"],
    medidas: "Diâmetros de 12, 16 e 20 cm.",
    cuidados: ["Lavar à mão", "Secar na horizontal para não deformar", "Não usar alvejante"],
    prazo: "Envio em até 2 dias úteis",
  },
];

/* Rótulos das etiquetas, num só lugar. */
const TAGS = {
  novo: { texto: "Novo", classe: "tag-novo" },
  ultimas: { texto: "Últimas peças", classe: "tag-ultimas" },
  "mais-vendido": { texto: "Mais vendido", classe: "tag-ultimas" },
  pronta: { texto: "Pronta entrega", classe: "tag-pronta" },
  encomenda: { texto: "Sob encomenda", classe: "tag-encomenda" },
};

/* Cartela de fios oferecida nas encomendas. */
const CARTELA = [
  { nome: "Terracota", cor: "#c0573e" },
  { nome: "Oliva Seca", cor: "#596338" },
  { nome: "Mostarda", cor: "#f7bc60" },
  { nome: "Cru / Natural", cor: "#e3e2e0" },
  { nome: "Avelã", cor: "#8a726c" },
  { nome: "Rosa Seco", cor: "#dcae96" },
  { nome: "Carvão", cor: "#2f312f" },
];

function produtoPorSlug(slug) {
  return PRODUTOS.find((p) => p.slug === slug) || null;
}

function caminhoImagem(produto, tamanho = "") {
  return `assets/img/${produto.img}.jpg${tamanho}`;
}

/* =========================================================================
   Envio
   Regras derivadas do que a página de contato já promete ao cliente:
   frete grátis acima de R$ 400 para Sudeste e Sul. Mudar aqui muda o que
   o cliente vê no checkout E o que o servidor cobra — os dois leem daqui.
   ========================================================================= */

const ENVIO = {
  // Regra da dona: frete grátis a partir de R$ 120, sem restrição de região.
  gratisAcimaDe: 120,
  regioesComFreteGratis: ["norte", "nordeste", "centro-oeste", "sudeste", "sul"],
  // Valor fixo por região. Trocar por cálculo dos Correios é uma mudança
  // isolada: só esta tabela e a função fretePara() precisam mudar.
  tabela: {
    sudeste: 24.9,
    sul: 29.9,
    "centro-oeste": 34.9,
    nordeste: 39.9,
    norte: 44.9,
  },
};

const UF_POR_REGIAO = {
  norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "centro-oeste": ["DF", "GO", "MT", "MS"],
  sudeste: ["ES", "MG", "RJ", "SP"],
  sul: ["PR", "RS", "SC"],
};

const UFS = Object.values(UF_POR_REGIAO).flat().sort();

function regiaoPorUF(uf) {
  const alvo = String(uf || "").trim().toUpperCase();
  return Object.keys(UF_POR_REGIAO).find((r) => UF_POR_REGIAO[r].includes(alvo)) || null;
}

/* Frete de um pedido. Devolve 0 quando é grátis, null quando a UF é inválida. */
/* O frete grátis é decidido pelo valor das PEÇAS, antes dos descontos.
   Se fosse depois, um desconto poderia derrubar o pedido abaixo do limite e
   o frete reapareceria na tela — que é a pior surpresa possível num checkout. */
function fretePara(uf, subtotalSemDesconto) {
  const regiao = regiaoPorUF(uf);
  if (!regiao) return null;
  if (ENVIO.regioesComFreteGratis.includes(regiao) && subtotalSemDesconto >= ENVIO.gratisAcimaDe) return 0;
  return ENVIO.tabela[regiao];
}

/* =========================================================================
   Pagamento
   Só peça de PRONTA ENTREGA é paga online. Peça sob encomenda continua
   fechando pelo WhatsApp, porque o preço final depende de medida e cor.
   ========================================================================= */

const PAGAMENTO = {
  metodos: [
    { id: "pix", nome: "Pix", descricao: "Aprovação na hora. QR code ou copia-e-cola." },
    { id: "cartao", nome: "Cartão de crédito", descricao: "Em até 6× sem juros, no ambiente do Mercado Pago." },
    { id: "debito", nome: "Cartão de débito", descricao: "Débito à vista, no ambiente do Mercado Pago." },
  ],
  maxParcelas: 6,
  // Teto por item, para evitar pedido acidental de 30 peças feitas à mão.
  maxQuantidadePorPeca: 5,
};

function podeComprarOnline(produto) {
  return produto.disponibilidade === "pronta";
}

/* =========================================================================
   Descontos

   Quem aplica é sempre o servidor: o navegador só mostra o que o servidor
   respondeu. Mudar um percentual aqui muda a vitrine E a cobrança.
   ========================================================================= */

const DESCONTOS = {
  primeiraCompra: {
    ativo: true,
    percentual: 10,
    rotulo: "Primeira compra",
    // Só é oferecido quando dá para verificar de verdade, ou seja, quando o
    // histórico de pedidos está configurado. Sem isso, todo mundo seria
    // "primeira compra" para sempre — e a promoção nunca terminaria.
    exigeHistorico: true,
  },
  pix: {
    ativo: true,
    percentual: 5,
    rotulo: "Desconto no Pix",
  },
  // true  = os dois somam (10% + 5% = 15%)
  // false = vale só o maior dos dois
  acumulam: true,
};

const arredondar = (valor) => Math.round(valor * 100) / 100;

/* Devolve a lista de descontos aplicáveis e o quanto cada um vale em reais.
   `metodo` é "pix" quando a pessoa declarou que vai pagar no Pix. */
function calcularDescontos({ subtotal, metodo, primeiraCompra }) {
  const candidatos = [];

  if (DESCONTOS.primeiraCompra.ativo && primeiraCompra) {
    candidatos.push({
      id: "primeira-compra",
      rotulo: DESCONTOS.primeiraCompra.rotulo,
      percentual: DESCONTOS.primeiraCompra.percentual,
    });
  }
  if (DESCONTOS.pix.ativo && metodo === "pix") {
    candidatos.push({
      id: "pix",
      rotulo: DESCONTOS.pix.rotulo,
      percentual: DESCONTOS.pix.percentual,
    });
  }

  if (!candidatos.length) return [];

  const escolhidos = DESCONTOS.acumulam
    ? candidatos
    : [candidatos.reduce((a, b) => (b.percentual > a.percentual ? b : a))];

  // Percentuais somados sobre o subtotal, não em cascata: 10% + 5% tira 15%
  // do valor cheio, e não 5% do que sobrou depois dos 10%. É o que a cliente
  // quis dizer e é o que o cliente espera ao ler "10% + 5%".
  return escolhidos.map((d) => ({
    ...d,
    valor: arredondar((subtotal * d.percentual) / 100),
  }));
}

/* =========================================================================
   Exportação para o backend
   As funções serverless em /api dão require() neste mesmo arquivo, para que
   preço e catálogo tenham UMA fonte só. No navegador este bloco é ignorado.
   ========================================================================= */

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ATELIE,
    CATEGORIAS,
    PRODUTOS,
    TAGS,
    CARTELA,
    ENVIO,
    UF_POR_REGIAO,
    UFS,
    PAGAMENTO,
    DESCONTOS,
    calcularDescontos,
    linkWhatsApp,
    formatarPreco,
    produtoPorSlug,
    caminhoImagem,
    regiaoPorUF,
    fretePara,
    podeComprarOnline,
  };
}
