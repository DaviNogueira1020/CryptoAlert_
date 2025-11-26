"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service = require("./users.service");
const { sendSuccess, sendError } = require("../../utils/response");
module.exports = {
    async criar(req, res) {
        try {
            const user = await service.criar(req.body);
            return sendSuccess(res, user, 201);
        }
        catch (err) {
            return sendError(res, "SERVER_ERROR", err.message, 500);
        }
    },
    async listar(req, res) {
        try {
            const users = await service.listar();
            return sendSuccess(res, users);
        }
        catch (err) {
            return sendError(res, "SERVER_ERROR", err.message, 500);
        }
    },
    async obter(req, res) {
        try {
            const user = await service.obter(parseInt(req.params.id, 10));
            if (!user)
                return sendError(res, "NOT_FOUND", "Usuário não encontrado", 404);
            return sendSuccess(res, user);
        }
        catch (err) {
            return sendError(res, "SERVER_ERROR", err.message, 500);
        }
    },
    async atualizar(req, res) {
        try {
            const updated = await service.atualizar(parseInt(req.params.id, 10), req.body);
            return sendSuccess(res, updated);
        }
        catch (err) {
            return sendError(res, "SERVER_ERROR", err.message, 500);
        }
    },
    async remover(req, res) {
        try {
            await service.remover(parseInt(req.params.id, 10));
            return sendSuccess(res, { message: "Usuário removido" });
        }
        catch (err) {
            return sendError(res, "SERVER_ERROR", err.message, 500);
        }
    },
};
//# sourceMappingURL=users.controller.js.map