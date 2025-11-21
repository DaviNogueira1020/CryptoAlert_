const { AlertsRepository } = require("../repositories/alerts.repository");

class AlertsService {
  constructor() {
    this.repo = new AlertsRepository();
  }

  async criar(data) {
    // Validar campos de entrada
    if (!data.crypto || !data.targetPrice || !data.direction) {
      throw {
        status: 400,
        message: "Campos obrigatórios ausentes: crypto, targetPrice, direction",
        code: "MISSING_FIELDS",
      };
    }

    if (!["above", "below"].includes(data.direction)) {
      throw {
        status: 400,
        message: 'Direction deve ser "above" ou "below"',
        code: "INVALID_DIRECTION",
      };
    }

    return this.repo.create(data);
  }

  async listar(userId) {
    return this.repo.findAll(userId);
  }

  async buscarPorId(id) {
    const alert = await this.repo.findById(id);
    if (!alert) {
      throw {
        status: 404,
        message: "Alerta não encontrado",
        code: "NOT_FOUND",
      };
    }
    return alert;
  }

  async atualizar(id, data) {
    await this.buscarPorId(id); // Verificar existência
    return this.repo.update(id, data);
  }

  async remover(id) {
    await this.buscarPorId(id); // Verificar existência
    return this.repo.delete(id);
  }
}

// Compatibilidade: aliases em inglês para não quebrar chamadas existentes
AlertsService.prototype.create = function (data) {
  return this.criar(data);
};
AlertsService.prototype.findAll = function (userId) {
  return this.listar(userId);
};
AlertsService.prototype.findById = function (id) {
  return this.buscarPorId(id);
};
AlertsService.prototype.update = function (id, data) {
  return this.atualizar(id, data);
};
AlertsService.prototype.delete = function (id) {
  return this.remover(id);
};

module.exports = { AlertsService };
