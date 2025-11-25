const prisma = require("../../lib/prisma");

module.exports = {
  create(data) {
    return prisma.alert.create({
      data: {
        userId: data.userId,

        crypto: data.crypto,
        baseCurrency: data.baseCurrency ?? null,

        targetPrice: data.targetPrice,
        direction: data.direction,

        isActive: data.isActive ?? true,
        isFavorite: data.isFavorite ?? false,
        notifyOnce: data.notifyOnce ?? false,

        initialPrice: data.initialPrice ?? null,
        lastTriggeredAt: data.lastTriggeredAt ?? null,

        title: data.title ?? null,
        notes: data.notes ?? null,

        cooldown: data.cooldown ?? null,
      },
    });
  },

  findByUser(userId) {
    return prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  },

  findById(id) {
    return prisma.alert.findUnique({
      where: { id },
    });
  },

  update(id, data) {
    return prisma.alert.update({
      where: { id },
      data: {
        crypto: data.crypto,
        baseCurrency: data.baseCurrency,
        targetPrice: data.targetPrice,
        direction: data.direction,

        isActive: data.isActive,
        isFavorite: data.isFavorite,
        notifyOnce: data.notifyOnce,

        initialPrice: data.initialPrice,
        lastTriggeredAt: data.lastTriggeredAt,

        title: data.title,
        notes: data.notes,

        cooldown: data.cooldown,
      },
    });
  },

  delete(id) {
    return prisma.alert.delete({
      where: { id },
    });
  },
};
