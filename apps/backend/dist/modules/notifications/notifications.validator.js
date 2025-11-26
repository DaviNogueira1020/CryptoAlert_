"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { z } = require("zod");
const createNotificationSchema = z.object({
    userId: z.number().optional(),
    crypto: z.string(),
    target: z.number(),
    direction: z.enum(["above", "below"]),
    title: z.string().optional(),
    message: z.string().optional(),
    type: z.enum(["system", "alert", "security", "info"]).optional(),
});
module.exports = { createNotificationSchema };
//# sourceMappingURL=notifications.validator.js.map