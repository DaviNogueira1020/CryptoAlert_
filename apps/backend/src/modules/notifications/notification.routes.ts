const { Router } = require("express");
const controller = require("./notification.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");

const router = Router();

router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.get("/", authMiddleware, (req, res) => controller.list(req, res));
router.delete("/:id", authMiddleware, (req, res) => controller.remove(req, res));

module.exports = router;
