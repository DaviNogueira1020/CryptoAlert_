"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
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
        const decoded = (0, jwt_1.verificarTokenJwt)(token);
        // store both for compatibility with different handlers
        req.user = decoded;
        // Support tokens that may include either `id` or `userId` in the payload
        const extractedId = decoded && (decoded.userId ?? decoded.id);
        if (extractedId !== undefined && extractedId !== null) {
            req.userId = Number(extractedId);
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map