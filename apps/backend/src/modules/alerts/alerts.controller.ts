const service = require("./alerts.service");

module.exports = {
  async create(req, res) {
    try {
      const alert = await service.createAlert(req.user.id, req.body);
      res.status(201).json(alert);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const alerts = await service.listAlerts(req.user.id);
      res.json(alerts);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const alert = await service.updateAlert(req.user.id, req.params.id, req.body);
      res.json(alert);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await service.deleteAlert(req.user.id, req.params.id);
      res.json({ message: "Alerta removido" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
