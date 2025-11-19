const { Router } = require("express");
const { AuthController } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);

module.exports = router;
