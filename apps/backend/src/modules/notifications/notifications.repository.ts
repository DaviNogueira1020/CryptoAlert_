const prisma = require("../../lib/prisma");

module.exports = {
  create(data) {
    return prisma.notification.create({ data });
  },

  findByUser(userId) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
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
};
