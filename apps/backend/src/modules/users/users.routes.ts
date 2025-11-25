const { Router } = require("express");
const router = Router();

const controller = require("./users.controller");
const { createUserSchema, updateUserSchema } = require("./users.validator");

router.post("/", (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
  req.body = parsed.data;
  return controller.criar(req, res);
});

router.get("/", controller.listar);
router.get("/:id", controller.obter);

router.put("/:id", (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors } });
  req.body = parsed.data;
  return controller.atualizar(req, res);
});

router.delete("/:id", controller.remover);

module.exports = router;
