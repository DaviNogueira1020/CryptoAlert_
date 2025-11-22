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
router.post("/criar", authMiddleware, (req, res) => controller.create(req, res));

// Listar notificações do usuário logado
router.get("/listar", authMiddleware, (req, res) => controller.list(req, res));

// Remover uma notificação pelo ID
router.delete("/remover/:id", authMiddleware, (req, res) =>
  controller.remove(req, res)
);

module.exports = router;
