const { AlertsRepository } = require("../repositories/alerts.repository");

class AlertsService {
  constructor() {
    this.repo = new AlertsRepository();
  }

  /**
   * Criar Alerta
   */
  async criar(data) {
    const {
      userId,
      crypto,
      baseCurrency = "USDT",
      targetPrice,
      direction,

      // novos campos
      isFavorite = false,
      isActive = true,
      notifyOnce = true,
      initialPrice = null,
      title = null,
      notes = null,
      cooldown = null,
      scheduledAt = null,
      isScheduled = false,
      searchKey,
    } = data;

    // validações básicas
    if (!crypto || !targetPrice || !direction) {
      throw {
        status: 400,
        message: "Campos obrigatórios ausentes: crypto, targetPrice, direction",
        code: "MISSING_FIELDS",
      };
    }

    if (!["above", "below"].includes(direction)) {
      throw {
        status: 400,
        message: 'Direction deve ser "above" ou "below"',
        code: "INVALID_DIRECTION",
      };
    }

    // search key automática caso não venha nada
    const finalSearchKey =
      searchKey ??
      `${crypto} ${crypto.toUpperCase()} ${crypto.toLowerCase()}`;

    return this.repo.create({
      userId,
      crypto,
      baseCurrency,
      targetPrice,
      direction,

      // novos campos
      isFavorite,
      isActive,
      notifyOnce,
      initialPrice,
      title,
      notes,
      cooldown,
      scheduledAt,
      isScheduled,
      searchKey: finalSearchKey,

      // metadata
      lastTriggeredAt: null,
    });
  }

  /**
   * Listar alertas
   */
  async listar(userId) {
    return this.repo.findAll(userId);
  }

  /**
   * Buscar por ID
   */
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

  /**
   * Atualizar
   */
  async atualizar(id, data) {
    await this.buscarPorId(id); // verifica existência
    return this.repo.update(id, data);
  }

  /**
   * Remover
   */
  async remover(id) {
    await this.buscarPorId(id); // verifica existência
    return this.repo.delete(id);
  }
}

// aliases legados (não quebrar o front)
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
