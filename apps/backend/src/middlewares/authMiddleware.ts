const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = { authMiddleware };
