"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require("express");
const controller = require("./auth.controller");
const { registerSchema, loginSchema } = require("./auth.validator");
const router = Router();
router.post("/register", (req, res, next) => {
    try {
        const parsed = registerSchema.parse(req.body);
        req.body = parsed;
        return controller.register(req, res, next);
    }
    catch (e) {
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: e?.errors || e?.message || String(e) } });
    }
});
router.post("/login", (req, res, next) => {
    try {
        const parsed = loginSchema.parse(req.body);
        req.body = parsed;
        return controller.login(req, res, next);
    }
    catch (e) {
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: e?.errors || e?.message || String(e) } });
    }
});
module.exports = router;
//# sourceMappingURL=auth.routes.js.map