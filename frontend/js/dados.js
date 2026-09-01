/* =========================================================================
   Begônia Ateliê — dados do ateliê e catálogo de peças.
   Este é o único arquivo que precisa ser editado para trocar contato,
   preços ou produtos. Tudo o mais lê daqui.
   ========================================================================= */

const ATELIE = {
  nome: "Begônia Ateliê",
  // Formato internacional, só dígitos: 55 + DDD + número.
  // CONFERIR: o número informado foi +55 45 9852-4129, que dá 8 dígitos
  // depois do DDD. Celular no Brasil tem 9 — provavelmente falta um dígito
  // e o certo é 45 99852-4129 (ou seja, "5545998524129"). Enquanto isso não
  // for confirmado, todo botão de WhatsApp do site aponta para o número
  // abaixo, do jeito que veio.
  whatsapp: "554598524129",
  instagram: "https://www.instagram.com/begonia.ateliee/",
  // TROCAR: ainda são exemplos.
  email: "contato@begoniaatelie.com.br",
  cidade: "Marechal Cândido Rondon, PR",
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
  { id: "decoracao", nome: "Decoração" },
  { id: "mesa", nome: "Mesa posta" },
  { id: "acessorios", nome: "Acessórios" },
];

/* Preço por quantidade: ela vende sousplat em jogo, com valor melhor por peça.
   A chave é a quantidade mínima daquele degrau. Quem leva 3 paga o jogo de 2
   mais uma avulsa — ver precoPara() em dados.js. */
const PRODUTOS = [
  /* ---------------------------------------------------------------- MESA */
  {
    slug: "sousplat-trancado",
    nome: "Sousplat Trançado",
    preco: 45,
    precoPorQuantidade: { 1: 45, 2: 88, 4: 170, 6: 245 },
    categoria: "mesa",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: [
      "sousplat-verde-salvia-01-conjunto.jpeg",
      "sousplat-verde-salvia-02-com-porta-copos.jpeg",
      "sousplat-verde-salvia-03-detalhe.jpeg",
      "sousplat-verde-salvia-04-avulso.jpeg",
    ],
    alt: "Sousplat de crochê em verde sálvia com borda trançada em relevo, ao lado de porta-copos do mesmo fio.",
    resumo: "Borda trançada em relevo, 37 cm. Escolha a cor da sua mesa.",
    descricao:
      "A borda trançada é feita depois do disco pronto, ponto a ponto, e é o que dá o relevo que aparece na foto. Combina com o porta-copos do mesmo fio, que é vendido à parte.",
    materiais: ["Fio de algodão", "Borda trançada em relevo", "Cor à sua escolha"],
    medidas: "Aproximadamente 37 cm de diâmetro.",
    cuidados: ["Lavar à mão", "Secar na horizontal", "Não usar alvejante"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "porta-copos-trancado",
    nome: "Porta-copos Trançado",
    preco: 16,
    precoPorQuantidade: { 1: 16, 2: 30, 4: 60 },
    categoria: "mesa",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    fotos: ["sousplat-verde-salvia-02-com-porta-copos.jpeg", "sousplat-verde-salvia-01-conjunto.jpeg"],
    alt: "Porta-copos de crochê em verde sálvia com borda trançada, sobre mesa clara.",
    resumo: "O par do Sousplat Trançado, no mesmo fio e na mesma borda.",
    descricao:
      "Feito para acompanhar o Sousplat Trançado. Pode ser pedido junto ou sozinho, na mesma cor ou em outra.",
    materiais: ["Fio de algodão", "Borda trançada em relevo", "Cor à sua escolha"],
    medidas: "Aproximadamente 11 cm de diâmetro.",
    cuidados: ["Lavar à mão", "Secar na horizontal"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "sousplat-jade",
    nome: "Sousplat Jade",
    preco: 40,
    precoPorQuantidade: { 1: 40, 2: 75, 4: 140, 6: 205 },
    categoria: "mesa",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: [
      "sousplat-verde-militar-dourado-01-jogo.jpeg",
      "sousplat-verde-militar-dourado-02-leque.jpeg",
      "sousplat-verde-militar-dourado-03-detalhe.jpeg",
      "sousplat-verde-militar-dourado-04-detalhe.jpeg",
    ],
    alt: "Jogo de sousplats de crochê em verde militar com acabamento em fio dourado, sobre toalha branca.",
    resumo: "Desenho vazado com acabamento em fio metálico, 37 cm.",
    descricao:
      "O miolo é vazado em desenho de leque, e a borda leva um fio metálico que pega a luz da mesa. Escolha a cor do corpo e a do acabamento.",
    materiais: ["Fio de algodão", "Acabamento em fio metálico", "Cor à sua escolha"],
    medidas: "Aproximadamente 37 cm de diâmetro.",
    cuidados: ["Lavar à mão", "Secar na horizontal", "Não usar alvejante"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "sousplat-tradicional",
    nome: "Sousplat Tradicional",
    preco: 25,
    precoPorQuantidade: { 1: 25, 2: 45, 4: 95, 6: 140 },
    categoria: "mesa",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: [
      "sousplat-rosa-01-conjunto.jpeg",
      "sousplat-rosa-02-conjunto.jpeg",
      "sousplat-rosa-03-detalhe-ponto.jpeg",
      "sousplat-rosa-04-par.jpeg",
      "sousplat-cru-borda-terracota-01.jpeg",
      "sousplat-cru-borda-terracota-02.jpeg",
    ],
    alt: "Sousplats de crochê em rosa antigo com borda ondulada, empilhados sobre toalha branca.",
    resumo: "Ponto leque com borda ondulada, 37 cm. A cor é você quem escolhe.",
    descricao:
      "O modelo mais pedido da casa e o mais leve de compor: ponto leque aberto, borda ondulada, e uma cor só. Também sai com a borda em contraste, como na foto em cru com terracota.",
    materiais: ["Fio de algodão", "Ponto leque com borda ondulada", "Cor à sua escolha"],
    medidas: "Aproximadamente 37 cm de diâmetro.",
    cuidados: ["Lavar à mão", "Secar na horizontal", "Não usar alvejante"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "sousplat-estrela",
    nome: "Sousplat Estrela",
    preco: 40,
    precoPorQuantidade: { 1: 40, 2: 75, 4: 140, 6: 205 },
    categoria: "mesa",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    fotos: [
      "sousplat-terracota-cru-01.jpeg",
      "sousplat-terracota-cru-02-detalhe.jpeg",
      "sousplat-terracota-cru-03-detalhe.jpeg",
    ],
    alt: "Sousplat de crochê em terracota com desenho de estrela e borda em bolinhas cruas.",
    resumo: "Desenho de estrela em duas cores, com borda em bolinhas.",
    descricao:
      "Duas cores que se cruzam num desenho de estrela, com a borda em bolinhas fechando a peça. É o modelo que mais chama atenção na mesa posta.",
    materiais: ["Fio de algodão", "Duas cores à sua escolha", "Borda em bolinhas"],
    medidas: "Aproximadamente 37 cm de diâmetro.",
    cuidados: ["Lavar à mão", "Secar na horizontal", "Não usar alvejante"],
    prazo: "Produção sob encomenda",
  },

  /* ----------------------------------------------------------- DECORAÇÃO */
  {
    slug: "capa-almofada",
    nome: "Capa de Almofada",
    preco: 75,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: ["almofada-granny-square-01-no-sofa.jpeg", "almofada-granny-square-02.jpeg"],
    alt: "Capa de almofada de crochê em granny square com terracota, rosa, verde e cru, sobre sofá cinza.",
    resumo: "Granny square 40 × 40 cm. Só a capa, na cor que você quiser.",
    descricao:
      "Quadrado clássico do crochê, feito de dentro para fora numa peça só. Vai só a capa: o enchimento é o que você já tem em casa, no tamanho padrão de 40 × 40.",
    materiais: ["Fio de algodão", "Granny square em peça única", "Cores à sua escolha"],
    medidas: "40 × 40 cm. Enchimento não incluso.",
    cuidados: ["Lavar à mão", "Secar na horizontal", "Não torcer"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "porta-retrato-coracao",
    nome: "Porta-retrato Polaroid Coração",
    preco: 39.9,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: ["porta-retrato-macrame-01-na-parede.jpeg"],
    alt: "Porta-retrato de macramê em corda crua pendurado na parede, segurando duas fotos polaroid.",
    resumo: "Macramê de 60 cm que segura duas polaroids.",
    descricao:
      "Os nós de coração no topo e no pé emolduram duas fotos polaroid, sem cola e sem prego na foto — ela entra e sai quando você quiser trocar.",
    materiais: ["Fio de macramê", "Nós de coração", "Franja no acabamento"],
    medidas: "60 cm de comprimento. Cabem 2 fotos polaroid de 8 × 10 cm.",
    cuidados: ["Espanar com pincel macio", "Manter longe de umidade", "Não lavar"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "porta-retrato-simples",
    nome: "Porta-retrato Polaroid Simples",
    preco: 11.9,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    fotos: [
      "porta-retrato-macrame-02-avulso.jpeg",
      "porta-retrato-macrame-03-avulso.jpeg",
      "porta-retrato-macrame-04-avulso.jpeg",
    ],
    alt: "Porta-retrato pequeno de macramê com argola de madeira, segurando uma foto polaroid.",
    resumo: "Argola de madeira e macramê, para uma polaroid.",
    descricao:
      "A versão pequena, de pendurar em qualquer canto. A argola de madeira faz o topo e a franja fecha embaixo.",
    materiais: ["Fio de macramê", "Argola de madeira", "Franja no acabamento"],
    medidas: "27 cm da argola até a ponta. Cabe 1 foto polaroid de 8 × 10 cm.",
    cuidados: ["Espanar com pincel macio", "Manter longe de umidade", "Não lavar"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "cata-vento",
    nome: "Cata-vento de Crochê",
    preco: 34.9,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    fotos: ["mobile-espiral-01-ambiente.jpeg"],
    alt: "Cata-vento de crochê em espiral pendurado perto da janela, girando com a luz do fim da tarde.",
    resumo: "Espiral que gira com o vento, tamanho G.",
    descricao:
      "Pendura perto de uma janela e ele roda sozinho com a corrente de ar. A espiral é fechada com um pingente na ponta.",
    materiais: ["Fio de algodão", "Espiral em ponto contínuo", "Pingente no acabamento"],
    medidas: "Tamanho G.",
    cuidados: ["Espanar com pincel macio", "Não lavar"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "painel-macrame",
    nome: "Painel de Macramê",
    preco: 0,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    fotos: ["painel-macrame-verde-01-na-parede.jpeg"],
    alt: "Painel de macramê em verde sálvia com nós geométricos e franja, pendurado em bastão de madeira.",
    resumo: "Nós geométricos em bastão de madeira, 20 × 55 cm.",
    descricao:
      "Peça de parede feita à mão, com os nós desenhando um losango no meio e a franja fechando embaixo.",
    materiais: ["Fio de macramê", "Bastão de madeira", "Franja no acabamento"],
    medidas: "20 × 55 cm.",
    cuidados: ["Espanar com pincel macio", "Manter longe de umidade", "Não lavar"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "tapete",
    nome: "Tapete de Crochê",
    preco: 0,
    categoria: "decoracao",
    disponibilidade: "pronta",
    destaque: false,
    tags: [],
    fotos: [],
    alt: "Tapete de crochê retangular, 70 por 50 centímetros.",
    resumo: "70 × 50 cm, pronta entrega.",
    descricao: "Combina com qualquer ambiente. Escolha a cor que mais te agrada.",
    materiais: ["Fio de malha"],
    medidas: "70 × 50 cm.",
    cuidados: ["Lavar à mão", "Secar na horizontal"],
    prazo: "Envio em até 2 dias úteis",
  },

  /* ---------------------------------------------------------- ACESSÓRIOS */
  {
    slug: "touca",
    nome: "Touca de Crochê",
    preco: 75,
    precoPorQuantidade: { 1: 75, 2: 140 },
    categoria: "acessorios",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: ["gorro-02-rosa-na-modelo.jpeg", "gorro-01-preto-e-branco.jpeg"],
    alt: "Touca de crochê em rosa antigo, vestida, com canelado na barra.",
    resumo: "Lã 100% acrílica, canelado na barra. Qualquer tamanho.",
    descricao:
      "Touca de inverno em lã acrílica, com canelado na barra que segura na cabeça sem apertar. Serve em qualquer tamanho — é só dizer o seu.",
    materiais: ["Lã 100% acrílica", "Canelado na barra", "Cor à sua escolha"],
    medidas: "Qualquer tamanho, feita sob medida.",
    cuidados: ["Lavar à mão em água fria", "Secar na horizontal", "Não usar secadora"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "bolsa-jasmin",
    nome: "Bolsa Jasmin",
    preco: 0,
    categoria: "acessorios",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: [
      "bolsa-listrada-01-inteira.jpeg",
      "bolsa-listrada-02-inteira.jpeg",
      "bolsa-listrada-03-alca.jpeg",
      "bolsa-listrada-04-alca.jpeg",
      "bolsa-listrada-05-detalhe.jpeg",
      "bolsa-listrada-06-detalhe.jpeg",
    ],
    alt: "Bolsa de crochê listrada em cru, verde água, pêssego e terracota, com alça longa.",
    resumo: "Listras em quatro cores, alça longa, 30 × 32 cm.",
    descricao:
      "Listras que mudam de cor a cada carreira, com alça longa de ombro. O ponto é aberto, então ela cede um pouco e acomoda o que entra.",
    materiais: ["Fio de algodão", "Ponto aberto", "Alça longa de ombro"],
    medidas: "30 × 32 cm.",
    cuidados: ["Lavar à mão", "Secar na horizontal", "Não torcer"],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "necessaire",
    nome: "Necessaire de Crochê",
    preco: 0,
    categoria: "acessorios",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    fotos: [
      "necessaire-crua-01-fechada.jpeg",
      "necessaire-crua-02-aberta.jpeg",
      "necessaire-crua-03-medidas.jpeg",
    ],
    alt: "Necessaire de crochê em fio cru com zíper, segurada na mão.",
    resumo: "20 × 10 cm, com zíper. Sem forro.",
    descricao:
      "Do tamanho de caber na bolsa e levar maquiagem ou item de higiene. Zíper costurado à mão, sem forro — o crochê é firme o bastante para segurar sozinho.",
    materiais: ["Fio de algodão", "Zíper costurado à mão", "Sem forro"],
    medidas: "20 × 10 cm.",
    cuidados: ["Lavar à mão", "Secar na horizontal"],
    prazo: "Produção sob encomenda",
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

/* Caminho da foto. `indice` escolhe qual das fotos da peça. Peça sem foto
   cai no placeholder, para a grade não quebrar com imagem faltando. */
function caminhoImagem(produto, indice = 0) {
  const fotos = produto.fotos || [];
  if (!fotos.length) return "assets/fotos/sem-foto.svg";
  return `assets/fotos/${fotos[Math.min(indice, fotos.length - 1)]}`;
}

/* Preço de N unidades, respeitando o jogo.
   Quem leva 3 paga o jogo de 2 mais uma avulsa — é o que ela cobra hoje. */
function precoPara(produto, quantidade = 1) {
  const tabela = produto.precoPorQuantidade;
  const n = Math.max(1, Math.floor(Number(quantidade) || 1));
  if (!tabela) return arredondar(produto.preco * n);

  const degraus = Object.keys(tabela).map(Number).sort((a, b) => b - a);
  let restante = n;
  let total = 0;
  for (const degrau of degraus) {
    while (restante >= degrau) {
      total += tabela[degrau];
      restante -= degrau;
    }
  }
  total += restante * (tabela[1] != null ? tabela[1] : produto.preco);
  return arredondar(total);
}

/* =========================================================================
   Envio
   Regras derivadas do que a página de contato já promete ao cliente:
   frete grátis acima de R$ 400 para Sudeste e Sul. Mudar aqui muda o que
   o cliente vê no checkout E o que o servidor cobra — os dois leem daqui.
   ========================================================================= */

const ENVIO = {
  // De onde a encomenda sai. É o que ordena a tabela abaixo: quanto mais
  // longe daqui, mais caro. Mudar de cidade sem revisar a tabela deixa o
  // frete errado sem quebrar nada — foi exatamente o que aconteceu quando
  // esta origem ainda estava como São Paulo.
  origem: { cidade: "Marechal Cândido Rondon", uf: "PR" },

  // Regra da dona: frete grátis a partir de R$ 120, sem restrição de região.
  gratisAcimaDe: 120,
  regioesComFreteGratis: ["norte", "nordeste", "centro-oeste", "sudeste", "sul"],

  // Dentro do próprio Paraná é mais barato que o resto do Sul.
  mesmoEstado: 19.9,

  // Valor fixo por região, do mais perto de Marechal para o mais longe.
  // CONFERIR com a Milena: estes valores são estimativa, não cotação real
  // dos Correios. Trocar por cálculo automático é mudança isolada — só esta
  // tabela e a função fretePara() precisam mudar.
  tabela: {
    sul: 24.9,
    sudeste: 29.9,
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
  const alvo = String(uf || "").trim().toUpperCase();
  const regiao = regiaoPorUF(alvo);
  if (!regiao) return null;
  if (ENVIO.regioesComFreteGratis.includes(regiao) && subtotalSemDesconto >= ENVIO.gratisAcimaDe) return 0;
  // Mesmo estado da origem sai mais barato que o resto da região. O mapa de
  // regiões continua sendo só geografia: quem sabe de onde a peça sai é o
  // ENVIO.origem, não o UF_POR_REGIAO.
  if (alvo === ENVIO.origem.uf) return ENVIO.mesmoEstado;
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

/* Quem pode ser comprado pelo site.

   Antes só peça de pronta entrega passava, na suposição de que encomenda
   tinha preço em aberto. No catálogo dela não é assim: o preço é fixo e o
   que varia é a cor. Então tudo que tem preço fechado é vendido pelo site —
   "sob encomenda" passou a significar só o prazo, não a forma de fechar.

   A única trava que fica: peça sem preço nunca vira cobrança. */
function podeComprarOnline(produto) {
  return Number(produto.preco) > 0;
}

/* A cor é escolhida por quem compra, então precisa vir junto do pedido —
   senão ela recebe a venda sem saber o que tricotar. */
function precisaEscolherCor(produto) {
  return produto.personalizavel !== false;
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
    precoPara,
    regiaoPorUF,
    fretePara,
    podeComprarOnline,
    precisaEscolherCor,
  };
}
