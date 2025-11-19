const express = require("express");
const router = express.Router();

const controller = require("./alerts.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.list);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.remove);

module.exports = router;
