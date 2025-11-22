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
    const result = await service.listar(req.userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// Remover notificação
async function remover(req, res) {
  try {
    await service.remover(req.userId, req.params.id);
    return res.json({ message: "Notificação removida com sucesso." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { criar, listar, remover };
