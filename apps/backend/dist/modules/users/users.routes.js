"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require("express");
const router = Router();
const controller = require("./users.controller");
const { createUserSchema, updateUserSchema, listUsersQuerySchema, idParamSchema } = require("./users.validator");
router.post("/", (req, res) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
    req.body = parsed.data;
    return controller.criar(req, res);
});
router.get("/", (req, res) => {
    const parsed = listUsersQuerySchema.safeParse(req.query);
    if (!parsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
    req.query = parsed.data;
    return controller.listar(req, res);
});
router.get("/:id", (req, res) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
    req.params = parsed.data;
    return controller.obter(req, res);
});
router.put("/:id", (req, res) => {
    const idParsed = idParamSchema.safeParse(req.params);
    if (!idParsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: idParsed.error.errors } });
    req.params = idParsed.data;
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
    req.body = parsed.data;
    return controller.atualizar(req, res);
});
router.delete("/:id", (req, res) => {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success)
        return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
    req.params = parsed.data;
    return controller.remover(req, res);
});
module.exports = router;
//# sourceMappingURL=users.routes.js.map