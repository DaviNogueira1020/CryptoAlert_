"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../lib/prisma"));
exports.default = {
    create(data) {
        return prisma_1.default.notification.create({ data });
    },
    /**
     * Lista notificações de um usuário com opções de paginação e filtros
     * options: { page, limit, unreadOnly, crypto }
     */
    async findByUser(userId, options = {}) {
        const page = options.page && options.page > 0 ? Number(options.page) : 1;
        const limit = options.limit && options.limit > 0 ? Number(options.limit) : 20;
        const skip = (page - 1) * limit;
        const where = { userId };
        if (options.unreadOnly)
            where.read = false;
        if (options.crypto)
            where.crypto = options.crypto.toUpperCase();
        const [items, total] = await Promise.all([
            prisma_1.default.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
            prisma_1.default.notification.count({ where }),
        ]);
        return { items, total, page, limit };
    },
    findById(id) {
        return prisma_1.default.notification.findUnique({ where: { id } });
    },
    markAsRead(id, userId) {
        return prisma_1.default.notification.updateMany({ where: { id, userId }, data: { read: true } });
    },
    delete(id) {
        return prisma_1.default.notification.delete({ where: { id } });
    },
    deleteManyByUser(userId) {
        return prisma_1.default.notification.deleteMany({ where: { userId } });
    },
    deleteReadByUser(userId) {
        return prisma_1.default.notification.deleteMany({ where: { userId, read: true } });
    },
    deleteOlderThan(userId, beforeDate) {
        return prisma_1.default.notification.deleteMany({ where: { userId, createdAt: { lt: beforeDate } } });
    },
    countByUser(userId, filters = {}) {
        const where = { userId };
        if (filters.unreadOnly)
            where.read = false;
        if (filters.crypto)
            where.crypto = filters.crypto.toUpperCase();
        return prisma_1.default.notification.count({ where });
    },
};
// Provide CommonJS compatibility for tests that use `require()`
// (tsc will keep ES default export; this ensures `require('./...')` returns the object)
// Note: ES module default export used above. Do not add CommonJS shims here.
//# sourceMappingURL=notifications.repository.js.map