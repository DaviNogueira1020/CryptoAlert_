export {};
const service = require("./notification.service");
const { sendSuccess, sendError } = require("../../utils/response");

// Criar notificação
async function criar(req, res) {
  try {
    const body = arguments[2] ?? req.body;
    const result = await service.criar(req.userId, body);
    return sendSuccess(res, result, 201);
  } catch (error: any) {
    return sendError(res, "INTERNAL_ERROR", error.message);
  }
}

// Listar notificações do usuário
async function listar(req, res) {
  try {
    const options = arguments[2] ?? {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      unreadOnly: req.query.unread === "true",
      crypto: req.query.crypto,
    };

    const result = await service.listar(req.userId, options);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, "INTERNAL_ERROR", error.message);
  }
}

// Remover notificação
async function remover(req, res) {
  try {
    const params = arguments[2] ?? req.params;
    await service.remover(req.userId, params.id);
    return sendSuccess(res, { message: "Notificação removida com sucesso." });
  } catch (error: any) {
    return sendError(res, "INTERNAL_ERROR", error.message);
  }
}

// Marcar notificação como lida
async function marcarComoLida(req, res) {
  try {
    const params = arguments[2] ?? req.params;
    await service.marcarComoLida(req.userId, params.id);
    return sendSuccess(res, { message: "Notificação marcada como lida." });
  } catch (error: any) {
    return sendError(res, "INTERNAL_ERROR", error.message);
  }
}

// Apagar todas notificações do usuário
async function apagarTodas(req, res) {
  try {
    await service.removerTodas(req.userId);
    return sendSuccess(res, { message: "Todas notificações removidas." });
  } catch (error: any) {
    return sendError(res, "INTERNAL_ERROR", error.message);
  }
}

async function removerLidas(req, res) {
  try {
    await service.removerLidas(req.userId);
    return sendSuccess(res, { message: "Notificações lidas removidas." });
  } catch (error: any) {
    return sendError(res, "INTERNAL_ERROR", error.message);
  }
}

async function removerAntigas(req, res) {
  try {
    const days = arguments[2] ? Number(arguments[2].days) : req.query.days ? Number(req.query.days) : 30;
    await service.removerAntigas(req.userId, days);
    return sendSuccess(res, { message: `Notificações anteriores a ${days} dias removidas.` });
  } catch (error: any) {
    return sendError(res, "INTERNAL_ERROR", error.message);
  }
}

module.exports = { criar, listar, remover, marcarComoLida, apagarTodas };

