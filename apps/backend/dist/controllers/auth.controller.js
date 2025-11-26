"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const response_1 = require("../utils/response");
class AuthController {
    constructor() {
        this.register = async (req, res, next) => {
            try {
                const result = await this.authService.register(req.body);
                return (0, response_1.sendSuccess)(res, result, 201);
            }
            catch (error) {
                return (0, response_1.sendError)(res, "VALIDATION_ERROR", error.message, 400);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const result = await this.authService.login(req.body);
                return (0, response_1.sendSuccess)(res, result);
            }
            catch (error) {
                return (0, response_1.sendError)(res, "AUTH_ERROR", error.message, 401);
            }
        };
        this.me = async (req, res, next) => {
            try {
                const result = await this.authService.me(req.userId);
                return (0, response_1.sendSuccess)(res, result);
            }
            catch (error) {
                return (0, response_1.sendError)(res, "AUTH_ERROR", error.message, 400);
            }
        };
        this.logout = async (req, res, next) => {
            try {
                const result = await this.authService.logout(req.userId);
                return (0, response_1.sendSuccess)(res, result);
            }
            catch (error) {
                return (0, response_1.sendError)(res, "AUTH_ERROR", error.message, 400);
            }
        };
        this.authService = new auth_service_1.default();
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map