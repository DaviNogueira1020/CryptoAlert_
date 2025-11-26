/**
 * Verifica todos os alertas ativos
 */
export declare function verificarTodosAlertas(): Promise<void>;
/**
 * Lógica da condição: acima/abaixo
 */
export declare function checarCondicaoAlerta(alerta: any, precoAtual: any): boolean;
/**
 * Cria notificação usando o novo módulo notifications.service
 */
declare function criarNotificacao(alerta: any, precoAtual: any): Promise<void>;
export declare const checkAllAlerts: typeof verificarTodosAlertas;
export declare const checkAlertCondition: typeof checarCondicaoAlerta;
export declare const createNotification: typeof criarNotificacao;
export {};
//# sourceMappingURL=alerts-checker.service.d.ts.map