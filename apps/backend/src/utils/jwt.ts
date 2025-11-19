const jwt = require("jsonwebtoken");

function generateJwtToken(userId: string): string {
  const secret = process.env.JWT_SECRET || "seu_jwt_secret";
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function verifyJwtToken(token: string) {
  const secret = process.env.JWT_SECRET || "seu_jwt_secret";
  return jwt.verify(token, secret);
}

module.exports = { generateJwtToken, verifyJwtToken };
