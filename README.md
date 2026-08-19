# Begônia Ateliê

Site institucional e vitrine da Begônia Ateliê — boutique artesanal de crochê, tricô e macramê.

Construído a partir do export do Google Stitch (`stitch_beg_nia_ateli_boutique_artesanal.zip`),
seguindo o design system descrito no `DESIGN.md` daquele export.

> **Falta alguma coisa para entrar no ar?** A lista completa do que ainda precisa vir da
> cliente — contato, fotos reais, credenciais do Mercado Pago, e-mail, domínio — está em
> [CHECKLIST-CLIENTE.md](CHECKLIST-CLIENTE.md).

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Compila o CSS e sobe o site em http://localhost:4321 (sem `/api`) |
| `npm run dev:api` | Site + funções serverless, via `vercel dev` |
| `npm run build` | Compila `src/css/input.css` para `css/site.css` (minificado) |
| `npm run watch` | Mesma coisa, em modo observador |
| `npm run serve` | Só o servidor estático |
| `npm run teste:api` | Testes do backend com o Mercado Pago simulado |

Instruções completas em [Rodando localmente](#rodando-localmente).

## Estrutura

```
index.html            Home
loja.html             Catálogo com filtros, ordenação e paginação
produto.html          Detalhe da peça — carregado via ?slug=cardigan-outono
sob-encomenda.html    Processo, cartela de cores e briefing de encomenda
sobre.html            História do ateliê
contato.html          Canais, formulário, envio/pagamento/trocas

src/css/input.css     Design system: tokens @theme + componentes
src/js/dados.js       Contato do ateliê, catálogo de peças e cartela de fios
src/js/site.js        Cabeçalho, painéis, busca, favoritos, revelação no scroll
src/js/loja.js        Filtros, ordenação e paginação da loja
src/js/produto.js     Página de detalhe e peças relacionadas
src/js/encomenda.js   Cartela e briefing de encomenda
src/js/checkout.js    Formulário de checkout, frete e chamada de pagamento
src/js/pedido.js      Acompanhamento do pedido, QR do Pix e confirmação

checkout.html         Dados, entrega e pagamento
pedido.html           Status do pedido, QR do Pix, confirmação
privacidade.html      Política de privacidade (LGPD)

api/config.js             Public key e regras de frete para o navegador
api/criar-pagamento.js    Cria a cobrança (Pix ou cartão)
api/status-pagamento.js   Consulta de status, usada pelo Pix
api/webhook.js            Confirmação do Mercado Pago
api/_lib/                 Gateway, validação, pedido, armazenamento e e-mail
testes/api.test.js        Testes do backend com o Mercado Pago simulado

assets/img/           Imagens do export, baixadas em alta resolução
css/site.css          Gerado pelo build — não edite à mão
_stitch/              Export original do Stitch, mantido como referência
```

## O que editar

**Contato, preços e peças:** tudo vive em [`src/js/dados.js`](src/js/dados.js). Nenhum HTML
precisa ser tocado para trocar telefone, adicionar produto ou mudar preço.

> **Antes de publicar:** troque `ATELIE.whatsapp` em `src/js/dados.js` — hoje está com o
> número de exemplo `5511999990000`. O mesmo vale para `instagram`, `email` e `cidade`.

**Cores e tipografia:** o bloco `@theme` no topo de [`src/css/input.css`](src/css/input.css)
carrega a paleta inteira do `DESIGN.md`. Mudar um token ali reflete no site todo.

## Decisões

**Dois caminhos de compra, de propósito.** Peça de **pronta entrega** é paga online, no
checkout. Peça **sob encomenda** continua fechando pelo WhatsApp, porque o preço final
depende de cor, medida e prazo — não dá para cobrar antes de combinar. A sacola separa as
duas coisas sozinha e mostra o botão certo para cada uma.

**A sacola nasceu da lista de favoritos.** Mesma chave de `localStorage`, mesma gaveta.
Quem já tinha peças salvas antes do checkout existir não perdeu nada: o formato antigo
(`["slug"]`) é convertido para o novo (`[{slug, quantidade}]`) na primeira leitura.

**Tailwind por CLI, não por CDN.** O export do Stitch usava `cdn.tailwindcss.com`, que não
é para produção. Os mesmos nomes de classe (`text-headline-xl`, `px-margin-desktop`,
`gap-gutter`) continuam válidos porque os tokens do `DESIGN.md` viraram variáveis `@theme`
do Tailwind v4.

**Ícones em SVG inline** no lugar da fonte Material Symbols, para não exibir a palavra
`shopping_cart` na tela enquanto a fonte carrega.

**Imagens locais.** O export apontava para URLs temporárias do Google (`lh3.googleusercontent.com`).
As 17 imagens foram baixadas em alta resolução para `assets/img/`.

## Pagamento online

O site continua estático. O pagamento mora em quatro funções serverless em `/api`, no
padrão da Vercel. O front é HTML e JS puro chamando essas funções por `fetch`.

### Como o dinheiro anda

```
navegador                        servidor (/api)                Mercado Pago
   |                                   |                              |
   |-- POST /api/criar-pagamento ----->|                              |
   |   { slug, quantidade, cliente }   |-- recalcula o preço do zero  |
   |                                   |-- cria a cobrança ---------->|
   |<-- QR do Pix ou URL do cartão ----|<-----------------------------|
   |                                   |                              |
   |-- paga (Pix no banco, cartão no ambiente do MP) ---------------->|
   |                                   |<-- POST /api/webhook --------|
   |                                   |-- confere assinatura e valor |
   |                                   |-- e-mail para a dona         |
   |-- GET /api/status-pagamento ----->|                              |
   |<-- aprovado ----------------------|                              |
```

### As três regras que não se negociam

**1. O navegador nunca vê número de cartão.** Ao escolher cartão, a pessoa vai para o
Checkout Pro do Mercado Pago. Não existe campo de cartão em lugar nenhum deste repositório.

**2. O preço é decidido pelo servidor.** A requisição de pagamento carrega apenas `slug` e
`quantidade`. Preço, frete e total são recalculados em `api/_lib/pedido.js` lendo
`src/js/dados.js`. Preço forjado no DevTools é ignorado — há teste automatizado para isso.

**3. O webhook é verificado antes de virar pedido.** A notificação passa por conferência de
assinatura HMAC (`MP_WEBHOOK_SECRET`); depois o valor é confirmado numa consulta nossa à API
do Mercado Pago; e só então a dona é avisada. Uma trava atômica garante um e-mail por
pedido, mesmo com os reenvios que o Mercado Pago faz.

### Trocar de gateway

Todo o Mercado Pago está em `api/_lib/mercadopago.js`. Para trocar: escreva outro arquivo
com as mesmas funções (`criarPagamentoCartao`, `criarPagamentoPix`, `consultarPagamento`,
`validarWebhook`, `traduzirStatus`), registre em `api/_lib/gateway.js` e defina `GATEWAY` no
ambiente. Nenhum endpoint muda.

### Frete

As regras estão em `ENVIO`, dentro de `src/js/dados.js`: valor fixo por região, grátis acima
de R$ 400 no Sudeste e no Sul, que é o que a página de contato já prometia. O navegador e o
servidor leem a mesma tabela. Para plugar cálculo real dos Correios, só a função
`fretePara()` precisa mudar.

## O que você precisa providenciar

### 1. Mercado Pago

1. Crie ou entre na conta em [mercadopago.com.br](https://www.mercadopago.com.br).
2. Vá em **Seu negócio → Configurações → Gestão e administração → Credenciais**.
3. Copie o par de **Credenciais de teste**: `Access token` e `Public key`.
4. Em **Suas integrações → sua aplicação → Webhooks**, cadastre a URL
   `https://SEU-SITE/api/webhook`, marque o evento **Pagamentos** e copie a **chave secreta**.

### 2. Resend (e-mail para a dona)

1. Crie a conta em [resend.com](https://resend.com).
2. **API Keys → Create API Key**: copie a chave.
3. **Domains → Add Domain**: cadastre o domínio e adicione os registros DNS que o Resend
   indicar. Sem domínio verificado, use `onboarding@resend.dev` como remetente — mas ele só
   entrega para o e-mail dono da conta, o que serve apenas para teste.
4. Defina `EMAIL_DONA` com a caixa que a dona lê todo dia.

### 3. Histórico de pedidos (recomendado)

No painel da Vercel: **Storage → Create Database → Upstash for Redis**. Ao conectar ao
projeto, a Vercel cadastra `KV_REST_API_URL` e `KV_REST_API_TOKEN` sozinha. Sem isso o site
vende, mas o pedido não fica registrado entre execuções e a trava anti-duplicação de e-mail
perde a memória.

### 4. Preencha as variáveis

Copie `.env.example` para `.env.local` e preencha. Cada variável tem, ali, um comentário
dizendo de onde ela vem.

## Testando o pagamento

### Cartão de teste

Com `MP_MODO=teste` e as credenciais de teste, use um destes cartões
([lista completa](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/cards)):

| Bandeira | Número | CVV | Validade |
| --- | --- | --- | --- |
| Mastercard | 5031 4332 1540 6351 | 123 | 11/30 |
| Visa | 4235 6477 2802 5682 | 123 | 11/30 |

O resultado é decidido pelo **nome do titular**:

| Nome do titular | Resultado |
| --- | --- |
| `APRO` | aprovado |
| `OTHE` | recusado por erro geral |
| `FUND` | recusado por saldo insuficiente |
| `SECU` | recusado por código de segurança |

No documento, use um CPF válido qualquer, por exemplo `12345678909`.

### Pix de teste

No ambiente de teste o Mercado Pago gera um QR de verdade, mas ele não é pagável por app de
banco real. Para simular a aprovação, use o painel do Mercado Pago em **Suas integrações →
sua aplicação → Testes**, ou aprove o pagamento pela API. Assim que o status virar
`approved`, o webhook dispara e a tela do pedido muda sozinha.

### Testando o webhook em desenvolvimento

O Mercado Pago não alcança `localhost`. Exponha a porta com um túnel:

```bash
npx localtunnel --port 4321      # ou: ngrok http 4321
```

e cadastre a URL pública como webhook no painel do Mercado Pago.

### Testes automatizados

```bash
npm run teste:api
```

Sobe os quatro endpoints com o Mercado Pago e o Resend simulados e confere, entre outras
coisas: preço forjado é ignorado, peça sob encomenda é bloqueada, CPF inválido é recusado no
Pix, assinatura de webhook inválida é rejeitada, valor divergente não confirma pedido,
reenvio do webhook não duplica e-mail, e o endpoint de status não vaza endereço, e-mail nem
CPF.

## Rodando localmente

```bash
npm run dev          # http://localhost:4321
```

O `dev-server.js` serve os arquivos estáticos **e executa as funções de `/api`**, do mesmo
jeito que a Vercel faz. Não precisa de conta, login nem `vercel link`. Ele lê o `.env.local`
sozinho e recarrega os arquivos de `/api` a cada chamada, então dá para editar o backend sem
reiniciar.

> Se você usar `npx http-server`, a pasta `/api` fica parada no disco: `/api/config` responde
> 404 e o checkout mostra "pagamento fora do ar". É o comportamento correto, mas não é o que
> você quer em desenvolvimento.

### Testando sem conta no Mercado Pago

O `.env.local` já vem com `GATEWAY=simulado`. Nesse modo o pagamento **aprova sozinho** depois
de 12 segundos, dispara o webhook de verdade e tenta enviar o e-mail — exercitando o caminho
inteiro sem cobrar ninguém e sem credencial nenhuma. O checkout mostra uma tarja laranja
avisando que é teste.

```
GATEWAY=simulado
SIMULADO_ATRASO_SEGUNDOS=12
```

O `api/_lib/simulado.js` se recusa a rodar em produção: se `VERCEL_ENV=production`, ele
levanta erro em vez de deixar uma venda passar sem cobrança.

Quando as credenciais chegarem, troque para `GATEWAY=mercadopago` e preencha
`MP_ACCESS_TOKEN`. Nada mais muda.

### Com o Vercel CLI (opcional)

Se preferir rodar igualzinho à produção:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local
npm run dev:api
```

## Publicando na Vercel

1. `npm i -g vercel` e `vercel link` na pasta do projeto.
2. No painel da Vercel, em **Settings → Environment Variables**, cadastre todas as variáveis
   do `.env.example` para os ambientes **Production** e **Preview**.
3. `vercel --prod`.
4. Cadastre o webhook no Mercado Pago apontando para `https://SEU-DOMINIO/api/webhook`.
5. Quando estiver tudo testado, troque as credenciais de teste pelas de produção e mude
   `MP_MODO` para `producao`.

O `vercel.json` já cuida do build do Tailwind, dos cabeçalhos de segurança
(`Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`) e do cache das
imagens.

> **HTTPS é obrigatório.** A Vercel serve tudo por HTTPS com HSTS, então isso já vem
> resolvido. Se um dia mudar de hospedagem, não publique este checkout em HTTP: dados
> pessoais e a comunicação com o gateway ficariam expostos no caminho.

## Proteção de dados

- **Cartão:** nunca passa por aqui. Só pelo Mercado Pago.
- **CPF:** repassado ao Mercado Pago, que precisa dele por lei, e não guardado no nosso
  histórico. A dona vê o CPF no painel do Mercado Pago quando precisar.
- **Validação:** todo campo é limpo e conferido no servidor antes de virar pedido ou e-mail
  (`api/_lib/validacao.js`), inclusive contra injeção de cabeçalho de e-mail.
- **Retenção:** os dados do pedido expiram sozinhos em 180 dias (`RETENCAO_PEDIDOS_DIAS`).
- **LGPD:** a página [privacidade.html](privacidade.html) explica coleta, compartilhamento,
  prazo e direitos, e está linkada no rodapé de todas as páginas.

## Limitações conhecidas

- **Não há controle de estoque.** Duas pessoas conseguem comprar a mesma peça única no mesmo
  dia. Para um ateliê que produz sob demanda isso costuma se resolver na conversa, mas se
  virar problema, o caminho é um campo `estoque` em `dados.js` e uma verificação em
  `api/_lib/pedido.js` — com reserva no Redis para valer entre execuções.
- **O frete é por tabela, não pelos Correios.** Trocar por cálculo real é mudar só
  `fretePara()`.
- **A busca de endereço usa o ViaCEP.** Se o serviço estiver fora, o formulário continua
  funcionando: a pessoa preenche à mão.

## Publicando sem pagamento

Se um dia o pagamento sair de cena, o site volta a ser 100% estático: rode `npm run build` e
publique a pasta inteira (menos `node_modules/` e `api/`) em qualquer hospedagem comum.
