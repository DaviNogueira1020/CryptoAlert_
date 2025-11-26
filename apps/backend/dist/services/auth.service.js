"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
class AuthService {
    async register(data) {
        const userExists = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (userExists)
            throw new Error("Email já está em uso");
        const hashed = await (0, hash_1.hashSenha)(data.password);
        const user = await prisma_1.default.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashed,
            },
        });
        const token = (0, jwt_1.gerarTokenJwt)(String(user.id));
        return { user, token };
    }
    async login(data) {
        const user = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user)
            throw new Error("Credenciais inválidas");
        const valid = await (0, hash_1.compararSenha)(data.password, user.password);
        if (!valid)
            throw new Error("Credenciais inválidas");
        const token = (0, jwt_1.gerarTokenJwt)(String(user.id));
        return { user, token };
    }
    async me(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: parseInt(userId) },
        });
        if (!user)
            throw new Error("Usuário não encontrado");
        return user;
    }
    async logout(userId) {
        // JWT é stateless neste projeto; logout é tratado no cliente removendo o token.
        // Aqui apenas retornamos confirmação. Se implementar blacklist, persistir aqui.
        return { success: true };
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map