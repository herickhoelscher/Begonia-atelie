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

| O que preciso | Está hoje | Onde é usado |
| --- | --- | --- |
| Número de WhatsApp com DDD | `(11) 99999-0000` | Todos os botões de WhatsApp, e-mail de pedido |
| Perfil do Instagram | `@begoniaatelie` | Rodapé, página de contato |
| E-mail de contato | `contato@begoniaatelie.com.br` | Rodapé, página de contato, privacidade |
| Cidade e estado do ateliê | `São Paulo, SP` | Página de contato |
| Horário de atendimento | `Seg a sex, 9h às 18h` | Página de contato |

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
| Aceita quantas parcelas sem juros? | 6× |
| Aceita cartão de débito? | Sim |
| Quantidade máxima da mesma peça num pedido | 5 |

> Onde entra: `src/js/dados.js` (`ENVIO` e `PAGAMENTO`) e `contato.html`.

---

## 4. Mercado Pago 🟡

Sem isso o checkout existe, mas mostra "pagamento fora do ar" e manda o cliente para o
WhatsApp.

- [ ] **Conta no Mercado Pago** no nome dela (CPF ou CNPJ do ateliê).
      Se ela ainda não tem, criar em [mercadopago.com.br](https://www.mercadopago.com.br).
- [ ] **Access token de TESTE** e **Public key de TESTE**
- [ ] **Access token de PRODUÇÃO** e **Public key de PRODUÇÃO**
- [ ] **Chave secreta do webhook**

**Onde ela acha isso:** entrar na conta → *Seu negócio* → *Configurações* → *Gestão e
administração* → *Credenciais*. Tem dois blocos, "Credenciais de teste" e "Credenciais de
produção".

A chave do webhook fica em: *Suas integrações* → a aplicação → *Webhooks* →
*Configurar notificações*.

> ⚠️ **Essas chaves são senha de banco.** O access token dá acesso ao dinheiro da conta dela.
> Peça para mandar por um canal privado, nunca por grupo de WhatsApp ou e-mail comum.
> Depois de configurar, peça para ela apagar a mensagem.

- [ ] Confirmar se a conta dela já está **habilitada para receber Pix** (precisa de chave Pix
      cadastrada no Mercado Pago).
- [ ] Verificar as **taxas** que o Mercado Pago cobra dela por Pix, débito e crédito, para
      ela decidir se o preço das peças cobre isso.

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

**Para ligar o pagamento:** itens 4, 5 e 6.

**Para ficar redondo:** itens 7 e 8.

---

## Enquanto isso não chega

O site já roda inteiro no seu computador, com o pagamento **simulado**: ele aprova sozinho
depois de 12 segundos e não cobra ninguém. Serve para mostrar o fluxo completo para a cliente
antes de ela abrir qualquer conta.

```bash
npm run dev      # http://localhost:4321
```

Quando as credenciais chegarem, é só preencher o `.env.local` e trocar
`GATEWAY=simulado` por `GATEWAY=mercadopago`.
