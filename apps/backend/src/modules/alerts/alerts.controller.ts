import service from "./alerts.service";
import { sendSuccess, sendError } from "../../utils/response";

export default {
  async criar(req: any, res: any, validated?: any) {
    try {
      const body = arguments[2] ?? req.body;
      const alert = await service.criarAlerta(req.userId, body);
      return sendSuccess(res, alert, 201);
    } catch (err: any) {
      return sendError(res, "INTERNAL_ERROR", err.message);
    }
  },

  async listar(req: any, res: any, opts?: any) {
    try {
      const opts = arguments[2] ?? req.query ?? {};
      const alerts = await service.listarAlertas(req.userId, opts);
      return sendSuccess(res, alerts);
    } catch (err: any) {
      return sendError(res, "INTERNAL_ERROR", err.message);
    }
  },

  async atualizar(req: any, res: any, params?: any, body?: any) {
    try {
      const params = arguments[2] ?? req.params;
      const body = arguments[3] ?? req.body;
      const alert = await service.atualizarAlerta(req.userId, params.id, body);
      return sendSuccess(res, alert);
    } catch (err: any) {
      return sendError(res, "INTERNAL_ERROR", err.message);
    }
  },

  async remover(req: any, res: any, params?: any) {
    try {
      const params = arguments[2] ?? req.params;
      await service.deletarAlerta(req.userId, params.id);
      return sendSuccess(res, { message: "Alerta removido" });
    } catch (err: any) {
      return sendError(res, "INTERNAL_ERROR", err.message);
    }
  },
};
