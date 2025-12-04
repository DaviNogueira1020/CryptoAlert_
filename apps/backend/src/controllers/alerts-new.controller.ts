import { Request, Response } from 'express';
import { AlertsService } from '../services/alerts-new.service';
import { sendSuccess, sendError } from '../utils/response';
import {
  createAlertSchema,
  updateAlertSchema,
  listAlertsQuerySchema,
  idParamSchema,
} from '../validators/alerts.validator';
import { logger } from '../utils/logger';

const alertsService = new AlertsService();

// Interface para request autenticado
interface AuthRequest extends Request {
  userId?: number;
}

export class AlertsController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      // Validar body
      const parsed = createAlertSchema.safeParse(req.body);
      if (!parsed.success) {
        const errorMsg = `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`;
        return sendError(res, errorMsg, 400);
      }

      const alerta = await alertsService.criarAlerta(userId, parsed.data);
      return sendSuccess(res, alerta, 'Alerta criado com sucesso', 201);
    } catch (err: any) {
      logger.error('Erro ao criar alerta:', err);
      return sendError(res, err.message || 'Erro ao criar alerta', 500);
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      // Validar query params
      const parsed = listAlertsQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return sendError(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
      }

      const { page, limit, includeUser } = parsed.data;
      const result = await alertsService.listarAlertas(userId, page, limit, includeUser);

      return sendSuccess(res, result, 'Alertas listados com sucesso');
    } catch (err: any) {
      logger.error('Erro ao listar alertas:', err);
      return sendError(res, err.message || 'Erro ao listar alertas', 500);
    }
  }

  async obter(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return sendError(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
      }

      const alerta = await alertsService.obterAlerta(parsed.data.id, userId);
      if (!alerta) {
        return sendError(res, 'Alerta não encontrado', 404);
      }

      return sendSuccess(res, alerta, 'Alerta obtido com sucesso');
    } catch (err: any) {
      logger.error('Erro ao obter alerta:', err);
      return sendError(res, err.message || 'Erro ao obter alerta', 500);
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const parsedId = idParamSchema.safeParse(req.params);
      if (!parsedId.success) {
        return sendError(res, `Validação falhou: ${parsedId.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
      }

      const parsedBody = updateAlertSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return sendError(res, `Validação falhou: ${parsedBody.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
      }

      const alerta = await alertsService.atualizarAlerta(parsedId.data.id, userId, parsedBody.data);
      return sendSuccess(res, alerta, 'Alerta atualizado com sucesso');
    } catch (err: any) {
      logger.error('Erro ao atualizar alerta:', err);
      return sendError(res, err.message || 'Erro ao atualizar alerta', 500);
    }
  }

  async remover(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return sendError(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
      }

      await alertsService.removerAlerta(parsed.data.id, userId);
      return sendSuccess(res, null, 'Alerta removido com sucesso');
    } catch (err: any) {
      logger.error('Erro ao remover alerta:', err);
      return sendError(res, err.message || 'Erro ao remover alerta', 500);
    }
  }

  async ativarDesativar(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return sendError(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
      }

      const { ativo } = req.body;
      if (typeof ativo !== 'boolean') {
        return sendError(res, 'Campo "ativo" deve ser booleano', 400);
      }

      const alerta = await alertsService.ativarDesativarAlerta(parsed.data.id, userId, ativo);
      return sendSuccess(res, alerta, 'Alerta atualizado com sucesso');
    } catch (err: any) {
      logger.error('Erro ao ativar/desativar alerta:', err);
      return sendError(res, err.message || 'Erro ao ativar/desativar alerta', 500);
    }
  }

  // ✨ Novo endpoint: Duplicar alerta
  async duplicar(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const parsed = idParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return sendError(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
      }

      const novoAlerta = await alertsService.duplicarAlerta(parsed.data.id, userId);
      return sendSuccess(res, novoAlerta, 'Alerta duplicado com sucesso', 201);
    } catch (err: any) {
      logger.error('Erro ao duplicar alerta:', err);
      return sendError(res, err.message || 'Erro ao duplicar alerta', 500);
    }
  }

  // ✨ Novo endpoint: Exportar alertas
  async exportar(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return sendError(res, 'Usuário não autenticado', 401);
      }

      const { formato } = req.query as { formato?: 'csv' | 'json' };
      const dados = await alertsService.exportarAlertas(userId, formato || 'json');

      if (formato === 'csv') {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="alertas.csv"');
        return res.send(dados);
      }

      return sendSuccess(res, dados, 'Alertas exportados com sucesso');
    } catch (err: any) {
      logger.error('Erro ao exportar alertas:', err);
      return sendError(res, err.message || 'Erro ao exportar alertas', 500);
    }
  }
}
