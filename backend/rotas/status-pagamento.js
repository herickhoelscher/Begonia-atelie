/* =========================================================================
   GET /api/status-pagamento?ref=BA-XXXXXXXX

   Usado pela tela do Pix, que pergunta de tempos em tempos se o pagamento
   caiu, e pela volta do cartão vinda do Mercado Pago.

   Devolve só o que a tela precisa mostrar: status, valor e nomes das peças.
   Endereço, e-mail e telefone NÃO saem por aqui — a referência sozinha não
   pode virar uma janela para os dados de quem comprou.
   ========================================================================= */

const { rota, json, erro, ipDoPedido } = require("../lib/http.js");
const { gateway } = require("../lib/gateway.js");
const armazenamento = require("../lib/armazenamento.js");

module.exports = rota(["GET"], async (req, res) => {
  const url = new URL(req.url, "http://interno");
  const referencia = String(url.searchParams.get("ref") || "").trim().toUpperCase();

  if (!/^BA-[A-Z2-9]{8}$/.test(referencia)) {
    return erro(res, 400, "Referência de pedido inválida.");
  }

  // O polling do Pix bate aqui a cada poucos segundos: o limite é generoso,
  // mas existe para não virar porta de força bruta em cima das referências.
  const liberado = await armazenamento.dentroDoLimite(`status:${ipDoPedido(req)}`, 120, 600);
  if (!liberado) return erro(res, 429, "Muitas consultas seguidas. Espere um pouco.");

  const registro = await armazenamento.lerPedido(referencia);
  if (!registro) {
    return erro(res, 404, "Pedido não encontrado. Se você acabou de pagar, aguarde alguns segundos.");
  }

  let status = registro.status;

  // Se ainda está pendente, pergunta ao gateway em vez de esperar o webhook.
  // Assim a tela do cliente atualiza mesmo que o webhook demore.
  if (status === "pendente" && registro.pagamento && registro.pagamento.idGateway) {
    try {
      const g = gateway();
      const atual = await g.consultarPagamento(registro.pagamento.idGateway);
      if (atual.status !== status) {
        status = atual.status;
        await armazenamento.atualizarPedido(referencia, {
          status,
          pagamento: { ...registro.pagamento, pagoEm: atual.pagoEm },
        });
      }
    } catch (e) {
      // Consulta falhou: devolvemos o último status conhecido em vez de erro.
      console.error("[status-pagamento] consulta ao gateway falhou (%s):", referencia, e.message);
    }
  }

  json(res, 200, {
    ok: true,
    referencia,
    status, // pendente | aprovado | recusado | falhou
    metodo: registro.pagamento ? registro.pagamento.metodo : null,
    total: registro.pedido ? registro.pedido.total : null,
    frete: registro.pedido ? registro.pedido.frete : null,
    subtotal: registro.pedido ? registro.pedido.subtotal : null,
    itens: registro.pedido
      ? registro.pedido.itens.map((i) => ({ nome: i.nome, quantidade: i.quantidade, precoTotal: i.precoTotal }))
      : [],
    // Primeiro nome só para a tela dizer "Obrigada, Ana" sem expor o resto.
    primeiroNome: registro.cliente ? String(registro.cliente.nome).split(" ")[0] : null,
  });
});
