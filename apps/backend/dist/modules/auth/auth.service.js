"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../lib/prisma"));
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
async function register(data) {
    if (!data.email || !data.password) {
        throw new Error("Email e senha são obrigatórios");
    }
    const exists = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (exists)
        throw new Error("Email já cadastrado");
    const hashed = await (0, hash_1.hashSenha)(data.password);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name || null,
            email: data.email,
            password: hashed,
        },
    });
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        token: (0, jwt_1.gerarTokenJwt)(String(user.id)),
    };
}
async function login(data) {
    if (!data.email || !data.password) {
        throw new Error("Email e senha são obrigatórios");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user)
        throw new Error("Credenciais inválidas");
    const valid = await (0, hash_1.compararSenha)(data.password, user.password);
    if (!valid)
        throw new Error("Credenciais inválidas");
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        token: (0, jwt_1.gerarTokenJwt)(String(user.id)),
    };
}
module.exports = { register, login };
//# sourceMappingURL=auth.service.js.map