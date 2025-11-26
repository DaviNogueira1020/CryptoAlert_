"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const alerts_controller_1 = __importDefault(require("./alerts.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const alerts_validator_1 = require("./alerts.validator");
const router = express_1.default.Router();
// Criar alerta com validação Zod
router.post("/", auth_middleware_1.authMiddleware, (req, res) => {
    const parsed = alerts_validator_1.createAlertSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues } });
    }
    return alerts_controller_1.default.criar(req, res, parsed.data);
});
// Listar (com paginação e include)
router.get("/", auth_middleware_1.authMiddleware, (req, res) => {
    const parsed = alerts_validator_1.listAlertsQuerySchema.safeParse(req.query);
    if (!parsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues } });
    return alerts_controller_1.default.listar(req, res, parsed.data);
});
// Atualizar com validação Zod
router.put("/:id", auth_middleware_1.authMiddleware, (req, res) => {
    const idParsed = alerts_validator_1.idParamSchema.safeParse(req.params);
    if (!idParsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: idParsed.error.issues } });
    const parsed = alerts_validator_1.updateAlertSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues } });
    return alerts_controller_1.default.atualizar(req, res, idParsed.data, parsed.data);
});
// Deletar
router.delete("/:id", auth_middleware_1.authMiddleware, (req, res) => {
    const idParsed = alerts_validator_1.idParamSchema.safeParse(req.params);
    if (!idParsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: idParsed.error.issues } });
    return alerts_controller_1.default.remover(req, res, idParsed.data);
});
exports.default = router;
//# sourceMappingURL=alerts.routes.js.map