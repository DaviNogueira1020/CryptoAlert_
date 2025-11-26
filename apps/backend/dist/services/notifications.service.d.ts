export {};
declare class NotificationsService {
    /**
     * Cria uma notificação.
     * Aceita payloads variados — sempre tenta persistir os campos mínimos (crypto/target/direction).
     */
    createNotification(payload: any): Promise<any>;
}
export { NotificationsService };
//# sourceMappingURL=notifications.service.d.ts.map