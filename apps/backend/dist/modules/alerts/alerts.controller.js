"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alerts_service_1 = __importDefault(require("./alerts.service"));
const response_1 = require("../../utils/response");
exports.default = {
    async criar(req, res, validated) {
        try {
            const body = arguments[2] ?? req.body;
            const alert = await alerts_service_1.default.criarAlerta(String(req.userId), body);
            return (0, response_1.sendSuccess)(res, alert, "201");
        }
        catch (err) {
            return (0, response_1.sendError)(res, "INTERNAL_ERROR", err.message);
        }
    },
    async listar(req, res, opts) {
        try {
            const opts = arguments[2] ?? req.query ?? {};
            const alerts = await alerts_service_1.default.listarAlertas(String(req.userId), opts);
            return (0, response_1.sendSuccess)(res, alerts);
        }
        catch (err) {
            return (0, response_1.sendError)(res, "INTERNAL_ERROR", err.message);
        }
    },
    async atualizar(req, res, params, body) {
        try {
            const params = arguments[2] ?? req.params;
            const body = arguments[3] ?? req.body;
            const alert = await alerts_service_1.default.atualizarAlerta(String(req.userId), params.id, body);
            return (0, response_1.sendSuccess)(res, alert);
        }
        catch (err) {
            return (0, response_1.sendError)(res, "INTERNAL_ERROR", err.message);
        }
    },
    async remover(req, res, params) {
        try {
            const params = arguments[2] ?? req.params;
            await alerts_service_1.default.deletarAlerta(String(req.userId), params.id);
            return (0, response_1.sendSuccess)(res, { message: "Alerta removido" });
        }
        catch (err) {
            return (0, response_1.sendError)(res, "INTERNAL_ERROR", err.message);
        }
    },
};
//# sourceMappingURL=alerts.controller.js.map