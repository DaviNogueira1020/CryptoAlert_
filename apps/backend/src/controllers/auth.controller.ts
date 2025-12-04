import AuthService from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";

export default class AuthController {
  authService: any;
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: any, res: any, next?: any) => {
    try {
      const result = await this.authService.register(req.body);
      return sendSuccess(res, result, 'Usuário registrado com sucesso', 201);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  login = async (req: any, res: any, next?: any) => {
    try {
      const result = await this.authService.login(req.body);
      return sendSuccess(res, result, 'Login realizado com sucesso');
    } catch (error: any) {
      return sendError(res, error.message, 401);
    }
  };

  me = async (req: any, res: any, next?: any) => {
    try {
      const result = await this.authService.me(req.userId);
      return sendSuccess(res, result, 'Usuário obtido');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };

  logout = async (req: any, res: any, next?: any) => {
    try {
      const result = await this.authService.logout(req.userId);
      return sendSuccess(res, result, 'Logout realizado com sucesso');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  };
}
