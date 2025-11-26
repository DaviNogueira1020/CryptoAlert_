"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class AlertsRepository {
    async create(data) {
        return prisma_1.default.alert.create({
            data,
            include: { user: true },
        });
    }
    async findAll(userId) {
        return prisma_1.default.alert.findMany({
            where: userId ? { userId } : undefined,
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(id) {
        return prisma_1.default.alert.findUnique({
            where: { id },
            include: { user: true },
        });
    }
    async update(id, data) {
        return prisma_1.default.alert.update({
            where: { id },
            data,
            include: { user: true },
        });
    }
    async delete(id) {
        return prisma_1.default.alert.delete({
            where: { id },
        });
    }
    async findByUserIdAndCrypto(userId, crypto) {
        return prisma_1.default.alert.findMany({
            where: { userId, crypto },
        });
    }
}
module.exports = { AlertsRepository };
//# sourceMappingURL=alerts.repository.js.map