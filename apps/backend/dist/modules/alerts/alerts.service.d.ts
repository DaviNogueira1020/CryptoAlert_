declare const _default: {
    criarAlerta(userId: any, body: any): Promise<any>;
    listarAlertas(userId: any, options?: any): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
    }>;
    atualizarAlerta(userId: any, id: any, body: any): Promise<any>;
    deletarAlerta(userId: any, id: any): Promise<any>;
};
export default _default;
//# sourceMappingURL=alerts.service.d.ts.map