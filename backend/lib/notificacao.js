/* =========================================================================
   Begônia Ateliê — aviso de pedido pago.

   Canal ativo: e-mail para a dona, via Resend (API REST, sem SDK).
   Canal preparado: WhatsApp — o link já vem montado dentro do e-mail, e o
   envio automático está escrito e comentado no fim do arquivo.

   Nada de cartão entra aqui. O CPF também não: ele fica só no Mercado Pago.
   ========================================================================= */

const { ATELIE, formatarPreco, linkWhatsApp } = require("../../frontend/js/dados.js");

/* Escapa tudo que veio do cliente antes de virar HTML de e-mail.
   Sem isso, um nome com "<script>" viraria markup no cliente de e-mail. */
function esc(valor) {
  return String(valor == null ? "" : valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function telefoneLegivel(numero) {
  const d = String(numero || "");
  if (d.length === 13) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
  if (d.length === 12) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 8)}-${d.slice(8)}`;
  return d;
}

function cepLegivel(cep) {
  const d = String(cep || "");
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

const NOME_METODO = {
  pix: "Pix",
  cartao: "Cartão de crédito",
  debito: "Cartão de débito",
  checkout: "escolhida na página do provedor",
};

/* -------------------------------------------------------------------------
   Envio pelo Resend
   ------------------------------------------------------------------------- */
async function enviarEmail({ para, assunto, html, responderPara }) {
  const chave = process.env.RESEND_API_KEY;
  const remetente = process.env.EMAIL_REMETENTE;

  if (!chave || !remetente) {
    console.warn("[notificacao] RESEND_API_KEY ou EMAIL_REMETENTE ausente: e-mail não enviado para %s", para);
    return { enviado: false, motivo: "configuracao-ausente" };
  }

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${chave}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: remetente,
      to: [para],
      subject: assunto,
      html,
      ...(responderPara ? { reply_to: responderPara } : {}),
    }),
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    console.error("[notificacao] Resend respondeu %s: %s", resposta.status, texto.slice(0, 400));
    return { enviado: false, motivo: `resend-${resposta.status}` };
  }
  return { enviado: true };
}

/* -------------------------------------------------------------------------
   Modelo visual — as mesmas cores do site, escritas à mão porque cliente de
   e-mail não carrega CSS externo nem entende variável de tema.
   ------------------------------------------------------------------------- */
const COR = {
  fundo: "#faf9f6",
  cartao: "#ffffff",
  primaria: "#a03f28",
  texto: "#1a1c1a",
  suave: "#56423d",
  linha: "#ddc0ba",
  oliva: "#596338",
};

function moldura(titulo, miolo) {
  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:24px;background:${COR.fundo};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${COR.texto}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:${COR.cartao};border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(93,64,55,.08)">
    <tr><td style="padding:28px 28px 8px">
      <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${COR.oliva}">Begônia Ateliê</p>
      <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:24px;font-weight:600;color:${COR.primaria}">${esc(titulo)}</h1>
    </td></tr>
    <tr><td style="padding:16px 28px 28px">${miolo}</td></tr>
  </table>
  <p style="max-width:600px;margin:16px auto 0;font-size:12px;color:${COR.suave};text-align:center">
    Enviado automaticamente pelo site do ${esc(ATELIE.nome)}.
  </p>
</body></html>`;
}

function tabelaItens(pedido) {
  const linhas = pedido.itens
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${COR.linha}66">
          <strong style="font-weight:600">${esc(i.nome)}</strong><br>
          <span style="font-size:13px;color:${COR.suave}">
            ${i.quantidade} × ${esc(formatarPreco(i.precoUnitario))}${i.cor ? " &middot; <strong>" + esc(i.cor) + "</strong>" : ""}
          </span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid ${COR.linha}66;text-align:right;white-space:nowrap">
          ${esc(formatarPreco(i.precoTotal))}
        </td>
      </tr>`
    )
    .join("");

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">
    ${linhas}
    <tr>
      <td style="padding:10px 0 0;color:${COR.suave}">Subtotal</td>
      <td style="padding:10px 0 0;text-align:right">${esc(formatarPreco(pedido.subtotal))}</td>
    </tr>
    ${(pedido.descontos || [])
      .map(
        (d) => `
    <tr>
      <td style="padding:4px 0;color:${COR.oliva}">${esc(d.rotulo)} (${d.percentual}%)</td>
      <td style="padding:4px 0;text-align:right;color:${COR.oliva}">− ${esc(formatarPreco(d.valor))}</td>
    </tr>`
      )
      .join("")}
    <tr>
      <td style="padding:4px 0;color:${COR.suave}">Frete</td>
      <td style="padding:4px 0;text-align:right">${pedido.frete === 0 ? "Grátis" : esc(formatarPreco(pedido.frete))}</td>
    </tr>
    <tr>
      <td style="padding:12px 0 0;border-top:2px solid ${COR.linha};font-weight:700">Total pago</td>
      <td style="padding:12px 0 0;border-top:2px solid ${COR.linha};text-align:right;font-weight:700;color:${COR.primaria};font-size:18px">
        ${esc(formatarPreco(pedido.total))}
      </td>
    </tr>
  </table>`;
}

function blocoDados(titulo, pares) {
  const linhas = pares
    .filter(([, valor]) => valor)
    .map(
      ([rotulo, valor]) => `
      <tr>
        <td style="padding:3px 12px 3px 0;color:${COR.suave};white-space:nowrap;vertical-align:top">${esc(rotulo)}</td>
        <td style="padding:3px 0">${esc(valor)}</td>
      </tr>`
    )
    .join("");

  return `
  <h2 style="margin:28px 0 10px;font-family:Georgia,serif;font-size:17px;font-weight:600;color:${COR.texto}">${esc(titulo)}</h2>
  <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;width:100%">${linhas}</table>`;
}

/* -------------------------------------------------------------------------
   E-mail para a dona
   ------------------------------------------------------------------------- */
function emailParaDona(registro) {
  const { referencia, pedido, cliente, entrega, pagamento, observacoes } = registro;

  const enderecoLinha = [
    `${entrega.rua}, ${entrega.numero}`,
    entrega.complemento,
    entrega.bairro,
    `${entrega.cidade} / ${entrega.estado}`,
    `CEP ${cepLegivel(entrega.cep)}`,
  ]
    .filter(Boolean)
    .join(" — ");

  const msgCliente =
    `Oi, ${cliente.nome.split(" ")[0]}! Aqui é do Begônia Ateliê. ` +
    `Recebemos seu pagamento do pedido ${referencia} e já estamos preparando tudo. ` +
    `Assim que postar, te mando o código de rastreio por aqui.`;
  const linkFalarComCliente = `https://wa.me/${cliente.whatsapp}?text=${encodeURIComponent(msgCliente)}`;

  const miolo = `
    <p style="margin:0 0 4px;font-size:15px;color:${COR.suave}">
      Pagamento aprovado. Pedido <strong style="color:${COR.texto}">${esc(referencia)}</strong>.
    </p>
    ${tabelaItens(pedido)}
    ${blocoDados("Cliente", [
      ["Nome", cliente.nome],
      ["WhatsApp", telefoneLegivel(cliente.whatsapp)],
      ["E-mail", cliente.email],
    ])}
    ${blocoDados("Entrega", [["Endereço", enderecoLinha]])}
    ${
      pagamento.metodoDivergente
        ? `<p style="margin:24px 0 0;padding:14px 16px;background:#ffdad6;border-radius:10px;font-size:14px;color:#93000a">
             <strong>Confira a forma de pagamento.</strong> No site a pessoa escolheu
             ${esc(NOME_METODO[pagamento.metodoDeclarado] || pagamento.metodoDeclarado)} e ganhou o desconto
             correspondente, mas o pagamento chegou como
             ${esc(NOME_METODO[pagamento.metodoRealizado] || pagamento.metodoRealizado)}.
           </p>`
        : ""
    }
    ${blocoDados("Pagamento", [
      ["Forma", NOME_METODO[pagamento.metodoRealizado || pagamento.metodo] || pagamento.metodo],
      ["Status", "Aprovado"],
      ["ID no Mercado Pago", pagamento.idGateway],
      ["Pago em", pagamento.pagoEm ? new Date(pagamento.pagoEm).toLocaleString("pt-BR") : ""],
    ])}
    ${
      observacoes
        ? `<h2 style="margin:28px 0 10px;font-family:Georgia,serif;font-size:17px;font-weight:600">Observações do cliente</h2>
           <p style="margin:0;padding:12px 14px;background:${COR.fundo};border-radius:10px;font-size:14px;white-space:pre-wrap">${esc(observacoes)}</p>`
        : ""
    }
    <p style="margin:28px 0 0">
      <a href="${esc(linkFalarComCliente)}"
         style="display:inline-block;padding:14px 26px;background:${COR.primaria};color:#fff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">
        Falar com ${esc(cliente.nome.split(" ")[0])} no WhatsApp
      </a>
    </p>
    <p style="margin:20px 0 0;font-size:12px;color:${COR.suave}">
      O CPF do cliente não é guardado por aqui — ele está no painel do Mercado Pago,
      no pagamento ${esc(pagamento.idGateway)}.
    </p>`;

  return {
    // Assunto sem sinal de menor/maior: cabeçalho de e-mail não é lugar de markup.
    assunto: `Pedido pago ${referencia} — ${formatarPreco(pedido.total)} — ${cliente.nome.replace(/[<>]/g, "")}`,
    html: moldura("Chegou um pedido pago", miolo),
  };
}

/* -------------------------------------------------------------------------
   Recibo para o cliente
   ------------------------------------------------------------------------- */
function emailParaCliente(registro) {
  const { referencia, pedido, cliente, entrega } = registro;

  const miolo = `
    <p style="margin:0 0 16px;font-size:15px;color:${COR.suave}">
      Oi, ${esc(cliente.nome.split(" ")[0])}. Seu pagamento foi aprovado e seu pedido
      <strong style="color:${COR.texto}">${esc(referencia)}</strong> já entrou na nossa fila.
      Assim que ele for postado, mandamos o código de rastreio no seu WhatsApp.
    </p>
    ${tabelaItens(pedido)}
    ${blocoDados("Vai para", [
      [
        "Endereço",
        `${entrega.rua}, ${entrega.numero}${entrega.complemento ? " — " + entrega.complemento : ""} — ${entrega.bairro} — ${entrega.cidade}/${entrega.estado} — CEP ${cepLegivel(entrega.cep)}`,
      ],
    ])}
    <p style="margin:28px 0 0;font-size:14px;color:${COR.suave}">
      Qualquer dúvida é só responder este e-mail ou chamar no WhatsApp
      <a href="${esc(linkWhatsApp(`Olá! É sobre o pedido ${referencia}.`))}" style="color:${COR.primaria}">${esc(telefoneLegivel(ATELIE.whatsapp))}</a>.
    </p>`;

  return {
    assunto: `Recebemos seu pagamento — pedido ${referencia}`,
    html: moldura("Pagamento confirmado", miolo),
  };
}

/* -------------------------------------------------------------------------
   Função chamada pelo webhook
   ------------------------------------------------------------------------- */
async function avisarPedidoPago(registro) {
  const paraDona = process.env.EMAIL_DONA;
  const resultados = { dona: null, cliente: null };

  if (!paraDona) {
    console.warn("[notificacao] EMAIL_DONA ausente: ninguém foi avisado do pedido %s", registro.referencia);
    resultados.dona = { enviado: false, motivo: "email-dona-ausente" };
  } else {
    const { assunto, html } = emailParaDona(registro);
    resultados.dona = await enviarEmail({
      para: paraDona,
      assunto,
      html,
      // Responder o e-mail cai direto na caixa do cliente.
      responderPara: registro.cliente.email,
    });
  }

  if (process.env.ENVIAR_RECIBO_CLIENTE !== "false") {
    const { assunto, html } = emailParaCliente(registro);
    resultados.cliente = await enviarEmail({
      para: registro.cliente.email,
      assunto,
      html,
      responderPara: paraDona || undefined,
    });
  }

  /* -----------------------------------------------------------------------
     SEGUNDA VIA POR WHATSAPP — preparada, desligada.

     O link abaixo abre a conversa do próprio ateliê com o resumo do pedido
     já escrito, reaproveitando ATELIE.whatsapp e linkWhatsApp() de dados.js.
     Ele já vai dentro do e-mail acima como botão "Falar com o cliente".

     Para ligar o aviso AUTOMÁTICO por WhatsApp é preciso um provedor que
     envie mensagem sem alguém clicar (a API oficial do WhatsApp Cloud, ou
     Twilio/Z-API). O wa.me sozinho não envia: ele só abre a conversa.
     Quando tiver o provedor, descomente e preencha as variáveis:

     const resumo = [
       `Pedido pago ${registro.referencia}`,
       ``,
       ...registro.pedido.itens.map((i) => `• ${i.quantidade}x ${i.nome} — ${formatarPreco(i.precoTotal)}`),
       ``,
       `Total: ${formatarPreco(registro.pedido.total)}`,
       `Cliente: ${registro.cliente.nome} — ${telefoneLegivel(registro.cliente.whatsapp)}`,
       `Entrega: ${registro.entrega.rua}, ${registro.entrega.numero} — ${registro.entrega.cidade}/${registro.entrega.estado}`,
     ].join("\n");

     resultados.whatsapp = { link: linkWhatsApp(resumo) };

     await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
       method: "POST",
       headers: {
         Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         messaging_product: "whatsapp",
         to: ATELIE.whatsapp,
         type: "text",
         text: { body: resumo },
       }),
     });
     ----------------------------------------------------------------------- */

  return resultados;
}

module.exports = { avisarPedidoPago, emailParaDona, emailParaCliente, enviarEmail, esc };
