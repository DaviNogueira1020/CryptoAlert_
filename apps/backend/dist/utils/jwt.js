"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarTokenJwt = gerarTokenJwt;
exports.verificarTokenJwt = verificarTokenJwt;
const jwt = require("jsonwebtoken");
function gerarTokenJwt(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "default", { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}
function verificarTokenJwt(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "default");
    }
    catch (error) {
        return null;
    }
}
// Aliases legados para compatibilidade CommonJS
module.exports = { gerarTokenJwt, verificarTokenJwt, generateJwtToken: gerarTokenJwt, verifyJwtToken: verificarTokenJwt };
//# sourceMappingURL=jwt.js.map