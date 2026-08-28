import { onRequest as __api_config_js_onRequest } from "C:\\Users\\heric\\OneDrive\\Desktop\\Projetos\\Begonia Atelie\\functions\\api\\config.js"
import { onRequest as __api_criar_pagamento_js_onRequest } from "C:\\Users\\heric\\OneDrive\\Desktop\\Projetos\\Begonia Atelie\\functions\\api\\criar-pagamento.js"
import { onRequest as __api_orcamento_js_onRequest } from "C:\\Users\\heric\\OneDrive\\Desktop\\Projetos\\Begonia Atelie\\functions\\api\\orcamento.js"
import { onRequest as __api_simulado_pagar_js_onRequest } from "C:\\Users\\heric\\OneDrive\\Desktop\\Projetos\\Begonia Atelie\\functions\\api\\simulado-pagar.js"
import { onRequest as __api_status_pagamento_js_onRequest } from "C:\\Users\\heric\\OneDrive\\Desktop\\Projetos\\Begonia Atelie\\functions\\api\\status-pagamento.js"
import { onRequest as __api_webhook_js_onRequest } from "C:\\Users\\heric\\OneDrive\\Desktop\\Projetos\\Begonia Atelie\\functions\\api\\webhook.js"

export const routes = [
    {
      routePath: "/api/config",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_config_js_onRequest],
    },
  {
      routePath: "/api/criar-pagamento",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_criar_pagamento_js_onRequest],
    },
  {
      routePath: "/api/orcamento",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_orcamento_js_onRequest],
    },
  {
      routePath: "/api/simulado-pagar",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_simulado_pagar_js_onRequest],
    },
  {
      routePath: "/api/status-pagamento",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_status_pagamento_js_onRequest],
    },
  {
      routePath: "/api/webhook",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_webhook_js_onRequest],
    },
  ]