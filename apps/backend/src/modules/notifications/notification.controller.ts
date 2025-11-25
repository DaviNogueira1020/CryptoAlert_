const service = require("./notification.service");

// Criar notificação
async function criar(req, res) {
  try {
    const result = await service.criar(req.userId, req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// Listar notificações do usuário
async function listar(req, res) {
  try {
    const options = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      unreadOnly: req.query.unread === "true",
      crypto: req.query.crypto,
    };

    const result = await service.listar(req.userId, options);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// Remover notificação
async function remover(req, res) {
  try {
    await service.remover(req.userId, req.params.id);
    return res.json({ success: true, data: { message: "Notificação removida com sucesso." } });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// Marcar notificação como lida
async function marcarComoLida(req, res) {
  try {
    await service.marcarComoLida(req.userId, req.params.id);
    return res.json({ success: true, data: { message: "Notificação marcada como lida." } });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// Apagar todas notificações do usuário
async function apagarTodas(req, res) {
  try {
    await service.removerTodas(req.userId);
    return res.json({ success: true, data: { message: "Todas notificações removidas." } });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

async function removerLidas(req, res) {
  try {
    await service.removerLidas(req.userId);
    return res.json({ success: true, data: { message: "Notificações lidas removidas." } });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

async function removerAntigas(req, res) {
  try {
    const days = req.query.days ? Number(req.query.days) : 30;
    await service.removerAntigas(req.userId, days);
    return res.json({ success: true, data: { message: `Notificações anteriores a ${days} dias removidas.` } });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = { criar, listar, remover, marcarComoLida, apagarTodas };

