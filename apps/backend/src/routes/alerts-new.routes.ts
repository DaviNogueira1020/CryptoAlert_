import { Router } from 'express';
import { AlertsController } from '../controllers/alerts-new.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AlertsController();

// NOVOS ENDPOINTS
router.post('/criar', authMiddleware, (req, res) => controller.criar(req as any, res));
router.get('/listar', authMiddleware, (req, res) => controller.listar(req as any, res));
router.get('/:id', authMiddleware, (req, res) => controller.obter(req as any, res));
router.put('/atualizar/:id', authMiddleware, (req, res) => controller.atualizar(req as any, res));
router.delete('/remover/:id', authMiddleware, (req, res) => controller.remover(req as any, res));
router.patch('/:id/ativar-desativar', authMiddleware, (req, res) => controller.ativarDesativar(req as any, res));

// ✨ FUNCIONALIDADES AVANÇADAS
router.post('/:id/duplicar', authMiddleware, (req, res) => controller.duplicar(req as any, res));
router.get('/exportar/alertas', authMiddleware, (req, res) => controller.exportar(req as any, res));

// ALIASES LEGACY (para compatibilidade com frontend antigo)
router.post('/create', authMiddleware, (req, res) => controller.criar(req as any, res));
router.get('/get', authMiddleware, (req, res) => controller.listar(req as any, res));
router.put('/update/:id', authMiddleware, (req, res) => controller.atualizar(req as any, res));
router.delete('/delete/:id', authMiddleware, (req, res) => controller.remover(req as any, res));

export default router;
