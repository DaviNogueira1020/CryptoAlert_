import prisma from "../lib/prisma";
import { hashSenha, compararSenha } from "../utils/hash";
import { gerarTokenJwt } from "../utils/jwt";

export default class AuthService {
  async register(data) {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) throw new Error("Email já está em uso");

    const hashed = await hashSenha(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashed,
      },
    });

    const token = gerarTokenJwt(String(user.id));

    return { user, token };
  }

  async login(data) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new Error("Credenciais inválidas");

    const valid = await compararSenha(data.password, user.password);
    if (!valid) throw new Error("Credenciais inválidas");

    const token = gerarTokenJwt(String(user.id));

    return { user, token };
  }

  async me(userId) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) throw new Error("Usuário não encontrado");

    return user;
  }

  async logout(userId) {
    // JWT é stateless neste projeto; logout é tratado no cliente removendo o token.
    // Aqui apenas retornamos confirmação. Se implementar blacklist, persistir aqui.
    return { success: true };
  }
}

