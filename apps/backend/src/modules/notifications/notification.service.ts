const prisma = require("../../lib/prisma");

async function create(userId, data) {
  if (!data.crypto || !data.target || !data.direction) {
    throw new Error("crypto, target e direction são obrigatórios");
  }

  if (!["above", "below"].includes(data.direction)) {
    throw new Error("direction deve ser 'above' ou 'below'");
  }

  return prisma.notification.create({
    data: {
      userId,
      crypto: data.crypto.toUpperCase(),
      target: parseFloat(data.target),
      direction: data.direction,
    },
  });
}

async function list(userId) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function remove(userId, id) {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) throw new Error("Notificação não encontrada");
  if (notification.userId !== userId) throw new Error("Acesso negado");

  return prisma.notification.delete({
    where: { id },
  });
}

module.exports = { create, list, remove };
