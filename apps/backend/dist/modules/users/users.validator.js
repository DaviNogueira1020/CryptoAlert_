"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { z } = require("zod");
const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});
const updateUserSchema = createUserSchema.partial();
// Query params for listing users
const listUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});
const idParamSchema = z.object({ id: z.coerce.number().int().positive() });
module.exports = { createUserSchema, updateUserSchema };
//# sourceMappingURL=users.validator.js.map