const prisma = require("../../lib/prisma");

module.exports = {
  create(data) {
    return prisma.notification.create({ data });
  },

  /**
   * Lista notificações de um usuário com opções de paginação e filtros
   * options: { page, limit, unreadOnly, crypto }
   */
  async findByUser(userId, options = {}) {
    const page = options.page && options.page > 0 ? Number(options.page) : 1;
    const limit = options.limit && options.limit > 0 ? Number(options.limit) : 20;
    const skip = (page - 1) * limit;

    const where = { userId };
    if (options.unreadOnly) where.read = false;
    if (options.crypto) where.crypto = options.crypto.toUpperCase();

    const [items, total] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.notification.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  findById(id) {
    return prisma.notification.findUnique({ where: { id } });
  },

  markAsRead(id, userId) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  },

  delete(id) {
    return prisma.notification.delete({ where: { id } });
  },

  deleteManyByUser(userId) {
    return prisma.notification.deleteMany({ where: { userId } });
  },
  
    deleteReadByUser(userId) {
      return prisma.notification.deleteMany({ where: { userId, read: true } });
    },
  
    deleteOlderThan(userId, beforeDate) {
      return prisma.notification.deleteMany({ where: { userId, createdAt: { lt: beforeDate } } });
    },

  countByUser(userId, filters = {}) {
    const where = { userId };
    if (filters.unreadOnly) where.read = false;
    if (filters.crypto) where.crypto = filters.crypto.toUpperCase();
    return prisma.notification.count({ where });
  },
};
