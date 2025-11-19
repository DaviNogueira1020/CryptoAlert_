const { default: prisma } = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateJwtToken } = require("../utils/jwt");

class AuthService {
  async register(data) {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) throw new Error("Email já está em uso");

    const hashed = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashed,
      },
    });

    const token = generateJwtToken(String(user.id));

    return { user, token };
  }

  async login(data) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new Error("Credenciais inválidas");

    const valid = await comparePassword(data.password, user.password);
    if (!valid) throw new Error("Credenciais inválidas");

    const token = generateJwtToken(String(user.id));

    return { user, token };
  }

  async me(userId) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) throw new Error("Usuário não encontrado");

    return user;
  }
}

module.exports = { AuthService };
