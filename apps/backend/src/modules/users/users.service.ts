const repository = require("./users.repository");
const bcrypt = require("bcrypt");

module.exports = {
  async criar(data) {
    const hashed = await bcrypt.hash(data.password, 10);
    return repository.create({ ...data, password: hashed });
  },

  listar() {
    return repository.findAll();
  },

  obter(id) {
    return repository.findById(id);
  },

  atualizar(id, data) {
    // Se houver password, não re-hash aqui — forçar rota específica se necessário
    if (data.password) delete data.password;
    return repository.update(id, data);
  },

  remover(id) {
    return repository.delete(id);
  },
};
