export {};
const { Router } = require("express");
const { AlertsController } = require("../controllers/alerts.controller");

const router = Router();
const controller = new AlertsController();

router.post("/", (req, res) => controller.criar(req, res));
router.get("/", (req, res) => controller.listar(req, res));
router.get("/:id", (req, res) => controller.buscarPorId(req, res));
router.put("/:id", (req, res) => controller.atualizar(req, res));
router.delete("/:id", (req, res) => controller.remover(req, res));

module.exports = router;
