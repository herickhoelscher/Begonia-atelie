/* =========================================================================
   Begônia Ateliê — validação e limpeza dos dados do checkout.
   Nada que chega do navegador é confiável. Tudo passa por aqui antes de
   virar pedido, e-mail ou chamada ao gateway.
   ========================================================================= */

const { UFS } = require("../../src/js/dados.js");

/* Remove caracteres de controle, normaliza espaços e corta no limite.
   Serve também para não deixar ninguém injetar quebra de linha em cabeçalho
   de e-mail. */
function limpar(valor, limite = 200) {
  return String(valor == null ? "" : valor)
    .replace(/[\x00-\x1f\x7f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limite);
}

/* Igual à anterior, mas preserva quebras de linha (para observações). */
function limparTexto(valor, limite = 500) {
  return String(valor == null ? "" : valor)
    .replace(/\r/g, "")
    .replace(/[\x00-\x09\x0b-\x1f\x7f]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, limite);
}

const soDigitos = (valor) => String(valor || "").replace(/\D/g, "");

function emailValido(email) {
  // Deliberadamente simples: e-mail só é validado de verdade ao ser entregue.
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) && email.length <= 120;
}

/* WhatsApp em formato internacional só com dígitos: 55 + DDD + número. */
function normalizarWhatsApp(bruto) {
  let d = soDigitos(bruto);
  if (d.length === 10 || d.length === 11) d = "55" + d;       // veio sem o país
  if (d.length === 12 || d.length === 13) {
    return d.startsWith("55") ? d : null;
  }
  return null;
}

/* CPF com verificação dos dígitos, não só do tamanho.
   O Mercado Pago exige CPF para gerar cobrança Pix. */
function cpfValido(bruto) {
  const d = soDigitos(bruto);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;                    // 111.111.111-11 e afins
  const digito = (fatia, pesoInicial) => {
    let soma = 0;
    for (let i = 0; i < fatia.length; i++) soma += Number(fatia[i]) * (pesoInicial - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(d.slice(0, 9), 10) === Number(d[9]) && digito(d.slice(0, 10), 11) === Number(d[10]);
}

/* =========================================================================
   Cliente e entrega
   ========================================================================= */

function validarCliente(bruto, { exigirCpf }) {
  const dados = bruto && typeof bruto === "object" ? bruto : {};
  const campos = {};

  const nome = limpar(dados.nome, 80);
  if (nome.length < 3) campos.nome = "Escreva seu nome completo.";
  else if (!/\s/.test(nome)) campos.nome = "Falta o sobrenome — a transportadora precisa dele.";

  const email = limpar(dados.email, 120).toLowerCase();
  if (!emailValido(email)) campos.email = "Confira o e-mail. É por ele que o comprovante chega.";

  const whatsapp = normalizarWhatsApp(dados.whatsapp);
  if (!whatsapp) campos.whatsapp = "Informe o WhatsApp com DDD, ex.: (11) 98888-7777.";

  const cpf = soDigitos(dados.cpf);
  if (exigirCpf && !cpfValido(cpf)) campos.cpf = "CPF inválido. O Pix não é emitido sem ele.";
  else if (!exigirCpf && cpf && !cpfValido(cpf)) campos.cpf = "CPF inválido.";

  return { campos, cliente: { nome, email, whatsapp, cpf: cpf || null } };
}

function validarEntrega(bruto) {
  const dados = bruto && typeof bruto === "object" ? bruto : {};
  const campos = {};

  const cep = soDigitos(dados.cep);
  if (cep.length !== 8) campos.cep = "CEP deve ter 8 dígitos.";

  const rua = limpar(dados.rua, 120);
  if (rua.length < 3) campos.rua = "Informe a rua.";

  const numero = limpar(dados.numero, 12);
  if (!numero) campos.numero = "Informe o número, ou escreva S/N.";

  const bairro = limpar(dados.bairro, 80);
  if (bairro.length < 2) campos.bairro = "Informe o bairro.";

  const cidade = limpar(dados.cidade, 80);
  if (cidade.length < 2) campos.cidade = "Informe a cidade.";

  const estado = limpar(dados.estado, 2).toUpperCase();
  if (!UFS.includes(estado)) campos.estado = "Selecione o estado.";

  return {
    campos,
    entrega: { cep, rua, numero, complemento: limpar(dados.complemento, 80), bairro, cidade, estado },
  };
}

/* Itens: aceitamos apenas slug e quantidade. Preço NUNCA vem do navegador —
   quem decide quanto custa é o servidor, lendo dados.js. */
function validarItens(bruto, maxQuantidade) {
  const campos = {};
  if (!Array.isArray(bruto) || bruto.length === 0) {
    campos.itens = "Sua sacola está vazia.";
    return { campos, itens: [] };
  }
  if (bruto.length > 20) {
    campos.itens = "Muitas peças de uma vez. Fale com a gente pelo WhatsApp.";
    return { campos, itens: [] };
  }

  const itens = [];
  for (const linha of bruto) {
    const slug = limpar(linha && linha.slug, 60).toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      campos.itens = "Alguma peça da sacola não foi reconhecida.";
      break;
    }
    let quantidade = Number(linha && linha.quantidade);
    if (!Number.isInteger(quantidade) || quantidade < 1) quantidade = 1;
    if (quantidade > maxQuantidade) quantidade = maxQuantidade;
    itens.push({ slug, quantidade });
  }
  return { campos, itens };
}

/* "checkout" é o método usado quando o gateway não deixa escolher a forma
   de pagamento pela API — o cliente decide entre Pix e cartão na página
   dele. É o caso da InfinitePay. */
function metodoValido(metodo) {
  return ["pix", "cartao", "debito", "checkout"].includes(metodo);
}

module.exports = {
  limpar, limparTexto, soDigitos, emailValido, normalizarWhatsApp, cpfValido,
  validarCliente, validarEntrega, validarItens, metodoValido,
};
