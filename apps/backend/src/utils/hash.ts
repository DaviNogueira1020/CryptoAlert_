export {};
const bcrypt = require("bcrypt");

export async function hashSenha(password: any) {
  return bcrypt.hash(password, 10);
}

export async function compararSenha(password: any, hash: any) {
  return bcrypt.compare(password, hash);
}

// Aliases legados
module.exports = {
  hashSenha,
  compararSenha,
  hashPassword: hashSenha,
  comparePassword: compararSenha,
};
