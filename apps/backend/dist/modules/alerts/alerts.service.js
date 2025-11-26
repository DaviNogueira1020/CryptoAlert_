"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alerts_repository_1 = __importDefault(require("./alerts.repository"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const repository = alerts_repository_1.default;
exports.default = {
    async criarAlerta(userId, body) {
        // Accept both legacy keys (coin, price) and new keys (crypto, targetPrice)
        const { coin, price, crypto, direction, baseCurrency, isFavorite, notifyOnce, cooldown, title, notes, } = body;
        const resolvedCoin = coin ?? crypto;
        const resolvedPrice = price !== undefined ? price : body.targetPrice;
        if (!resolvedCoin || resolvedPrice === undefined || !direction)
            throw new Error("Dados incompletos: coin/crypto, price/targetPrice e direction são obrigatórios");
        if (!["above", "below"].includes(direction))
            throw new Error("direction inválido");
        const targetPrice = Number(resolvedPrice);
        if (Number.isNaN(targetPrice) || targetPrice <= 0)
            throw new Error("price inválido");
        if (baseCurrency && typeof baseCurrency !== "string")
            throw new Error("baseCurrency inválido");
        if (cooldown !== undefined) {
            const cd = Number(cooldown);
            if (!Number.isInteger(cd) || cd < 0)
                throw new Error("cooldown deve ser inteiro >= 0 (segundos)");
        }
        const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
        // Prefer repository create
        if (repository && typeof repository.create === "function") {
            return repository.create({
                userId: uid,
                crypto: String(resolvedCoin).toUpperCase(),
                baseCurrency: baseCurrency ? String(baseCurrency).toUpperCase() : null,
                targetPrice: targetPrice,
                direction,
                isFavorite: Boolean(isFavorite ?? false),
                notifyOnce: Boolean(notifyOnce ?? false),
                cooldown: cooldown !== undefined ? Number(cooldown) : null,
                title: title ?? null,
                notes: notes ?? null,
            });
        }
        // fallback to direct Prisma if repository missing
        return prisma_1.default.alert.create({
            data: {
                userId: uid,
                crypto: String(resolvedCoin).toUpperCase(),
                baseCurrency: baseCurrency ? String(baseCurrency).toUpperCase() : null,
                targetPrice: targetPrice,
                direction,
                isActive: true,
                isFavorite: Boolean(isFavorite ?? false),
                notifyOnce: Boolean(notifyOnce ?? false),
                initialPrice: null,
                lastTriggeredAt: null,
                title: title ?? null,
                notes: notes ?? null,
                cooldown: cooldown !== undefined ? Number(cooldown) : null,
            },
        });
    },
    async listarAlertas(userId, options = {}) {
        const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
        return repository.findByUser(uid, options);
    },
    async atualizarAlerta(userId, id, body) {
        const alert = await repository.findById(id);
        const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
        if (!alert || alert.userId !== uid)
            throw new Error("Alerta não encontrado ou não pertence ao usuário");
        const data = {};
        if (body.coin)
            data.crypto = String(body.coin).toUpperCase();
        if (body.price !== undefined) {
            const tp = Number(body.price);
            if (Number.isNaN(tp) || tp <= 0)
                throw new Error("price inválido");
            data.targetPrice = tp;
        }
        if (body.direction) {
            if (!["above", "below"].includes(body.direction))
                throw new Error("direction inválido");
            data.direction = body.direction;
        }
        if (body.isActive !== undefined)
            data.isActive = Boolean(body.isActive);
        if (body.baseCurrency !== undefined)
            data.baseCurrency = body.baseCurrency ? String(body.baseCurrency).toUpperCase() : null;
        if (body.isFavorite !== undefined)
            data.isFavorite = Boolean(body.isFavorite);
        if (body.notifyOnce !== undefined)
            data.notifyOnce = Boolean(body.notifyOnce);
        if (body.cooldown !== undefined) {
            const cd = Number(body.cooldown);
            if (!Number.isInteger(cd) || cd < 0)
                throw new Error("cooldown deve ser inteiro >= 0 (segundos)");
            data.cooldown = cd;
        }
        if (body.title !== undefined)
            data.title = body.title;
        if (body.notes !== undefined)
            data.notes = body.notes;
        return repository.update(id, data);
    },
    async deletarAlerta(userId, id) {
        const alert = await repository.findById(id);
        const uid = typeof userId === "string" ? parseInt(userId, 10) : userId;
        if (!alert || alert.userId !== uid)
            throw new Error("Alerta não encontrado ou não pertence ao usuário");
        return repository.delete(id);
    },
};
//# sourceMappingURL=alerts.service.js.map