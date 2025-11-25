const repository = require("./notifications.repository");

module.exports = {
  async criar(userId, data) {
    if (!data.crypto || !data.target || !data.direction) {
      throw new Error("crypto, target e direction são obrigatórios");
    }

    if (!["above", "below"].includes(data.direction)) {
      throw new Error("direction deve ser 'above' ou 'below'");
    }

    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;

    return repository.create({
      userId: uid,
      crypto: data.crypto.toUpperCase(),
      target: parseFloat(data.target),
      direction: data.direction,
    });
  },

  async listar(userId) {
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
    // accept optional options object as second param (pagination/filters)
    const options = arguments[1] || {};
    return repository.findByUser(uid, options);
  },

  async remover(userId, id) {
    const notification = await repository.findById(id);
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (!notification) throw new Error("Notificação não encontrada");
    if (notification.userId !== uid) throw new Error("Acesso negado");

    return repository.delete(id);
  },

  async marcarComoLida(userId, id) {
    const notification = await repository.findById(id);
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (!notification) throw new Error("Notificação não encontrada");
    if (notification.userId !== uid) throw new Error("Acesso negado");

    return repository.markAsRead(id, uid);
  },

  async removerTodas(userId) {
    const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
    return repository.deleteManyByUser(uid);
  },
};
