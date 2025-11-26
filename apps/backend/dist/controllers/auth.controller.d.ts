export default class AuthController {
    authService: any;
    constructor();
    register: (req: any, res: any, next?: any) => Promise<any>;
    login: (req: any, res: any, next?: any) => Promise<any>;
    me: (req: any, res: any, next?: any) => Promise<any>;
    logout: (req: any, res: any, next?: any) => Promise<any>;
}
//# sourceMappingURL=auth.controller.d.ts.map