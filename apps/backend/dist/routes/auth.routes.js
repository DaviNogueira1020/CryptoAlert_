"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_validator_1 = require("../modules/auth/auth.validator");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.default();
router.post("/register", (req, res, next) => {
    try {
        const parsed = auth_validator_1.registerSchema.parse(req.body);
        req.body = parsed;
        return authController.register(req, res, next);
    }
    catch (e) {
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: e?.errors || e?.message || String(e) } });
    }
});
router.post("/login", (req, res, next) => {
    try {
        const parsed = auth_validator_1.loginSchema.parse(req.body);
        req.body = parsed;
        return authController.login(req, res, next);
    }
    catch (e) {
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: e?.errors || e?.message || String(e) } });
    }
});
router.get("/me", auth_middleware_1.authMiddleware, authController.me);
router.post("/logout", auth_middleware_1.authMiddleware, authController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map