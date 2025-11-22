// src/scheduler/alerts.scheduler.ts

const cron = require("node-cron");
const { verificarTodosAlertas } = require("../modules/alerts/alerts-checker.service");
const logger = require("../utils/logger");

/**
 * Inicia o scheduler responsável por verificar os alertas periodicamente.
 * 
 * A cada 1 minuto:
 *  - Busca todos os alertas ativos
 *  - Coleta preços na Binance
 *  - Dispara notificações quando necessário
 */
function iniciarAlertScheduler() {
  logger.info("[Scheduler] Iniciando verificação automática de alertas...");

  // Executa a cada 1 minuto
  cron.schedule("*/1 * * * *", async () => {
    logger.info("[Scheduler] Rodando ciclo automático");
    await verificarTodosAlertas();
  });

  logger.info("[Scheduler] Scheduler de alertas ativado");
}

module.exports = { iniciarAlertScheduler };
