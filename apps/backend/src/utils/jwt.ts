const jwt = require("jsonwebtoken");

function gerarTokenJwt(userId) {
  const secret = process.env.JWT_SECRET || "seu_jwt_secret";
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function verificarTokenJwt(token) {
  const secret = process.env.JWT_SECRET || "seu_jwt_secret";
  return jwt.verify(token, secret);
}

// Aliases legados para compatibilidade
module.exports = {
  gerarTokenJwt,
  verificarTokenJwt,
  generateJwtToken: gerarTokenJwt,
  verifyJwtToken: verificarTokenJwt,
};
