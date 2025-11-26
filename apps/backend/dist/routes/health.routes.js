"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
router.get("/ready", (req, res) => {
    // Simple readiness; could add DB ping
    res.json({ status: "ok", env: env_1.env.NODE_ENV });
});
router.get("/live", (req, res) => {
    res.json({ status: "ok" });
});
exports.default = router;
//# sourceMappingURL=health.routes.js.map