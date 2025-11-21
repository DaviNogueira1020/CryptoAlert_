const repository = require("./alerts.repository");

module.exports = {
  async criarAlerta(userId, body) {
    const { coin, price, direction } = body;

    if (!coin || !price || !direction) throw new Error("Dados incompletos");

    // ensure userId is correct type (schema uses Int)
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;

    return repository.create({
      userId: uid,
      crypto: coin,
      targetPrice: Number(price),
      direction,
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
    if (body.coin) data.crypto = body.coin;
    if (body.price !== undefined) data.targetPrice = Number(body.price);
    if (body.direction) data.direction = body.direction;
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

    return repository.update(id, data);
  },

  async deletarAlerta(userId, id) {
    const alert = await repository.findById(id);
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (!alert || alert.userId !== uid) throw new Error("Alerta não encontrado ou não pertence ao usuário");

    return repository.delete(id);
  },
};
