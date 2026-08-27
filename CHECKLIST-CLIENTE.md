# Begônia Ateliê — o que falta para o site entrar no ar

Este documento lista tudo que ainda precisa vir da cliente para o site sair do modo de
teste e vender de verdade. Está separado por assunto e marcado por urgência:

- 🔴 **Trava o lançamento** — sem isso o site não pode ir ao ar.
- 🟡 **Trava o pagamento** — o site vai ao ar, mas ninguém consegue pagar online.
- 🟢 **Melhora depois** — dá para lançar sem, e resolver na sequência.

---

## 1. Contato do ateliê 🔴

Hoje esses valores são **exemplos inventados** e aparecem em todo botão de WhatsApp do site,
no rodapé, na página de contato e dentro dos e-mails de pedido.

| O que preciso | Situação | Onde é usado |
| --- | --- | --- |
| Número de WhatsApp | ⚠️ `+55 45 9852-4129` — **conferir, ver abaixo** | Todos os botões de WhatsApp, e-mail de pedido |
| Perfil do Instagram | ✅ `instagram.com/begonia.ateliee` | Rodapé, página de contato |
| E-mail de contato | ❌ ainda é exemplo | Rodapé, página de contato, privacidade |
| Cidade e estado do ateliê | ❌ ainda diz "São Paulo, SP" | Página de contato |
| Horário de atendimento | ❌ ainda é exemplo | Página de contato |

> ⚠️ **O WhatsApp precisa de confirmação.** O número informado foi
> **+55 45 9852-4129**, que tem **8 dígitos depois do DDD**. Celular no Brasil tem 9 —
> todos ganharam o dígito 9 na frente. O provável é que o certo seja
> **(45) 99852-4129**.
>
> Um dígito a menos não dá erro visível: o link abre e o WhatsApp diz que o número não
> existe. Como ele está em **todo botão do site** e dentro do e-mail de pedido, vale
> confirmar antes de publicar.
>
> Se estiver faltando o 9, é uma linha em `src/js/dados.js`: trocar `554598524129`
> por `5545998524129`.

> **O DDD 45 é do Paraná** (região de Cascavel e Foz do Iguaçu), mas a página de contato
> ainda diz "São Paulo, SP". Precisa da cidade real dela.

> Onde entra: `src/js/dados.js`, no objeto `ATELIE` (primeiras linhas do arquivo).

---

## 2. Fotos e textos das peças 🔴

**Este é o item mais importante e o que costuma demorar mais.**

As 17 imagens que estão no site hoje **foram geradas por inteligência artificial** pelo
Google Stitch. São bonitas, mas não são peças reais do ateliê. Vender uma foto de IA como se
fosse o produto é problema de propaganda enganosa, além de gerar troca e devolução.

Preciso de:

- [ ] **Foto de cada peça** — pelo menos uma por produto, de preferência três: a peça
      inteira, um detalhe do ponto, e ela em uso na casa/no corpo.
      Formato: o mais alto que a câmera der, retrato (vertical), fundo limpo.
- [ ] **Nome real de cada peça**
- [ ] **Preço real de cada peça**
- [ ] **Quais são pronta entrega e quais são sob encomenda** — isso muda o caminho de compra:
      pronta entrega vai para o checkout, sob encomenda fecha pelo WhatsApp.
- [ ] **Prazo real** de envio e de produção de cada uma
- [ ] **Materiais, medidas e cuidados** de cada peça
- [ ] **Foto do ateliê / da dona** para a página "Sobre"

### Textos que eu escrevi e ela precisa aprovar ou corrigir

Tudo abaixo é rascunho meu, escrito para o site não ficar com "lorem ipsum". Nada disso é
informação real:

- [ ] **Os três depoimentos da home** (Marina de Curitiba, Júlia de São Paulo, Ana de Belo
      Horizonte) — **são fictícios**. Ou ela manda depoimentos reais de clientes (com
      autorização), ou a seção sai do ar.
- [ ] **Os números da página Sobre**: "7 anos de ateliê", "1.400+ peças entregues",
      "12 encomendas por mês", "2 pares de mãos".
- [ ] **A história do ateliê**: "nasceu numa mesa de cozinha, em 2019, quando um suporte de
      planta virou pedido de três amigas".
- [ ] **As descrições de cada peça** — escrevi todas inventando detalhes.
- [ ] **A cartela de fios** (7 cores) — conferir se são as cores que ela realmente trabalha.

---

## 3. Regras de venda 🔴

| O que preciso | Está hoje (chute meu) |
| --- | --- |
| Valor do frete por região, ou conta nos Correios | R$ 24,90 Sudeste / 29,90 Sul / 34,90 CO / 39,90 NE / 44,90 N |
| A partir de quanto o frete é grátis, e para onde | Grátis acima de R$ 400, só Sudeste e Sul |
| Prazo de envio da pronta entrega | 2 dias úteis |
| Política de troca e devolução | 7 dias arrependimento, 30 dias troca de tamanho |
| Conserto gratuito: existe mesmo? por quanto tempo? | 1 ano |
| Aceita quantas parcelas no crédito? | até 12× (limite da InfinitePay) |
| Quem paga o juro do parcelamento: ela ou o cliente? | a definir com ela |

### Regras que ela já definiu — implementadas

| Regra | Como está no site |
| --- | --- |
| Frete grátis a partir de R$ 120 | Vale para **todo o Brasil**. Ela não restringiu região |
| 10% na primeira compra | Verificado pelo e-mail, contra o histórico de pedidos pagos |
| 5% no Pix | Aplicado quando a pessoa declara Pix no checkout |

**Os três acumulam.** Numa primeira compra pagando com Pix, o desconto é de **15%**.

> ⚠️ **Confira a conta com ela antes de publicar.** Uma peça de R$ 130 vendida para o Norte,
> na primeira compra, no Pix, fica assim:
>
> | | |
> | --- | --- |
> | Peça | R$ 130,00 |
> | Primeira compra (10%) | − R$ 13,00 |
> | Pix (5%) | − R$ 6,50 |
> | Frete (grátis acima de 120, mas custa) | − R$ 44,90 do bolso dela |
> | **Ela recebe** | **R$ 110,50** |
> | **Ela gasta com frete** | **R$ 44,90** |
> | **Sobra bruta** | **R$ 65,60 de uma venda de R$ 130** |
>
> Isso é metade do preço de tabela, antes do custo do fio e das horas de trabalho.
> Três coisas resolveriam, e ela escolhe:
>
> - [ ] **Limitar o frete grátis a Sudeste e Sul** (era assim antes; o Norte custa quase o
>       dobro). Mudança: uma linha em `dados.js`.
> - [ ] **Não acumular os descontos** — vale só o maior dos dois, ou seja, 10%.
>       Mudança: `DESCONTOS.acumulam = false`.
> - [ ] **Subir o limite do frete grátis** de R$ 120 para algo como R$ 200.
>
> Deixei tudo como ela pediu. As três mudanças são de uma linha cada.
| Quantidade máxima da mesma peça num pedido | 5 |

> Onde entra: `src/js/dados.js` (`ENVIO` e `PAGAMENTO`) e `contato.html`.

---

## 4. InfinitePay 🟡

O gateway escolhido é a **InfinitePay**. A boa notícia: é o item mais curto desta lista
inteira. Precisamos de **uma informação só**.

### O que preciso

- [x] ~~**A InfiniteTag dela**~~ — **recebida: `$begoniaatelie`**, conta lojista CPF no nome de
      Fabricio Sanches Correa. Já está configurada no projeto.

**Não existe chave secreta, token nem senha para me passar.** Este item está fechado.

### O que ela precisa fazer na conta dela

- [ ] **Ter conta na InfinitePay** (CPF ou CNPJ). Se ainda não tem:
      [infinitepay.io](https://www.infinitepay.io).
- [x] ~~**Habilitar o Checkout Integrado**~~ — **feito em 27/08/2026**. Testei contra a API
      real: a criação de link responde 200.
- [ ] **Cadastrar a chave Pix** dentro da InfinitePay, para o Pix funcionar.
- [ ] **Conferir a conta bancária de saque** — é para lá que o dinheiro vai.

### O que ela precisa saber antes de decidir

- **Pix não tem taxa** na InfinitePay. É a principal vantagem sobre o Mercado Pago.
- **Não tem cartão de débito** no checkout online deles. O site vai oferecer **Pix e cartão
  de crédito**. Se débito for importante para ela, o caminho é voltar ao Mercado Pago —
  o código suporta os dois, é trocar uma variável.
- **O crédito parcela em até 12×.** Confirmar com ela quem paga o juro: ela ou o cliente.
- **O cliente sai do site para pagar.** Ele preenche os dados no nosso checkout, e a tela
  de pagamento em si é a da InfinitePay. Depois ele volta sozinho para a página do pedido.
- [ ] Pedir para ela conferir as **taxas atuais de crédito** no app, para saber se o preço
      das peças cobre.

### Uma observação técnica que vale registrar

A API da InfinitePay não usa chave secreta: a conta é identificada só pela InfiniteTag, que
é pública. Também não há assinatura criptográfica no aviso de pagamento.

Isso está tratado no código. Antes de confirmar qualquer venda, o servidor faz três
conferências: o número do pedido tem de existir no nosso histórico, o pagamento é
reconsultado direto na API da InfinitePay, e o valor tem de bater com o que calculamos.
Um aviso falso não passa por nenhuma das três.

---

## 5. E-mail de aviso de pedido 🟡

É por aqui que ela fica sabendo que vendeu.

- [ ] **Conta no [resend.com](https://resend.com)** (o plano grátis dá 3.000 e-mails por mês,
      mais do que suficiente)
- [ ] **API key** do Resend
- [ ] **E-mail onde ela quer receber os pedidos** — a caixa que ela abre todo dia
- [ ] **Domínio próprio** (ver item 6) para o e-mail sair como `pedidos@begoniaatelie.com.br`

Sem domínio verificado, o Resend só entrega para o e-mail dono da conta — serve para testar,
não para produção.

---

## 6. Domínio e hospedagem 🟡

- [ ] **O domínio já existe?** (`begoniaatelie.com.br` ou outro)
  - Se sim: preciso de **acesso ao painel de DNS** (Registro.br, GoDaddy, Hostinger…) para
    apontar o site e verificar o e-mail.
  - Se não: decidir o nome e registrar. `.com.br` custa cerca de R$ 40/ano no Registro.br.
- [ ] **Conta na [Vercel](https://vercel.com)** — plano grátis atende de sobra um ateliê.

---

## 7. Dados fiscais 🟢

Necessários para emitir nota e para a política de privacidade ficar juridicamente correta.

- [ ] **CNPJ** (ou CPF, se ela vende como pessoa física)
- [ ] **Razão social e endereço** — a política de privacidade precisa identificar quem é o
      responsável pelos dados, e hoje está genérica
- [ ] **Como ela emite nota fiscal hoje?** (MEI pelo portal, contador, algum sistema)
- [ ] Se possível, **revisão da política de privacidade por um advogado**. Escrevi um texto
      honesto e alinhado com a LGPD, mas não sou advogado e ela é a responsável legal pelos
      dados dos clientes.

---

## 8. Coisas que o site ainda não faz 🟢

Deixo registrado para não virar surpresa depois:

- **Não há controle de estoque.** Duas pessoas conseguem comprar a mesma peça única no mesmo
  dia. Para um ateliê que produz sob demanda isso costuma se resolver na conversa. Se
  incomodar, dá para implementar — preciso saber a quantidade real de cada peça.
- **O frete é tabela fixa, não cálculo dos Correios.** Trocar por cálculo real exige contrato
  ou conta nos Correios, e o peso e as dimensões de cada peça.
- **Não há painel de pedidos.** Ela recebe cada venda por e-mail e consulta o resto no painel
  do Mercado Pago. Um painel próprio é um projeto à parte.
- **Não há cupom de desconto nem frete promocional.**
- **O aviso de venda por WhatsApp está preparado, mas desligado.** O link já vai dentro do
  e-mail. Envio automático exige a API oficial do WhatsApp (ou Twilio/Z-API), que é paga e
  precisa de aprovação da Meta.

---

## Ordem sugerida

**Para lançar o site (sem pagamento online):** itens 1, 2 e 3. Com isso o site vai ao ar
bonito e correto, vendendo pelo WhatsApp como já é hoje.

**Para ligar o pagamento:** itens 4, 5 e 6. O item 4 é rápido — uma linha de resposta dela.

**Para ficar redondo:** itens 7 e 8.

---

## Enquanto isso não chega

O site já roda inteiro no seu computador, com o pagamento **simulado**: ele aprova sozinho
depois de 12 segundos e não cobra ninguém. Serve para mostrar o fluxo completo para a cliente
antes de ela abrir qualquer conta.

```bash
npm run dev      # http://localhost:4321
```

Quando a InfiniteTag chegar, é só trocar duas linhas no `.env.local`:

```
GATEWAY=infinitepay
INFINITEPAY_HANDLE=a-tag-dela
```
