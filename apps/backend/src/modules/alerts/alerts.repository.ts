const prisma = require("../../lib/prisma");

module.exports = {
  create(data) {
    return prisma.alert.create({ data });
  },

  findByUser(userId) {
    return prisma.alert.findMany({ where: { userId } });
  },

  update(id, data) {
    return prisma.alert.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.alert.delete({ where: { id } });
  },

  findById(id) {
    return prisma.alert.findUnique({ where: { id } });
  },
};
