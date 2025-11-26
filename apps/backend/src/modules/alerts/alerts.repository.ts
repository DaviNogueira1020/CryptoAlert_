import prismaClient from "../../lib/prisma";

const AlertsRepository = {
  create(data: any) {
    return prismaClient.alert.create({
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

  async findByUser(userId: number, options: any = {}) {
    const page = options.page && options.page > 0 ? Number(options.page) : 1;
    const limit = options.limit && options.limit > 0 ? Number(options.limit) : 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    // optional filters could be added here (e.g., crypto, isActive)

    const [items, total] = await Promise.all([
      prismaClient.alert.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prismaClient.alert.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  findById(id: string) {
    return prismaClient.alert.findUnique({ where: { id } });
  },

  update(id: string, data: any) {
    return prismaClient.alert.update({
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

  delete(id: string) {
    return prismaClient.alert.delete({ where: { id } });
  },
};

export default AlertsRepository;
