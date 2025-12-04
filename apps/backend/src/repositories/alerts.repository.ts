import prisma from "../lib/prisma";

class AlertsRepository {
  async create(data) {
    return prisma.alert.create({
      data,
      include: { user: true },
    });
  }

  async findAll(userId, skip = 0, limit = 10, where: any = {}) {
    const whereClause: any = { ...where };
    if (userId) whereClause.userId = userId;

    return prisma.alert.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip: skip > 0 ? skip : undefined,
      take: limit > 0 ? limit : undefined,
    });
  }

  async count(where = {}) {
    return prisma.alert.count({
      where,
    });
  }

  async findById(id) {
    return prisma.alert.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id, data) {
    return prisma.alert.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async delete(id) {
    return prisma.alert.delete({
      where: { id },
    });
  }

  async findByUserIdAndCrypto(userId, crypto) {
    return prisma.alert.findMany({
      where: { userId, crypto },
    });
  }

  async findActiveAlerts() {
    return prisma.alert.findMany({
      where: { isActive: true },
      include: { user: true },
    });
  }
}

module.exports = { AlertsRepository };
