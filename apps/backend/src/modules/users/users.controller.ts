const service = require("./users.service");

module.exports = {
  async criar(req, res) {
    try {
      const user = await service.criar(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
    }
  },

  async listar(req, res) {
    const users = await service.listar();
    res.json({ success: true, data: users });
  },

  async obter(req, res) {
    const user = await service.obter(parseInt(req.params.id, 10));
    if (!user) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Usuário não encontrado" } });
    res.json({ success: true, data: user });
  },

  async atualizar(req, res) {
    try {
      const updated = await service.atualizar(parseInt(req.params.id, 10), req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
    }
  },

  async remover(req, res) {
    try {
      await service.remover(parseInt(req.params.id, 10));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: err.message } });
    }
  },
};
