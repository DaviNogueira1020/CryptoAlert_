const { AlertsService } = require("../services/alerts.service");

const service = new AlertsService();

class AlertsController {
  async criar(req, res) {
    try {
      const { userId, crypto, targetPrice, direction } = req.body;

      const newAlert = await service.criar({
        userId: Number(userId),
        crypto,
        targetPrice: Number(targetPrice),
        direction,
      });

      return res.status(201).json(newAlert);
    } catch (err) {
      return res.status(err.status || 500).json({
        error: err.message || "Erro interno do servidor",
        code: err.code || "INTERNAL_ERROR",
      });
    }
  }

  async listar(req, res) {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const alerts = await service.listar(userId);
      return res.json(alerts);
    } catch (err) {
      return res.status(500).json({ error: "Falha ao buscar alertas" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const alert = await service.buscarPorId(req.params.id);
      return res.json(alert);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async atualizar(req, res) {
    try {
      const updated = await service.atualizar(req.params.id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async remover(req, res) {
    try {
      const deleted = await service.remover(req.params.id);
      return res.json({ message: "Alerta removido com sucesso", data: deleted });
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
}

// Compatibilidade: aliases legados para a API existente
AlertsController.prototype.create = function (req, res) {
  return this.criar(req, res);
};
AlertsController.prototype.findAll = function (req, res) {
  return this.listar(req, res);
};
AlertsController.prototype.findById = function (req, res) {
  return this.buscarPorId(req, res);
};
AlertsController.prototype.update = function (req, res) {
  return this.atualizar(req, res);
};
AlertsController.prototype.delete = function (req, res) {
  return this.remover(req, res);
};

module.exports = { AlertsController };
