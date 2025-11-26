export {};
import express from "express";
import controller from "./alerts.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createAlertSchema, updateAlertSchema, listAlertsQuerySchema, idParamSchema } from "./alerts.validator";

const router = express.Router();

// Criar alerta com validação Zod
router.post("/", authMiddleware, (req, res) => {
	const parsed = createAlertSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues } });
	}
	return controller.criar(req, res, parsed.data);
});

// Listar (com paginação e include)
router.get("/", authMiddleware, (req: any, res: any) => {
	const parsed = listAlertsQuerySchema.safeParse(req.query);
	if (!parsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues } });
	return controller.listar(req, res, parsed.data);
});

// Atualizar com validação Zod
router.put("/:id", authMiddleware, (req: any, res: any) => {
	const idParsed = idParamSchema.safeParse(req.params);
	if (!idParsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: idParsed.error.issues } });

	const parsed = updateAlertSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues } });
	return controller.atualizar(req, res, idParsed.data, parsed.data);
});

// Deletar
router.delete("/:id", authMiddleware, (req: any, res: any) => {
	const idParsed = idParamSchema.safeParse(req.params);
	if (!idParsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: idParsed.error.issues } });
	return controller.remover(req, res, idParsed.data);
});

export default router;
