const { verificarTokenJwt } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);

  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token inválido" });
  }

  const token = parts[1];

  try {
    const decoded = verificarTokenJwt(token);
    // store both for compatibility with different handlers
    req.user = decoded;
    if (decoded && decoded.id) {
      req.userId = Number(decoded.id);
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = { authMiddleware };
