const prisma = require("../lib/prisma");
const binanceService = require("./binance.service");

/**
 * Check all active alerts and trigger notifications if condition met
 */
async function verificarTodosAlertas() {
  try {
    console.log("[AlertsChecker] Iniciando verificação de alertas...");

    // Get all active alerts
    const alerts = await prisma.alert.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    if (alerts.length === 0) {
      console.log("[AlertsChecker] Nenhum alerta ativo para verificar");
      return;
    }

    // Collect unique symbols
    const symbols = [...new Set(alerts.map((a: any) => a.crypto))];
    console.log(`[AlertsChecker] Verificando ${alerts.length} alertas para símbolos:`, symbols);

    // Fetch prices from Binance
    const prices = await binanceService.obterPrecos(symbols);

    // Check each alert
    for (const alert of alerts) {
      const currentPrice = prices[alert.crypto];

      if (!currentPrice) {
        console.warn(`[AlertsChecker] Não foi possível obter preço para ${alert.crypto}`);
        continue;
      }

      // Verifica se a condição do alerta foi atendida
      const conditionMet = checarCondicaoAlerta(alert, currentPrice);

      if (conditionMet) {
        console.log(
          `[AlertsChecker] Alerta disparado: ${alert.crypto} ${alert.direction} ${alert.targetPrice} (atual: ${currentPrice})`
        );

        // Criar notificação
        await criarNotificacao(alert, currentPrice);

        // Mark alert as inactive (optional - uncomment if you want alerts to fire only once)
        // await prismaClient.alert.update({
        //   where: { id: alert.id },
        //   data: { isActive: false },
        // });
      }
    }

    console.log("[AlertsChecker] Verificação de alertas concluída");
  } catch (error: any) {
    console.error("[AlertsChecker] Erro:", error && error.message ? error.message : error);
  }
}

/**
 * Check if alert condition is met
 * @param {Object} alert - Alert object with targetPrice, direction
 * @param {number} currentPrice - Current price from Binance
 * @returns {boolean}
 */
function checarCondicaoAlerta(alert, currentPrice) {
  if (alert.direction === "above") {
    return currentPrice >= alert.targetPrice;
  } else if (alert.direction === "below") {
    return currentPrice <= alert.targetPrice;
  }
  return false;
}

/**
 * Create notification for triggered alert
 */
async function criarNotificacao(alert, currentPrice) {
  try {
    await prisma.notification.create({
      data: {
        userId: alert.userId,
        crypto: alert.crypto,
        target: alert.targetPrice,
        direction: alert.direction,
      },
    });

    console.log(`[AlertsChecker] Notificação criada para usuário ${alert.userId}`);
  } catch (error: any) {
    console.error(`[AlertsChecker] Erro ao criar notificação:`, error && error.message ? error.message : error);
  }
}
// Export em Português e aliases legados
module.exports = {
  verificarTodosAlertas,
  checarCondicaoAlerta,
  criarNotificacao,
  checkAllAlerts: verificarTodosAlertas,
  checkAlertCondition: checarCondicaoAlerta,
  createNotification: criarNotificacao,
};
