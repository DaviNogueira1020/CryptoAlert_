declare const cron: any;
declare const verificarTodosAlertas: any;
declare const logger: any;
/**
 * Inicia o scheduler responsável por verificar os alertas periodicamente.
 *
 * A cada 1 minuto:
 *  - Busca todos os alertas ativos
 *  - Coleta preços na Binance
 *  - Dispara notificações quando necessário
 */
declare function iniciarAlertScheduler(): void;
//# sourceMappingURL=alerts.scheduler.d.ts.map