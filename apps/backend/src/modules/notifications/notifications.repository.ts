import prisma from "../../lib/prisma";

export default {
  create(data: any) {
    return prisma.notification.create({ data });
  },

  /**
   * Lista notificações de um usuário com opções de paginação e filtros
   * options: { page, limit, unreadOnly, crypto }
   */
  async findByUser(userId: number, options: any = {}) {
    const page = options.page && options.page > 0 ? Number(options.page) : 1;
    const limit = options.limit && options.limit > 0 ? Number(options.limit) : 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (options.unreadOnly) where.read = false;
    if (options.crypto) where.crypto = options.crypto.toUpperCase();

    const [items, total] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.notification.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  },

  markAsRead(id: string, userId: number) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { read: true } });
  },

  delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  },

  deleteManyByUser(userId: number) {
    return prisma.notification.deleteMany({ where: { userId } });
  },

  deleteReadByUser(userId: number) {
    return prisma.notification.deleteMany({ where: { userId, read: true } });
  },

  deleteOlderThan(userId: number, beforeDate: Date) {
    return prisma.notification.deleteMany({ where: { userId, createdAt: { lt: beforeDate } } });
  },

  countByUser(userId: number, filters: any = {}) {
    const where: any = { userId };
    if (filters.unreadOnly) where.read = false;
    if (filters.crypto) where.crypto = filters.crypto.toUpperCase();
    return prisma.notification.count({ where });
  },
};

// Provide CommonJS compatibility for tests that use `require()`
// (tsc will keep ES default export; this ensures `require('./...')` returns the object)
// Note: ES module default export used above. Do not add CommonJS shims here.
