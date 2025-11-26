export {};
const jwt = require("jsonwebtoken");

export function gerarTokenJwt(userId: any) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "default", { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

export function verificarTokenJwt(token: any) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "default");
  } catch (error) {
    return null;
  }
}

// Aliases legados para compatibilidade CommonJS
module.exports = { gerarTokenJwt, verificarTokenJwt, generateJwtToken: gerarTokenJwt, verifyJwtToken: verificarTokenJwt };
