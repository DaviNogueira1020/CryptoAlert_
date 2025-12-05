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
    async findAll(userId, skip = 0, limit = 10, where = {}) {
        const whereClause = { ...where };
        if (userId)
            whereClause.userId = userId;
        return prisma_1.default.alert.findMany({
            where: whereClause,
            include: { user: true },
            orderBy: { createdAt: "desc" },
            skip: skip > 0 ? skip : undefined,
            take: limit > 0 ? limit : undefined,
        });
    }
    async count(where = {}) {
        return prisma_1.default.alert.count({
            where,
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
    async findActiveAlerts() {
        return prisma_1.default.alert.findMany({
            where: { isActive: true },
            include: { user: true },
        });
    }
}
module.exports = { AlertsRepository };
//# sourceMappingURL=alerts.repository.js.map