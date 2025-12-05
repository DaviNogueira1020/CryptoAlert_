import { Request, Response } from 'express';
interface AuthRequest extends Request {
    userId?: number;
}
export declare class AlertsController {
    criar(req: AuthRequest, res: Response): Promise<any>;
    listar(req: AuthRequest, res: Response): Promise<any>;
    obter(req: AuthRequest, res: Response): Promise<any>;
    atualizar(req: AuthRequest, res: Response): Promise<any>;
    remover(req: AuthRequest, res: Response): Promise<any>;
    ativarDesativar(req: AuthRequest, res: Response): Promise<any>;
    duplicar(req: AuthRequest, res: Response): Promise<any>;
    exportar(req: AuthRequest, res: Response): Promise<any>;
}
export {};
//# sourceMappingURL=alerts-new.controller.d.ts.map