const express = require("express");
const router = express.Router();

const controller = require("./alerts.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");

router.post("/", authMiddleware, controller.criar);
router.get("/", authMiddleware, controller.listar);
router.put("/:id", authMiddleware, controller.atualizar);
router.delete("/:id", authMiddleware, controller.remover);

module.exports = router;
