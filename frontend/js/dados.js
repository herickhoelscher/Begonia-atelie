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
  // Grupo de avisos: substitui a antiga lista de e-mail da home, que era um
  // formulário sem back-end nenhum — não mandava nada para lugar algum.
  whatsappGrupo: "https://chat.whatsapp.com/L5SazGbRWWRFIvrQdqamPM?s=sw&p=i&mlu=4",
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

/* Cartela do MACRAME.

   A CARTELA de baixo tem 53 cores e e do fio de croche. O fio de macrame nao
   vem nelas: sao tres cores, e so. Antes as pecas de macrame saiam com
   `personalizavel: false` justamente para nao oferecerem as 53 cores do
   croche numa peca que nunca teria 50 delas.

   Fica declarada ANTES de PRODUTOS de proposito: as pecas referenciam
   CORES_MACRAME dentro do array, e `const` nao sobe -- declarar depois quebra
   o arquivo inteiro com "Cannot access before initialization".

   Os hex sao aproximacao para o quadradinho da tela. O fio de verdade manda. */
const CORES_MACRAME = [
  { nome: "Verde Oliva", cor: "#4a5d32" },
  { nome: "Terracota", cor: "#b5533a" },
  { nome: "Branco Off-White", cor: "#f2ece1" },
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
      "Ponto leque aberto, borda ondulada, uma cor só. Também sai com a borda em contraste, como na foto em cru com terracota.",
    materiais: ["Fio de algodão", "Ponto leque com borda ondulada", "Cor à sua escolha"],
    medidas: "Aproximadamente 37 cm de diâmetro.",
    cuidados: ["Lavar à mão", "Secar na horizontal", "Não usar alvejante"],
    prazo: "Produção sob encomenda",
  },

  /* ----------------------------------------------------------- DECORAÇÃO */
  {
    slug: "capa-almofada",
    nome: "Capa de Almofada em Crochê",
    preco: 75,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: ["almofada-granny-square-01-no-sofa.jpeg", "almofada-granny-square-02.jpeg"],
    alt: "Capa de almofada de crochê em granny square com terracota, rosa, verde e cru, sobre sofá cinza.",
    resumo: "Crochê 40 × 40 cm, em até 4 cores. Só a capa — o enchimento não vai junto.",
    descricao:
      "Feita à mão em crochê, para trazer mais aconchego e personalidade para a decoração. Você escolhe a cor na hora da compra, entre até quatro. Atrás tem um fechamento regulável, que facilita pôr o enchimento e deixa ajustar a amarração. Por ser artesanal, pequenas variações acontecem — cada capa sai única.",
    materiais: ["Fio de algodão", "Até 4 cores à sua escolha", "Fechamento regulável nas costas"],
    medidas: "40 × 40 cm. Enchimento não incluso.",
    cuidados: [
      "O ideal é lavar à mão, com sabão neutro",
      "Máquina só no modo delicado — existe risco de encolher",
      "Secar na horizontal",
      "Não torcer",
    ],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "porta-retrato-coracao",
    nome: "Porta-Retrato Polaroid Coração",
    preco: 39.9,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    cores: CORES_MACRAME,
    fotos: ["porta-retrato-macrame-01-na-parede.jpeg"],
    alt: "Porta-retrato de macramê em corda crua pendurado na parede, segurando duas fotos polaroid.",
    resumo: "Macramê de cerca de 60 cm que segura duas polaroids.",
    descricao:
      "Feito à mão em macramê, para deixar as fotos favoritas expostas de um jeito diferente e delicado. Os nós de coração emolduram duas polaroids sem cola e sem prego na foto — ela entra e sai quando você quiser trocar. Por ser feito à mão, cada porta-retrato sai único.",
    materiais: ["Fio de macramê 85% algodão", "Nós de coração", "Franja no acabamento"],
    medidas: "Aproximadamente 60 cm de comprimento total. Cabem 2 fotos polaroid de 8 × 10 cm.",
    cuidados: [
      "Lavar delicadamente à mão",
      "Esponja mágica passada de leve tira sujeira pequena",
      "Não esfregar com força, para não deformar os fios",
    ],
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
    cores: CORES_MACRAME,
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
    nome: "Catavento em Crochê",
    preco: 34.9,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    fotos: ["mobile-espiral-01-ambiente.jpeg"],
    alt: "Catavento de crochê em espiral pendurado perto da janela, girando com a luz do fim da tarde.",
    resumo: "Gira de verdade com o vento. Cerca de 40 cm, em até 3 cores.",
    descricao:
      "É só pendurar e deixar o vento fazer o trabalho: conforme ele bate, a peça fica girando. Com uns 40 cm, é maior do que parece e cabe em vários cantos da casa. Na parte de baixo vem uma ponteira, que fecha a peça.",
    materiais: ["Fio de algodão", "Até 3 cores à sua escolha", "Ponteira na parte inferior"],
    medidas: "Aproximadamente 40 cm.",
    cuidados: [
      "Lavar só à mão, com sabão neutro e de forma delicada",
      "Não lavar na máquina — o movimento deforma a peça",
    ],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "painel-macrame",
    nome: "Painel Macramê Losango",
    preco: 0,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: false,
    tags: [],
    cores: CORES_MACRAME,
    fotos: ["painel-macrame-verde-01-na-parede.jpeg"],
    alt: "Painel de macramê em verde sálvia com nós geométricos e franja, pendurado em bastão de madeira.",
    resumo: "Losango em bastão de 20 cm, com cerca de 55 cm de comprimento.",
    descricao:
      "Feito à mão em macramê, para preencher aquele cantinho vazio da casa ou dar um toque especial a espaços menores. Os nós desenham um losango no meio e a franja fecha embaixo. O tamanho compacto combina com estilos diferentes e funciona sozinho ou junto de outros elementos.",
    materiais: ["Fio de macramê 85% algodão", "Bastão de madeira", "Franja no acabamento"],
    medidas: "Bastão de madeira de 20 cm. Comprimento total de aproximadamente 55 cm, do ponto onde a peça é pendurada até o fim do painel.",
    cuidados: [
      "Não lavar",
      "Limpar só com pano levemente úmido, passando de leve nos fios",
    ],
    prazo: "Produção sob encomenda",
  },
  /* As duas prateleiras dividem a mesma construção: madeira, macramê de
     algodão e um punho de rede no topo. Mudam no tamanho da tábua — 40 × 15
     na primeira, 20 × 20 na quadrada — e é isso que separa o preço.
     A foto do punho é a mesma peça nas duas, porque o acabamento é igual. */
  {
    slug: "prateleira-macrame",
    nome: "Prateleira de Macramê",
    preco: 120,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: ["novo"],
    cores: CORES_MACRAME,
    fotos: [
      "prateleira-01-na-cozinha.jpeg",
      "prateleira-02-cozinha-detalhe.jpeg",
      "prateleira-03-no-banheiro.jpeg",
      "prateleira-04-banheiro-detalhe.jpeg",
      "prateleira-05-na-sala.jpeg",
      "prateleira-06-fio-verde.jpeg",
      "prateleira-07-detalhe-do-no.jpeg",
      "prateleira-macrame-punho-de-rede.jpeg",
    ],
    alt: "Prateleira de macramê de três níveis, em madeira e fio cru, pendurada na parede da cozinha com potes de mantimentos e um vaso de planta.",
    resumo: "Três níveis de madeira em macramê, tábua de 40 × 15 cm.",
    descricao:
      "Une madeira e macramê numa peça que decora e organiza ao mesmo tempo. Serve no banheiro, no quarto, na sala, no escritório ou na cozinha, para plantas, objetos de decoração e coisas leves do dia a dia. O punho de rede no topo pendura num gancho bem fixado na parede — ela foi feita para ficar rente à parede, e não solta no meio do ambiente, senão inclina. O peso pede bom senso: nada pesado demais, nem tudo concentrado num nível só, senão o fio laceia.",
    materiais: ["Madeira", "Fio para macramê com 85% algodão", "Punho de rede para instalação"],
    medidas: "Madeira de 40 × 15 cm. Altura total de aproximadamente 80 cm, com 30 cm até o primeiro nível e cerca de 20 cm entre os demais.",
    cuidados: [
      "Limpar o macramê com pano levemente úmido",
      "Esponja mágica de leve, sem produto abrasivo ou de limpeza forte",
      "A madeira pode molhar no dia a dia, mas não deixe encharcada nem na chuva",
      "Evitar sol direto e prolongado",
      "Com o uso o fio laceia um pouco — é característica do macramê, não é defeito",
    ],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "prateleira-macrame-quadrada",
    nome: "Prateleira Quadrada de Macramê",
    preco: 100,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: ["novo"],
    cores: CORES_MACRAME,
    fotos: [
      "prateleira-quadrada-01-na-parede.jpeg",
      "prateleira-quadrada-02-ambiente.jpeg",
      "prateleira-macrame-punho-de-rede.jpeg",
    ],
    alt: "Prateleira quadrada de macramê de três níveis, em madeira e fio cru, pendurada na parede da sala com uma garrafa e um vaso de planta.",
    resumo: "A versão compacta, com tábua de 20 × 20 cm.",
    descricao:
      "A mesma prateleira, num tamanho que cabe onde a outra não caberia. É a opção para quem quer aproveitar melhor um canto pequeno sem abrir mão da decoração — banheiro, quarto, sala, escritório ou cozinha. O punho de rede no topo pendura num gancho bem fixado na parede, e ela foi feita para ficar rente à parede: solta no ambiente, inclina. Vale o mesmo cuidado com o peso — objetos leves, distribuídos entre os níveis.",
    materiais: ["Madeira", "Fio para macramê com 85% algodão", "Punho de rede para instalação"],
    medidas: "Madeira de 20 × 20 cm. Altura total de aproximadamente 80 cm, com 30 cm até o primeiro nível e cerca de 20 cm entre os demais.",
    cuidados: [
      "Limpar o macramê com pano levemente úmido",
      "Esponja mágica de leve, sem produto abrasivo ou de limpeza forte",
      "A madeira pode molhar no dia a dia, mas não deixe encharcada nem na chuva",
      "Evitar sol direto e prolongado",
      "Com o uso o fio laceia um pouco — é característica do macramê, não é defeito",
    ],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "tapete",
    nome: "Tapete Lavanda",
    // CONFERIR com a Milena: o preço do tapete nunca foi informado. Enquanto
    // ficar em 0, a peça aparece no site mas não entra no carrinho — é a
    // trava do podeComprarOnline, que existe para nunca cobrar valor que
    // ninguém definiu.
    preco: 0,
    categoria: "decoracao",
    disponibilidade: "pronta",
    destaque: false,
    tags: [],
    // Estas fotos estavam num produto chamado "Sousplat Estrela", na
    // categoria de mesa posta. São de um tapete: peça grande, no chão, com
    // borda em ondas — nada a ver com um sousplat de 37 cm.
    fotos: [
      "tapete-terracota-cru-01.jpeg",
      "tapete-terracota-cru-02-detalhe.jpeg",
      "tapete-terracota-cru-03-detalhe.jpeg",
    ],
    alt: "Tapete de crochê em terracota e cru, com desenho radiado do centro e borda em ondas.",
    resumo: "Crochê 70 × 50 cm, em até 2 cores. Serve em qualquer cômodo.",
    descricao:
      "Peça versátil, que combina com ambientes diferentes da casa: banheiro, cozinha ou onde você quiser. Pode ser feito em até duas cores, para você escolher a combinação que fica melhor no seu espaço. Por ser feito à mão, cada tapete sai único.",
    materiais: ["Fio de algodão", "Até 2 cores à sua escolha", "Borda em ondas"],
    medidas: "70 × 50 cm.",
    cuidados: [
      "Pode ir à máquina, de preferência no modo delicado",
      "Existe risco de encolher na lavagem",
      "Secar à sombra, nunca no sol direto",
    ],
    prazo: "Envio em até 2 dias úteis",
  },

  /* ---------------------------------------------------------- ACESSÓRIOS */
  {
    slug: "touca",
    nome: "Touca em Crochê",
    preco: 75,
    precoPorQuantidade: { 1: 75, 2: 140 },
    categoria: "acessorios",
    disponibilidade: "encomenda",
    destaque: true,
    tags: [],
    fotos: ["gorro-02-rosa-na-modelo.jpeg", "gorro-01-preto-e-branco.jpeg"],
    alt: "Touca de crochê em rosa antigo, vestida, com canelado na barra.",
    resumo: "Fio 100% acrílico, quentinho e elástico. Nos tamanhos P, M e G.",
    descricao:
      "Feita à mão para os dias mais frios. O fio acrílico tem bastante elasticidade, então a touca se ajusta bem à cabeça, e o material segura o calor. É peça atemporal, que combina com vários looks e dura várias temporadas. Não sabe o seu tamanho? Passe uma fita métrica em volta da cabeça, acima das sobrancelhas e das orelhas, na parte mais larga, sem apertar — e, se a medida cair entre dois tamanhos, escolha o maior.",
    materiais: ["Fio 100% acrílico", "Canelado na barra", "Cor à sua escolha"],
    // CONFERIR com a Milena: a touca agora tem tamanho (P, M e G), e o site não
    // tem onde escolher tamanho — o checkout só pergunta a cor. Enquanto não
    // houver esse campo, o tamanho tem de ser combinado no WhatsApp, e a venda
    // online sai sem essa informação.
    medidas: "P: 54 a 56 cm · M: 57 a 59 cm · G: 60 a 62 cm, medidos na circunferência da cabeça.",
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
    resumo: "Espaçosa e resistente, 30 × 32 cm. Leva até notebook.",
    descricao:
      "Feita à mão para acompanhar a rotina. Com 30 × 32 cm, tem bastante espaço interno: dá para levar material da escola ou da faculdade e até um notebook, dependendo do tamanho do aparelho. Além de prática para o dia a dia, é versátil e atemporal — combina com estilos diferentes e dura muito tempo.",
    materiais: ["Fio 85% algodão", "Alça longa de ombro"],
    medidas: "30 × 32 cm.",
    cuidados: [
      "Pode ir à máquina, de preferência no modo delicado",
      "Existe risco de encolher na lavagem",
      "Secar à sombra",
    ],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "necessaire",
    nome: "Necessaire em Crochê",
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
    resumo: "20 × 10 cm, com zíper costurado à mão. Sem forro.",
    descricao:
      "Compacta e prática para organizar as coisas pequenas do dia a dia: maquiagem, itens de higiene, acessórios. O zíper também é costurado à mão, então o acabamento artesanal está em cada detalhe. Cabe na bolsa ou na mala, e é uma boa ideia de presente.",
    materiais: ["Fio 85% algodão", "Zíper costurado à mão", "Sem forro"],
    medidas: "20 × 10 cm.",
    cuidados: [
      "O ideal é lavar à mão, com sabão neutro e de forma delicada",
      "Não esfregar com força, para preservar os pontos e o zíper",
    ],
    prazo: "Produção sob encomenda",
  },

  {
    slug: "painel-organizador",
    nome: "Painel Organizador",
    preco: 90,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: ["novo"],
    cores: CORES_MACRAME,
    fotos: [
      "painel-organizador-01-na-geladeira.jpeg",
      "painel-organizador-02-na-parede.jpeg",
      "painel-organizador-03-detalhe.jpeg",
      "painel-organizador-04-cavilhas.jpeg",
    ],
    alt: "Painel organizador de macramê em fio cru, preso na lateral da geladeira, com papel toalha numa cavilha e pano de prato na outra.",
    resumo: "Cavilha fixa em cima e duas removíveis de 45 cm, na altura que você quiser.",
    descricao:
      "Peça prática para deixar a cozinha organizada aproveitando espaço que normalmente não seria usado. A cavilha de cima é fixa; as duas de 45 cm saem e entram na altura que você preferir — dois rolos de papel toalha, um rolo e um pano de prato, ou só uma cavilha quando a outra não faz falta. A alça é ajustável: regula a altura e prende num parafuso ou apoia num móvel, como ao lado da geladeira com um vaso segurando a ponta.",
    materiais: ["Fio de macramê 85% algodão", "Cavilha fixa na parte de cima", "Duas cavilhas removíveis de 45 cm", "Alça ajustável"],
    medidas: "Cavilhas removíveis de 45 cm. A altura total depende de como a alça for regulada.",
    cuidados: [
      "Limpar com pano levemente úmido ou esponja mágica, de leve",
      "Passar delicadamente no macramê e na madeira",
      "Evitar produtos abrasivos e excesso de água",
    ],
    prazo: "Produção sob encomenda",
  },
  {
    /* CONFERIR com a Milena: existem DOIS paineis no catalogo agora. Este e o
       grande (bastao de 45 cm, franja em V, cru) e o outro e o "Painel Macrame
       Losango" (bastao de 20 cm, verde), que continua sem preco. Se forem a
       mesma peca em tamanhos diferentes, vale unificar o nome. */
    slug: "painel-macrame-grande",
    nome: "Painel de Macramê",
    preco: 90,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: ["novo"],
    cores: CORES_MACRAME,
    fotos: ["painel-macrame-grande-01.jpeg", "painel-macrame-grande-02-detalhe.jpeg"],
    alt: "Painel decorativo de macramê em fio cru, com desenho em V e franja longa, pendurado num bastão de madeira.",
    resumo: "Painel decorativo de 45 cm de largura, com franja longa.",
    descricao:
      "Painel feito à mão para dar aquele toque a mais na decoração e deixar o ambiente mais aconchegante. Serve em vários ambientes: preenche espaço vazio, completa uma parede ou incrementa aquele cantinho que estava faltando alguma coisa. Por ser artesanal, pequenas variações acontecem — cada painel sai único.",
    materiais: ["Fio de macramê 85% algodão", "Bastão de madeira", "Franja no acabamento"],
    medidas: "45 cm de largura. Cerca de 70 cm de comprimento total, da alça até a ponta — da cavilha até a ponta são aproximadamente 45 cm.",
    cuidados: [
      "Não lavar",
      "Limpar só com pano levemente úmido, de leve no macramê e na madeira",
      "Evitar produtos abrasivos e excesso de água",
    ],
    prazo: "Produção sob encomenda",
  },
  {
    slug: "suporte-papel-toalha",
    nome: "Suporte Simples para Papel Toalha",
    preco: 34.9,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: false,
    tags: ["novo"],
    cores: CORES_MACRAME,
    fotos: [
      "suporte-papel-toalha-01-com-papel.jpeg",
      "suporte-papel-toalha-02-com-pano.jpeg",
      "suporte-papel-toalha-03-detalhe.jpeg",
      "suporte-papel-toalha-04-com-pano-detalhe.jpeg",
      "suporte-papel-toalha-05-argola.jpeg",
    ],
    alt: "Suporte de macramê em fio cru com argola de madeira no topo e cavilha embaixo, segurando um rolo de papel toalha.",
    resumo: "Argola e cavilha de 33 cm. Ocupa pouquíssimo espaço.",
    descricao:
      "Feito para quem precisa de praticidade e não tem muito espaço. Na cozinha segura o papel toalha ou o pano de prato; no banheiro, uma toalha de rosto. A argola no topo prende na parede e a cavilha embaixo é onde a peça se apoia. Por ser compacto, cabe em cantinhos que normalmente ficariam sem uso.",
    materiais: ["Fio de macramê 85% algodão", "Argola de madeira para fixação", "Cavilha de 33 cm"],
    medidas: "Cavilha de 33 cm. Da argola até a ponta, aproximadamente 40 a 43 cm — por ser artesanal, varia um pouco.",
    cuidados: [
      "Limpar com pano levemente úmido ou esponja mágica, de leve",
      "Evitar produtos abrasivos e excesso de água",
      "Não deixar de molho nem lavar direto na água",
    ],
    prazo: "Produção sob encomenda",
  },
  {
    /* O kit e uma peca propria no catalogo, e nao dois slugs amarrados.
       Assim o preco de 180 e um numero so, que o servidor cobra e o cliente
       ve -- sem precisar de logica de "se levou A e B, desconta C", que e
       onde esse tipo de promocao costuma divergir entre tela e cobranca.

       A conta: prateleira 120 + organizador 90 = 210. O kit sai 180, ou seja
       30 reais abaixo. Mudar o preco de uma das duas pecas NAO muda este
       numero -- se mexer nelas, revise aqui. */
    slug: "kit-prateleira-organizador",
    nome: "Kit Prateleira + Painel Organizador",
    preco: 180,
    categoria: "decoracao",
    disponibilidade: "encomenda",
    destaque: true,
    tags: ["novo"],
    cores: CORES_MACRAME,
    fotos: [
      "prateleira-01-na-cozinha.jpeg",
      "painel-organizador-01-na-geladeira.jpeg",
      "prateleira-03-no-banheiro.jpeg",
      "painel-organizador-02-na-parede.jpeg",
    ],
    alt: "Prateleira de macramê de três níveis ao lado do painel organizador, os dois em fio cru na cozinha.",
    resumo: "A Prateleira de Macramê e o Painel Organizador juntos, por R$ 30 a menos.",
    descricao:
      "As duas peças da cozinha no mesmo pedido: a Prateleira de Macramê, com três níveis de madeira e tábua de 40 × 15 cm, e o Painel Organizador, com cavilha fixa e duas removíveis de 45 cm. Separadas sairiam R$ 210. As duas vão na mesma cor, escolhida na compra.",
    materiais: ["Prateleira de Macramê (tábua de 40 × 15 cm)", "Painel Organizador (cavilhas de 45 cm)", "Fio de macramê 85% algodão"],
    medidas: "Prateleira: madeira de 40 × 15 cm, altura total de aproximadamente 80 cm. Painel: cavilhas removíveis de 45 cm, altura conforme a alça.",
    cuidados: [
      "Limpar com pano levemente úmido ou esponja mágica, de leve",
      "A madeira pode molhar no dia a dia, mas não deixe encharcada nem na chuva",
      "Evitar produtos abrasivos, excesso de água e sol direto prolongado",
      "Com o uso o fio laceia um pouco — é característica do macramê",
    ],
    prazo: "Produção sob encomenda",
  },

  /* ------------------------------------------------------------- TESTE
     Peça de teste, para conferir de ponta a ponta que a venda funciona:
     cobrança, webhook e e-mail de aviso.

     `oculto: true` tira ela da loja, da busca, da home e da página de
     encomenda — ela NÃO nasce na vitrine. Continua existindo para o link
     direto (produto.html?slug=teste-pagamento) e para o servidor cobrar,
     que é exatamente o que um teste precisa.

     ATENÇÃO ao valor: o preço é 1 centavo, mas a cobrança sai R$ 1,00. O
     total tem piso de um real em pedido.js ("Trava de segurança: desconto
     nunca pode zerar ou inverter a cobrança"). Então este teste custa R$ 1,00,
     não um centavo.

     APAGAR quando o teste terminar. */
  {
    slug: "teste-pagamento",
    nome: "Teste de Pagamento",
    preco: 0.01,
    oculto: true,
    categoria: "acessorios",
    disponibilidade: "pronta",
    destaque: false,
    tags: [],
    // Sem cor a escolher: é um teste, não uma peça.
    personalizavel: false,
    // Sem foto: caminhoImagem() cai no placeholder sozinho.
    fotos: [],
    alt: "Peça de teste, sem foto.",
    resumo: "Peça de teste. Não é um produto à venda.",
    descricao:
      "Existe só para conferir que a compra funciona de ponta a ponta: cobrança, confirmação e e-mail de aviso. Não aparece na loja e não é para ser comprada por cliente.",
    materiais: ["Nenhum — é um teste"],
    medidas: "Não se aplica.",
    cuidados: ["Não se aplica"],
    prazo: "Não se aplica",
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
/* Cartela real do fio, na ordem da tabela que a Milena mandou.
   Os nomes são os que o cliente vê e são os mesmos que o backend aceita —
   validacao.js recusa qualquer cor que não esteja nesta lista, para não
   entrar pedido de cor que ela não tem no estoque.
   Os hex são aproximação visual da foto da cartela, só para o quadradinho
   na tela. O fio de verdade manda. */
const CARTELA = [
  { nome: "Branco", cor: "#f5f3ef" },
  { nome: "Preto", cor: "#2b2b2b" },
  { nome: "Prata", cor: "#a8a9ab" },
  { nome: "Cinza", cor: "#7d7f80" },
  { nome: "Caramelo Claro", cor: "#b98a52" },
  { nome: "Caramelo", cor: "#a26a2f" },
  { nome: "Marrom", cor: "#4a3328" },
  { nome: "Amarelo Claro", cor: "#f2e08a" },
  { nome: "Amarelo Canário", cor: "#f5c518" },
  { nome: "Amarelo Ouro", cor: "#f0a500" },
  { nome: "Mostarda", cor: "#d99a1c" },
  { nome: "Laranja", cor: "#f4632a" },
  { nome: "Telha", cor: "#b5533a" },
  { nome: "Vermelho", cor: "#d92b2b" },
  { nome: "Vinho", cor: "#b01c4e" },
  { nome: "Bordô", cor: "#6e0f2e" },
  { nome: "Violeta", cor: "#6b2d8f" },
  { nome: "Rosa Bebê", cor: "#f4a6c0" },
  { nome: "Rosa Claro", cor: "#ef6e8a" },
  { nome: "Pink", cor: "#e0338c" },
  { nome: "Melancia", cor: "#f0554f" },
  { nome: "Morango", cor: "#c2185b" },
  { nome: "Azul Claro", cor: "#7fa6c9" },
  { nome: "Azul Piscina", cor: "#4d90b8" },
  { nome: "Azul Turquesa", cor: "#1a7fa8" },
  { nome: "Azul Royal", cor: "#1c4fa1" },
  { nome: "Azul Marinho", cor: "#14213d" },
  { nome: "Verde Jade", cor: "#10a89a" },
  { nome: "Verde Abacate", cor: "#a8c93a" },
  { nome: "Bandeira", cor: "#12a54a" },
  { nome: "Verde Musgo", cor: "#2f3b25" },
  { nome: "Verde Limão", cor: "#5cc24a" },
  { nome: "Verde Limão Neon", cor: "#a8e02c" },
  { nome: "Verde Neon", cor: "#c6f024" },
  { nome: "Salmão", cor: "#f28b7d" },
  { nome: "Azul Petróleo", cor: "#10505f" },
  { nome: "Verde Água", cor: "#7ec9ad" },
  { nome: "Rosa Chá", cor: "#d99aa0" },
  { nome: "Areia", cor: "#cfc0a8" },
  { nome: "Rosa Neon", cor: "#ff2e7e" },
  { nome: "Uva", cor: "#7a3b6b" },
  { nome: "Amarelo Neon", cor: "#f5e400" },
  { nome: "Azul Celeste", cor: "#7b83b8" },
  { nome: "Salmão Neon", cor: "#ff5544" },
  { nome: "Verde Oliva", cor: "#4a5d32" },
  { nome: "Laranja Neon", cor: "#ff4500" },
  { nome: "Lilás", cor: "#b9a6d4" },
  { nome: "Verde Escuro", cor: "#1f5c4a" },
  { nome: "Magenta", cor: "#9c1f5e" },
  { nome: "Cru Premium", cor: "#ece4d4" },
  { nome: "Camurça", cor: "#c2a273" },
  { nome: "Castanho", cor: "#6e6152" },
  { nome: "Bege", cor: "#d9c3a5" },
];

/* Quais cores esta peca aceita.

   Peca com `cores` propria usa a dela; o resto usa a cartela do croche. E o
   mesmo calculo na tela e no servidor -- por isso mora aqui, e nao em cada
   um dos dois. */
function coresDe(produto) {
  return produto && Array.isArray(produto.cores) && produto.cores.length
    ? produto.cores
    : CARTELA;
}

function produtoPorSlug(slug) {
  return PRODUTOS.find((p) => p.slug === slug) || null;
}

/* O catálogo que o cliente vê.

   Peça com `oculto: true` continua existindo para produtoPorSlug e para o
   servidor cobrar — ela só não aparece em vitrine, busca, filtro ou página de
   encomenda. É o que permite ter uma peça de teste comprável por link direto
   sem ela nascer na loja no meio dos sousplats.

   Toda listagem passa por aqui. Ler PRODUTOS direto numa tela nova é o jeito
   de a peça de teste vazar para a loja sem ninguém perceber. */
function produtosVisiveis() {
  return PRODUTOS.filter((p) => !p.oculto);
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
   Todo pedido paga frete, pela tabela de região abaixo. Mudar aqui muda o
   que o cliente vê no checkout E o que o servidor cobra — os dois leem daqui.
   ========================================================================= */

const ENVIO = {
  // De onde a encomenda sai. É o que ordena a tabela abaixo: quanto mais
  // longe daqui, mais caro. Mudar de cidade sem revisar a tabela deixa o
  // frete errado sem quebrar nada — foi exatamente o que aconteceu quando
  // esta origem ainda estava como São Paulo.
  origem: { cidade: "Marechal Cândido Rondon", uf: "PR" },

  // Não existe mais frete grátis: todo pedido paga a tabela da região.
  // `gratisAcimaDe: null` desliga a regra inteira — fretePara() nem chega a
  // olhar a lista de regiões, e o checkout para de mostrar quanto falta para
  // ganhar frete. Para religar um dia, basta pôr um valor aqui e as regiões
  // que valem na lista abaixo.
  gratisAcimaDe: null,
  regioesComFreteGratis: [],

  // Dentro do próprio Paraná é mais barato que o resto do Sul.
  // Cotado 21,42 para Curitiba, que é a ponta mais longe do estado.
  mesmoEstado: 22.9,

  // Valor fixo por região, do mais perto de Marechal para o mais longe.
  // É tabela fixa por decisão: nada aqui consulta os Correios em tempo real,
  // então o site nunca fica na mão de uma API de terceiro para fechar venda.
  // O custo disso é manutenção na unha — os Correios reajustam por IPCA uma
  // vez ao ano (o último entrou em 12/04/2026), e nessa data alguém precisa
  // recotar e mexer nos números abaixo. Sem isso a tabela envelhece calada.
  //
  // Estes números vieram do calculador dos Correios em 08/09/2026, com a
  // origem real (CEP 85960-000). Antes eram chute, e o chute estava barato
  // demais: o Nordeste custava 80,20 e a tabela cobrava 39,90 — cada venda
  // para lá saía com 40 reais de prejuízo só no frete.
  //
  // O preço usado é o do PAC postado pelo app/site dos Correios, que é mais
  // barato que o balcão (o balcão em Salvador é 87,50). Para ficar nesse
  // valor, a postagem tem de ser feita pelo app.
  //
  // Em cada região ficou o CEP mais caro que testei, com uma folga de uns 2
  // reais em cima — assim nenhuma venda sai no prejuízo.
  //
  // Uma caixa de 30 × 25 × 10 com 800 g (sousplat, bolsa, tapete) e outra de
  // 45 × 20 × 12 com 2 kg (a prateleira) deram exatamente o mesmo preço, então
  // uma tabela só cobre o catálogo inteiro. Peça pequena de 300 g (porta-copos,
  // necessaire) sai cerca de 8 reais mais barata, ou seja: quem manda só uma
  // peça pequena paga um pouco mais do que custa.
  tabela: {
    sul: 34.9, // cotado 32,31 — Florianópolis e Porto Alegre
    sudeste: 39.9, // cotado 38,17 — Rio e Belo Horizonte (São Paulo é 32,31)
    "centro-oeste": 61.9, // cotado 59,77 — Brasília e Cuiabá
    nordeste: 82.9, // cotado 80,20 — Salvador e Fortaleza
    norte: 82.9, // cotado 80,20 — Manaus e Belém
  },
};

/* =========================================================================
   Retirada em mãos

   Quem mora em Marechal não precisa pagar frete: combina a retirada na
   Unioeste. Isso é declarado por quem compra, marcando uma caixinha no
   checkout — não dá para conferir de fora, e não precisa: quem marcar sem
   ser da cidade fica sem receber, porque nada é postado. O prejuízo de uma
   marcação errada é uma conversa no WhatsApp, não dinheiro perdido.
   ========================================================================= */

const RETIRADA = {
  ativo: true,
  cidade: "Marechal Cândido Rondon",
  uf: "PR",

  // Faixa de CEP do município, conferida um prefixo por vez no ViaCEP em
  // 09/09/2026: 85955 é Maripá, 85960 a 85977 são todos Marechal, e 85980 já
  // é Guaíra. A faixa abaixo cobre o bloco inteiro com folga nas duas pontas
  // até o vizinho.
  //
  // A conferência é por faixa numérica, e não por consulta ao ViaCEP, de
  // propósito: consulta externa no caminho do pagamento é uma dependência que
  // pode cair, e aí sobraria escolher entre travar a venda ou liberar sem
  // conferir. Faixa de CEP é alocação dos Correios e praticamente não muda.
  cepDe: 85960000,
  cepAte: 85979999,
  // Rótulo da caixinha no checkout.
  rotulo: "Sou de Marechal Cândido Rondon (PR) e quero retirar em mãos",
  local: "Unioeste",
  // O aviso que aparece quando a pessoa marca. O telefone NÃO é escrito aqui:
  // quem monta a frase pega de ATELIE.whatsapp, para existir um número só no
  // site inteiro. Repetir o número aqui seria criar um segundo lugar para
  // errar quando ele mudar.
  aviso:
    "Retire seu pedido na Unioeste. Para mais informações ou em caso de dúvidas, entre em contato com a Milena.",
};

/* O CEP é de Marechal? É isto que decide se a retirada vale, no navegador e
   no servidor — os dois chamam esta mesma função. */
function cepEhDaCidadeDaRetirada(cep) {
  const digitos = String(cep || "").replace(/\D/g, "");
  if (digitos.length !== 8) return false;
  const n = Number(digitos);
  return n >= RETIRADA.cepDe && n <= RETIRADA.cepAte;
}

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
/* Quando houver frete grátis de novo, quem decide é o valor das PEÇAS, antes
   dos descontos. Se fosse depois, um desconto poderia derrubar o pedido abaixo
   do limite e o frete reapareceria na tela — a pior surpresa de um checkout. */
function fretePara(uf, subtotalSemDesconto) {
  const alvo = String(uf || "").trim().toUpperCase();
  const regiao = regiaoPorUF(alvo);
  if (!regiao) return null;
  if (
    ENVIO.gratisAcimaDe != null &&
    ENVIO.regioesComFreteGratis.includes(regiao) &&
    subtotalSemDesconto >= ENVIO.gratisAcimaDe
  )
    return 0;
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
    { id: "cartao", nome: "Cartão de crédito", descricao: "Parcelamento definido na página da InfinitePay." },
    { id: "debito", nome: "Cartão de débito", descricao: "Débito à vista, na página da InfinitePay." },
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
    percentual: 7,
    rotulo: "Desconto no Pix",
  },
  // true  = os dois somam (10% + 7% = 17%)
  // false = vale só o maior dos dois
  acumulam: true,
};

/* =========================================================================
   Brinde por valor de compra

   A barrinha do checkout ("Adicione R$ X e ganhe um brinde") lê daqui.

   A conta é sobre o SUBTOTAL das peças, antes dos descontos — de propósito.
   Se fosse depois, aplicar o desconto do Pix poderia derrubar o pedido
   abaixo dos 150 e o brinde sumiria da tela depois de já ter aparecido, que
   é exatamente o tipo de surpresa que faz gente desistir da compra. É a
   mesma regra que o frete grátis usava quando existia.
   ========================================================================= */

const BRINDE = {
  ativo: true,
  aPartirDe: 150,
};

/* Quanto falta para o brinde, e se já ganhou.
   `null` em falta significa "não há brinde configurado" — aí a tela não
   desenha barra nenhuma, em vez de desenhar uma barra sempre cheia. */
function brindePara(subtotalSemDesconto) {
  if (!BRINDE.ativo || !(BRINDE.aPartirDe > 0)) {
    return { ativo: false, ganhou: false, falta: null, aPartirDe: null };
  }
  const subtotal = Number(subtotalSemDesconto) || 0;
  const falta = arredondar(Math.max(0, BRINDE.aPartirDe - subtotal));
  return { ativo: true, ganhou: falta === 0, falta, aPartirDe: BRINDE.aPartirDe };
}

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

  // Percentuais somados sobre o subtotal, não em cascata: 10% + 7% tira 17%
  // do valor cheio, e não 7% do que sobrou depois dos 10%. É o que a cliente
  // quis dizer e é o que o cliente espera ao ler "10% + 7%".
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
    CORES_MACRAME,
    coresDe,
    ENVIO,
    RETIRADA,
    cepEhDaCidadeDaRetirada,
    BRINDE,
    brindePara,
    UF_POR_REGIAO,
    UFS,
    PAGAMENTO,
    DESCONTOS,
    calcularDescontos,
    linkWhatsApp,
    formatarPreco,
    produtoPorSlug,
    produtosVisiveis,
    caminhoImagem,
    precoPara,
    regiaoPorUF,
    fretePara,
    podeComprarOnline,
    precisaEscolherCor,
  };
}
