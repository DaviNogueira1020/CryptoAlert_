import prisma from "../lib/prisma";

class AlertsRepository {
  async create(data) {
    return prisma.alert.create({
      data,
      include: { user: true },
    });
  }

  async findAll(userId) {
    return prisma.alert.findMany({
      where: userId ? { userId } : undefined,
      include: { user: true },
      orderBy: { createdAt: "desc" },
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
}

module.exports = { AlertsRepository };
