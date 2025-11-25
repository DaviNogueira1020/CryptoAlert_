const express = require("express");
const router = express.Router();

const controller = require("./alerts.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { createAlertSchema, updateAlertSchema } = require("./alerts.validator");

// Criar alerta com validação Zod
router.post("/", authMiddleware, (req, res) => {
	const parsed = createAlertSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
	}
	req.body = parsed.data;
	return controller.criar(req, res);
});

// Listar
router.get("/", authMiddleware, controller.listar);

// Atualizar com validação Zod
router.put("/:id", authMiddleware, (req, res) => {
	const parsed = updateAlertSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
	}
	req.body = parsed.data;
	return controller.atualizar(req, res);
});

// Deletar
router.delete("/:id", authMiddleware, controller.remover);

module.exports = router;
