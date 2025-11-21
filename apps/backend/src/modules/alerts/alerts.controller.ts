const service = require("./alerts.service");

module.exports = {
  async criar(req, res) {
    try {
      const alert = await service.criarAlerta(req.userId, req.body);
      res.status(201).json(alert);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listar(req, res) {
    try {
      const alerts = await service.listarAlertas(req.userId);
      res.json(alerts);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async atualizar(req, res) {
    try {
      const alert = await service.atualizarAlerta(req.userId, req.params.id, req.body);
      res.json(alert);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remover(req, res) {
    try {
      await service.deletarAlerta(req.userId, req.params.id);
      res.json({ message: "Alerta removido" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
