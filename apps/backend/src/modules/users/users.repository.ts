export {};
const prisma = require("../../lib/prisma");

module.exports = {
  create(data) {
    return prisma.user.create({ data });
  },

  findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  },

  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  update(id, data) {
    return prisma.user.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.user.delete({ where: { id } });
  },
};
