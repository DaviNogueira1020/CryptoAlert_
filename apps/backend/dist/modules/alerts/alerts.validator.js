"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.listAlertsQuerySchema = exports.updateAlertSchema = exports.createAlertSchema = void 0;
const zod_1 = require("zod");
const createAlertBase = zod_1.z.object({
    // Accept both legacy keys (coin, price) and new keys (crypto, targetPrice)
    crypto: zod_1.z.string().min(1).optional(),
    coin: zod_1.z.string().min(1).optional(),
    baseCurrency: zod_1.z.string().optional(),
    targetPrice: zod_1.z.number().optional(),
    price: zod_1.z.number().optional(),
    direction: zod_1.z.enum(["above", "below"]),
    isActive: zod_1.z.boolean().optional(),
    isFavorite: zod_1.z.boolean().optional(),
    notifyOnce: zod_1.z.boolean().optional(),
    initialPrice: zod_1.z.number().optional(),
    lastTriggeredAt: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    cooldown: zod_1.z.number().optional(),
    cooldownMinutes: zod_1.z.number().optional(),
});
exports.createAlertSchema = createAlertBase.refine((d) => (d.crypto || d.coin) && (d.targetPrice !== undefined || d.price !== undefined), {
    message: "É necessário informar coin/crypto e price/targetPrice",
});
exports.updateAlertSchema = createAlertBase.partial();
// Lista: query params para paginação e include
exports.listAlertsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    includeUser: zod_1.z.string().optional(),
});
exports.idParamSchema = zod_1.z.object({ id: zod_1.z.coerce.number().int().positive() });
//# sourceMappingURL=alerts.validator.js.map