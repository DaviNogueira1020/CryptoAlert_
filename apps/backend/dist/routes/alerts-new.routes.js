"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alerts_new_controller_1 = require("../controllers/alerts-new.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const controller = new alerts_new_controller_1.AlertsController();
// NOVOS ENDPOINTS
router.post('/criar', auth_middleware_1.authMiddleware, (req, res) => controller.criar(req, res));
router.get('/listar', auth_middleware_1.authMiddleware, (req, res) => controller.listar(req, res));
router.get('/:id', auth_middleware_1.authMiddleware, (req, res) => controller.obter(req, res));
router.put('/atualizar/:id', auth_middleware_1.authMiddleware, (req, res) => controller.atualizar(req, res));
router.delete('/remover/:id', auth_middleware_1.authMiddleware, (req, res) => controller.remover(req, res));
router.patch('/:id/ativar-desativar', auth_middleware_1.authMiddleware, (req, res) => controller.ativarDesativar(req, res));
// ✨ FUNCIONALIDADES AVANÇADAS
router.post('/:id/duplicar', auth_middleware_1.authMiddleware, (req, res) => controller.duplicar(req, res));
router.get('/exportar/alertas', auth_middleware_1.authMiddleware, (req, res) => controller.exportar(req, res));
// ALIASES LEGACY (para compatibilidade com frontend antigo)
router.post('/create', auth_middleware_1.authMiddleware, (req, res) => controller.criar(req, res));
router.get('/get', auth_middleware_1.authMiddleware, (req, res) => controller.listar(req, res));
router.put('/update/:id', auth_middleware_1.authMiddleware, (req, res) => controller.atualizar(req, res));
router.delete('/delete/:id', auth_middleware_1.authMiddleware, (req, res) => controller.remover(req, res));
exports.default = router;
//# sourceMappingURL=alerts-new.routes.js.map