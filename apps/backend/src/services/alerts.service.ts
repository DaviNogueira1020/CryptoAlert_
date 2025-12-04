export {};
const { AlertsRepository } = require("../repositories/alerts.repository");

class AlertsService {
  repo: any;
  create: any;
  findAll: any;
  findById: any;
  update: any;
  delete: any;
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
      tipo = "preco",
      precoAlvo = null,
      percentualAlta = null,
      percentualQueda = null,
      volumeMinimo = null,

      // novos campos CRUD
      titulo = null,
      descricao = null,
      prioridade = "normal",
      notificationType = "system",
      repetition = "once",
      alertDate = null,
      alertTime = null,

      // legado
      isFavorite = false,
      isActive = true,
      notifyOnce = true,
      initialPrice = null,
      notes = null,
      cooldown = null,
      scheduledAt = null,
      isScheduled = false,
      searchKey,
    } = data;

    // validações básicas
    if (!crypto || !direction) {
      throw {
        status: 400,
        message: "Campos obrigatórios ausentes: crypto, direction",
        code: "MISSING_FIELDS",
      };
    }

    if (!["above", "below", "↑", "↓"].includes(direction)) {
      throw {
        status: 400,
        message: 'Direction deve ser "above", "below", "↑" ou "↓"',
        code: "INVALID_DIRECTION",
      };
    }

    // search key automática
    const finalSearchKey =
      searchKey ??
      `${crypto} ${crypto.toUpperCase()} ${crypto.toLowerCase()}`;

    return this.repo.create({
      userId,
      crypto,
      baseCurrency,
      targetPrice,
      direction,
      tipo,
      precoAlvo,
      percentualAlta,
      percentualQueda,
      volumeMinimo,

      // novos campos
      titulo,
      descricao,
      prioridade,
      notificationType,
      repetition,
      alertDate,
      alertTime,

      // legado
      isFavorite,
      isActive,
      notifyOnce,
      initialPrice,
      notes,
      cooldown,
      scheduledAt,
      isScheduled,
      searchKey: finalSearchKey,

      // metadata
      lastTriggeredAt: null,
      triggerCount: 0,
    });
  }

  /**
   * Listar alertas com paginação e filtros
   */
  async listar(userId, page = 1, limit = 10, filters: any = {}) {
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if ((filters as any).priority) where.prioridade = (filters as any).priority;
    if ((filters as any).tipo) where.tipo = (filters as any).tipo;
    if ((filters as any).isActive !== undefined)
      where.isActive = (filters as any).isActive === "true";

    const [alertas, total] = await Promise.all([
      this.repo.findAll(userId, skip, limit, where),
      this.repo.count(where),
    ]);

    return {
      data: alertas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar por ID com verificação de ownership
   */
  async buscarPorId(id, userId) {
    const alert = await this.repo.findById(id);

    if (!alert) {
      throw {
        status: 404,
        message: "Alerta não encontrado",
        code: "NOT_FOUND",
      };
    }

    if (alert.userId !== userId) {
      throw {
        status: 403,
        message: "Acesso negado a este alerta",
        code: "FORBIDDEN",
      };
    }

    return alert;
  }

  /**
   * Atualizar com suporte a atualizações parciais
   */
  async atualizar(id, userId, data) {
    await this.buscarPorId(id, userId);

    const camposAtualizaveis = [
      "crypto",
      "baseCurrency",
      "targetPrice",
      "direction",
      "tipo",
      "precoAlvo",
      "percentualAlta",
      "percentualQueda",
      "volumeMinimo",
      "titulo",
      "descricao",
      "prioridade",
      "notificationType",
      "repetition",
      "alertDate",
      "alertTime",
      "isFavorite",
      "isActive",
      "notifyOnce",
      "initialPrice",
      "notes",
      "cooldown",
      "scheduledAt",
      "isScheduled",
    ];

    const dadosLimpos = Object.keys(data)
      .filter((key) => camposAtualizaveis.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    return this.repo.update(id, dadosLimpos);
  }

  /**
   * Remover com verificação de ownership
   */
  async remover(id, userId) {
    await this.buscarPorId(id, userId);
    return this.repo.delete(id);
  }

  /**
   * Ativar/Desativar
   */
  async ativarDesativar(id, userId) {
    const alerta = await this.buscarPorId(id, userId);
    return this.repo.update(id, { isActive: !alerta.isActive });
  }

  /**
   * Duplicar alerta
   */
  async duplicar(id, userId) {
    const alerta = await this.buscarPorId(id, userId);

    const copia = {
      ...alerta,
      id: undefined,
      titulo: `${alerta.titulo ?? alerta.crypto} (Cópia)`,
      isActive: false,
      triggerCount: 0,
      lastTriggeredAt: null,
      createdAt: undefined,
      updatedAt: undefined,
    };

    return this.repo.create(copia);
  }

  /**
   * Registrar disparo de alerta
   */
  async registrarDisparo(id) {
    const alerta = await this.repo.findById(id);
    if (alerta) {
      return this.repo.update(id, {
        triggerCount: (alerta.triggerCount ?? 0) + 1,
        lastTriggeredAt: new Date(),
      });
    }
  }

  /**
   * Exportar alertas em JSON ou CSV
   */
  async exportar(userId, formato = "json") {
    const alertas = await this.repo.findAll(userId);

    if (formato === "csv") {
      return this.alertasToCSV(alertas);
    }

    return JSON.stringify(
      {
        export_date: new Date().toISOString(),
        total: alertas.length,
        alertas,
      },
      null,
      2
    );
  }

  /**
   * Converter alertas para CSV
   */
  private alertasToCSV(alertas: any[]) {
    if (alertas.length === 0) return "No alerts to export";

    const headers = Object.keys(alertas[0]);
    const headerRow = headers.join(",");

    const dataRows = alertas
      .map((alerta) =>
        headers
          .map((header) => {
            const valor = alerta[header];
            if (valor === null || valor === undefined) return "";
            if (typeof valor === "string" && valor.includes(",")) {
              return `"${valor}"`;
            }
            return valor;
          })
          .join(",")
      )
      .join("\n");

    return `${headerRow}\n${dataRows}`;
  }

  /**
   * Formatar condição para exibição
   */
  private getCondicaoTexto(direction: string, preco: number) {
    const simbolo = direction === "above" || direction === "↑" ? "↑" : "↓";
    return `$${preco?.toLocaleString("pt-BR")} ${simbolo}`;
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
AlertsService.prototype.update = function (id: any, data: any) {
  return this.atualizar(id, undefined, data);
};
AlertsService.prototype.delete = function (id: any) {
  return (this as any).remover(id, undefined);
};

module.exports = { AlertsService };
