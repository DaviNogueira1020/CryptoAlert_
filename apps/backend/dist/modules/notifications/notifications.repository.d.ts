declare const _default: {
    create(data: any): any;
    /**
     * Lista notificações de um usuário com opções de paginação e filtros
     * options: { page, limit, unreadOnly, crypto }
     */
    findByUser(userId: number, options?: any): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
    }>;
    findById(id: string): any;
    markAsRead(id: string, userId: number): any;
    delete(id: string): any;
    deleteManyByUser(userId: number): any;
    deleteReadByUser(userId: number): any;
    deleteOlderThan(userId: number, beforeDate: Date): any;
    countByUser(userId: number, filters?: any): any;
};
export default _default;
//# sourceMappingURL=notifications.repository.d.ts.map