"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AlertsRepository = {
    create(data) {
        return prisma_1.default.alert.create({
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
    async findByUser(userId, options = {}) {
        const page = options.page && options.page > 0 ? Number(options.page) : 1;
        const limit = options.limit && options.limit > 0 ? Number(options.limit) : 20;
        const skip = (page - 1) * limit;
        const where = { userId };
        // optional filters could be added here (e.g., crypto, isActive)
        const [items, total] = await Promise.all([
            prisma_1.default.alert.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
            prisma_1.default.alert.count({ where }),
        ]);
        return { items, total, page, limit };
    },
    findById(id) {
        return prisma_1.default.alert.findUnique({ where: { id } });
    },
    update(id, data) {
        return prisma_1.default.alert.update({
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
        return prisma_1.default.alert.delete({ where: { id } });
    },
};
exports.default = AlertsRepository;
//# sourceMappingURL=alerts.repository.js.map