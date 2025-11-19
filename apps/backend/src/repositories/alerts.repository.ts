import { prisma } from "../lib/prisma";
import { CreateAlertDTO, UpdateAlertDTO } from "../types/AlertDTO";

export class AlertsRepository {
  async create(data: CreateAlertDTO) {
    return prisma.alert.create({
      data,
      include: { user: true },
    });
  }

  async findAll(userId?: number) {
    return prisma.alert.findMany({
      where: userId ? { userId } : undefined,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.alert.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: string, data: UpdateAlertDTO) {
    return prisma.alert.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async delete(id: string) {
    return prisma.alert.delete({
      where: { id },
    });
  }

  async findByUserIdAndCrypto(userId: number, crypto: string) {
    return prisma.alert.findMany({
      where: { userId, crypto },
    });
  }
}
