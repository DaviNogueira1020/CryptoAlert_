const { prisma } = require("../../config/prisma");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/generateToken");

async function register(data) {
  if (!data.email || !data.password) {
    throw new Error("Email e senha são obrigatórios");
  }

  const exists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (exists) throw new Error("Email já cadastrado");

  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
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
    token: generateToken(user.id),
  };
}

async function login(data) {
  if (!data.email || !data.password) {
    throw new Error("Email e senha são obrigatórios");
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("Credenciais inválidas");

  const valid = await comparePassword(data.password, user.password);
  if (!valid) throw new Error("Credenciais inválidas");

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token: generateToken(user.id),
  };
}

module.exports = { register, login };
