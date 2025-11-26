export {};
/**
 * Inicia o job que verifica alertas periodicamente.
 * @param {number} intervaloMs - Tempo entre verificações (padrão: 60s)
 */
declare function iniciarJobAlertas(intervaloMs?: number): void;
/**
 * Para o job de alertas.
 */
declare function pararJobAlertas(): void;
export { iniciarJobAlertas, pararJobAlertas };
//# sourceMappingURL=alerts-checker.job.d.ts.map