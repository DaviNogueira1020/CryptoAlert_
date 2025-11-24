/**
 * Rotas de Notificações
 * Aqui o usuário consegue:
 *  - Criar uma notificação
 *  - Listar todas as notificações dele
 *  - Apagar uma notificação específica
 *
 * Todas exigem login.
 */

const { Router } = require("express");
const controller = require("./notification.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");

const router = Router();

// Criar notificação
router.post("/criar", authMiddleware, (req, res) => controller.criar(req, res));

// Listar notificações do usuário logado
router.get("/listar", authMiddleware, (req, res) => controller.listar(req, res));

// Remover uma notificação pelo ID
router.delete("/remover/:id", authMiddleware, (req, res) =>
  controller.remover(req, res)
);

// Marcar notificação como lida
router.put("/marcar-lida/:id", authMiddleware, (req, res) =>
  controller.marcarComoLida(req, res)
);

module.exports = router;
