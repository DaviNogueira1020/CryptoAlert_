"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsController = void 0;
const alerts_new_service_1 = require("../services/alerts-new.service");
const response_1 = require("../utils/response");
const alerts_validator_1 = require("../validators/alerts.validator");
const alertsService = new alerts_new_service_1.AlertsService();
class AlertsController {
    async criar(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return (0, response_1.sendError)(res, 'Usuário não autenticado', 401);
            }
            // Validar body
            const parsed = alerts_validator_1.createAlertSchema.safeParse(req.body);
            if (!parsed.success) {
                const errorMsg = `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`;
                return (0, response_1.sendError)(res, errorMsg, 400);
            }
            const alerta = await alertsService.criarAlerta(userId, parsed.data);
            return (0, response_1.sendSuccess)(res, alerta, 'Alerta criado com sucesso', 201);
        }
        catch (err) {
            logger.error('Erro ao criar alerta:', err);
            return (0, response_1.sendError)(res, err.message || 'Erro ao criar alerta', 500);
        }
    }
    async listar(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return (0, response_1.sendError)(res, 'Usuário não autenticado', 401);
            }
            // Validar query params
            const parsed = alerts_validator_1.listAlertsQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                return (0, response_1.sendError)(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
            }
            const { page, limit, includeUser } = parsed.data;
            const result = await alertsService.listarAlertas(userId, page, limit, includeUser);
            return (0, response_1.sendSuccess)(res, result, 'Alertas listados com sucesso');
        }
        catch (err) {
            logger.error('Erro ao listar alertas:', err);
            return (0, response_1.sendError)(res, err.message || 'Erro ao listar alertas', 500);
        }
    }
    async obter(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return (0, response_1.sendError)(res, 'Usuário não autenticado', 401);
            }
            const parsed = alerts_validator_1.idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return (0, response_1.sendError)(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
            }
            const alerta = await alertsService.obterAlerta(parsed.data.id, userId);
            if (!alerta) {
                return (0, response_1.sendError)(res, 'Alerta não encontrado', 404);
            }
            return (0, response_1.sendSuccess)(res, alerta, 'Alerta obtido com sucesso');
        }
        catch (err) {
            logger.error('Erro ao obter alerta:', err);
            return (0, response_1.sendError)(res, err.message || 'Erro ao obter alerta', 500);
        }
    }
    async atualizar(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return (0, response_1.sendError)(res, 'Usuário não autenticado', 401);
            }
            const parsedId = alerts_validator_1.idParamSchema.safeParse(req.params);
            if (!parsedId.success) {
                return (0, response_1.sendError)(res, `Validação falhou: ${parsedId.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
            }
            const parsedBody = alerts_validator_1.updateAlertSchema.safeParse(req.body);
            if (!parsedBody.success) {
                return (0, response_1.sendError)(res, `Validação falhou: ${parsedBody.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
            }
            const alerta = await alertsService.atualizarAlerta(parsedId.data.id, userId, parsedBody.data);
            return (0, response_1.sendSuccess)(res, alerta, 'Alerta atualizado com sucesso');
        }
        catch (err) {
            logger.error('Erro ao atualizar alerta:', err);
            return (0, response_1.sendError)(res, err.message || 'Erro ao atualizar alerta', 500);
        }
    }
    async remover(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return (0, response_1.sendError)(res, 'Usuário não autenticado', 401);
            }
            const parsed = alerts_validator_1.idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return (0, response_1.sendError)(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
            }
            await alertsService.removerAlerta(parsed.data.id, userId);
            return (0, response_1.sendSuccess)(res, null, 'Alerta removido com sucesso');
        }
        catch (err) {
            logger.error('Erro ao remover alerta:', err);
            return (0, response_1.sendError)(res, err.message || 'Erro ao remover alerta', 500);
        }
    }
    async ativarDesativar(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return (0, response_1.sendError)(res, 'Usuário não autenticado', 401);
            }
            const parsed = alerts_validator_1.idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return (0, response_1.sendError)(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
            }
            const { ativo } = req.body;
            if (typeof ativo !== 'boolean') {
                return (0, response_1.sendError)(res, 'Campo "ativo" deve ser booleano', 400);
            }
            const alerta = await alertsService.ativarDesativarAlerta(parsed.data.id, userId, ativo);
            return (0, response_1.sendSuccess)(res, alerta, 'Alerta atualizado com sucesso');
        }
        catch (err) {
            logger.error('Erro ao ativar/desativar alerta:', err);
            return (0, response_1.sendError)(res, err.message || 'Erro ao ativar/desativar alerta', 500);
        }
    }
    // ✨ Novo endpoint: Duplicar alerta
    async duplicar(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return (0, response_1.sendError)(res, 'Usuário não autenticado', 401);
            }
            const parsed = alerts_validator_1.idParamSchema.safeParse(req.params);
            if (!parsed.success) {
                return (0, response_1.sendError)(res, `Validação falhou: ${parsed.error?.issues?.[0]?.message || 'Dados inválidos'}`, 400);
            }
            const novoAlerta = await alertsService.duplicarAlerta(parsed.data.id, userId);
            return (0, response_1.sendSuccess)(res, novoAlerta, 'Alerta duplicado com sucesso', 201);
        }
        catch (err) {
            logger.error('Erro ao duplicar alerta:', err);
            return (0, response_1.sendError)(res, err.message || 'Erro ao duplicar alerta', 500);
        }
    }
    // ✨ Novo endpoint: Exportar alertas
    async exportar(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return (0, response_1.sendError)(res, 'Usuário não autenticado', 401);
            }
            const { formato } = req.query;
            const dados = await alertsService.exportarAlertas(userId, formato || 'json');
            if (formato === 'csv') {
                res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                res.setHeader('Content-Disposition', 'attachment; filename="alertas.csv"');
                return res.send(dados);
            }
            return (0, response_1.sendSuccess)(res, dados, 'Alertas exportados com sucesso');
        }
        catch (err) {
            logger.error('Erro ao exportar alertas:', err);
            return (0, response_1.sendError)(res, err.message || 'Erro ao exportar alertas', 500);
        }
    }
}
exports.AlertsController = AlertsController;
//# sourceMappingURL=alerts-new.controller.js.map