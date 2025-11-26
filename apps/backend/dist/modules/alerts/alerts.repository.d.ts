declare const AlertsRepository: {
    create(data: any): any;
    findByUser(userId: number, options?: any): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
    }>;
    findById(id: string): any;
    update(id: string, data: any): any;
    delete(id: string): any;
};
export default AlertsRepository;
//# sourceMappingURL=alerts.repository.d.ts.map