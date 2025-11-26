export default class AuthService {
    register(data: any): Promise<{
        user: any;
        token: any;
    }>;
    login(data: any): Promise<{
        user: any;
        token: any;
    }>;
    me(userId: any): Promise<any>;
    logout(userId: any): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map