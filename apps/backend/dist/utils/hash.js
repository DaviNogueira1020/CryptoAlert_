"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashSenha = hashSenha;
exports.compararSenha = compararSenha;
const bcrypt = require("bcrypt");
async function hashSenha(password) {
    return bcrypt.hash(password, 10);
}
async function compararSenha(password, hash) {
    return bcrypt.compare(password, hash);
}
// Aliases legados
module.exports = {
    hashSenha,
    compararSenha,
    hashPassword: hashSenha,
    comparePassword: compararSenha,
};
//# sourceMappingURL=hash.js.map