export {};
import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { registerSchema, loginSchema } from "../modules/auth/auth.validator";

const router = Router();
const authController = new AuthController();

router.post("/register", (req: any, res: any, next: any) => {
	try {
		const parsed = registerSchema.parse(req.body);
		req.body = parsed;
		return authController.register(req, res, next);
	} catch (e: any) {
		return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: e?.errors || e?.message || String(e) } });
	}
});

router.post("/login", (req: any, res: any, next: any) => {
	try {
		const parsed = loginSchema.parse(req.body);
		req.body = parsed;
		return authController.login(req, res, next);
	} catch (e: any) {
		return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: e?.errors || e?.message || String(e) } });
	}
});

router.get("/me", authMiddleware, authController.me);
router.post("/logout", authMiddleware, authController.logout);

export default router;
