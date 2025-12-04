export {};
const { Router } = require("express");
const { AlertsController } = require("../controllers/alerts.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = Router();
const controller = new AlertsController();

// Core CRUD routes
router.post("/", authMiddleware, (req, res) => controller.criar(req, res));
router.get("/", authMiddleware, (req, res) => controller.listar(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.buscarPorId(req, res));
router.put("/:id", authMiddleware, (req, res) => controller.atualizar(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.remover(req, res));

// Advanced features
router.patch("/:id/ativar-desativar", authMiddleware, (req, res) => controller.ativarDesativar(req, res));
router.post("/:id/duplicar", authMiddleware, (req, res) => controller.duplicar(req, res));
router.get("/exportar/alertas", authMiddleware, (req, res) => controller.exportar(req, res));

module.exports = router;
