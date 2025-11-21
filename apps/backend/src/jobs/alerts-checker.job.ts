const { verificarTodosAlertas } = require("../services/alerts-checker.service");

let checkInterval: NodeJS.Timeout | null = null;

/**
 * Start the alerts checker job
 * @param {number} intervalMs - Interval in milliseconds (default: 60000 = 1 minute)
 */
function iniciarJobAlertas(intervalMs = 60000) {
  if (checkInterval) {
    console.warn("[AlertsJob] Job already running, skipping...");
    return;
  }

  console.log(`[AlertsJob] Iniciando job de verificação de alertas (intervalo: ${intervalMs}ms)`);

  // Executa imediatamente ao iniciar
  verificarTodosAlertas().catch((err) => {
    console.error("[AlertsJob] Falha na verificação inicial:", err);
  });

  // Executa periodicamente
  checkInterval = setInterval(() => {
    verificarTodosAlertas().catch((err) => {
      console.error("[AlertsJob] Falha na verificação:", err);
    });
  }, intervalMs);
}

/**
 * Stop the alerts checker job
 */
function pararJobAlertas() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    console.log("[AlertsJob] Job de alertas parado");
  }
}

// Export em Português e aliases legados
module.exports = {
  iniciarJobAlertas,
  pararJobAlertas,
  startAlertsJob: iniciarJobAlertas,
  stopAlertsJob: pararJobAlertas,
};
