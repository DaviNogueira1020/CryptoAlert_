const repository = require("./alerts.repository");

module.exports = {
  async criarAlerta(userId, body) {
    const {
      coin,
      price,
      direction,
      baseCurrency,
      isFavorite,
      notifyOnce,
      cooldown,
      title,
      notes,
    } = body;

    if (!coin || price === undefined || !direction) throw new Error("Dados incompletos: coin, price e direction são obrigatórios");

    if (!["above", "below"].includes(direction)) throw new Error("direction inválido");

    const targetPrice = Number(price);
    if (Number.isNaN(targetPrice) || targetPrice <= 0) throw new Error("price inválido");

    if (baseCurrency && typeof baseCurrency !== "string") throw new Error("baseCurrency inválido");

    if (cooldown !== undefined) {
      const cd = Number(cooldown);
      if (!Number.isInteger(cd) || cd < 0) throw new Error("cooldown deve ser inteiro >= 0 (segundos)");
    }

    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;

    return repository.create({
      userId: uid,
      crypto: String(coin).toUpperCase(),
      baseCurrency: baseCurrency ? String(baseCurrency).toUpperCase() : null,
      targetPrice: targetPrice,
      direction,
      isFavorite: Boolean(isFavorite ?? false),
      notifyOnce: Boolean(notifyOnce ?? false),
      cooldown: cooldown !== undefined ? Number(cooldown) : null,
      title: title ?? null,
      notes: notes ?? null,
    });
  },

  async listarAlertas(userId) {
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
    return repository.findByUser(uid);
  },

  async atualizarAlerta(userId, id, body) {
    const alert = await repository.findById(id);
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (!alert || alert.userId !== uid) throw new Error("Alerta não encontrado ou não pertence ao usuário");

    const data = {};
    if (body.coin) data.crypto = String(body.coin).toUpperCase();
    if (body.price !== undefined) {
      const tp = Number(body.price);
      if (Number.isNaN(tp) || tp <= 0) throw new Error("price inválido");
      data.targetPrice = tp;
    }
    if (body.direction) {
      if (!["above", "below"].includes(body.direction)) throw new Error("direction inválido");
      data.direction = body.direction;
    }
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    if (body.baseCurrency !== undefined) data.baseCurrency = body.baseCurrency ? String(body.baseCurrency).toUpperCase() : null;
    if (body.isFavorite !== undefined) data.isFavorite = Boolean(body.isFavorite);
    if (body.notifyOnce !== undefined) data.notifyOnce = Boolean(body.notifyOnce);
    if (body.cooldown !== undefined) {
      const cd = Number(body.cooldown);
      if (!Number.isInteger(cd) || cd < 0) throw new Error("cooldown deve ser inteiro >= 0 (segundos)");
      data.cooldown = cd;
    }
    if (body.title !== undefined) data.title = body.title;
    if (body.notes !== undefined) data.notes = body.notes;

    return repository.update(id, data);
  },

  async deletarAlerta(userId, id) {
    const alert = await repository.findById(id);
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (!alert || alert.userId !== uid) throw new Error("Alerta não encontrado ou não pertence ao usuário");

    return repository.delete(id);
  },
};
