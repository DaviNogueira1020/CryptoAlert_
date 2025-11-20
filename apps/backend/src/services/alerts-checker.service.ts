const { default: prismaClient } = require("../lib/prisma");
const binanceService = require("./binance.service");

/**
 * Check all active alerts and trigger notifications if condition met
 */
async function checkAllAlerts() {
  try {
    console.log("[AlertsChecker] Starting alert checks...");

    // Get all active alerts
    const alerts = await prismaClient.alert.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    if (alerts.length === 0) {
      console.log("[AlertsChecker] No active alerts to check");
      return;
    }

    // Collect unique symbols
    const symbols = [...new Set(alerts.map((a: any) => a.crypto))];
    console.log(`[AlertsChecker] Checking ${alerts.length} alerts for symbols:`, symbols);

    // Fetch prices from Binance
    const prices = await binanceService.getPrices(symbols);

    // Check each alert
    for (const alert of alerts) {
      const currentPrice = prices[alert.crypto];

      if (!currentPrice) {
        console.warn(`[AlertsChecker] Could not fetch price for ${alert.crypto}`);
        continue;
      }

      // Check if alert condition is met
      const conditionMet = checkAlertCondition(alert, currentPrice);

      if (conditionMet) {
        console.log(
          `[AlertsChecker] Alert triggered: ${alert.crypto} ${alert.direction} ${alert.targetPrice} (current: ${currentPrice})`
        );

        // Create notification
        await createNotification(alert, currentPrice);

        // Mark alert as inactive (optional - uncomment if you want alerts to fire only once)
        // await prismaClient.alert.update({
        //   where: { id: alert.id },
        //   data: { isActive: false },
        // });
      }
    }

    console.log("[AlertsChecker] Alert checks completed");
  } catch (error: any) {
    console.error("[AlertsChecker] Error:", error.message);
  }
}

/**
 * Check if alert condition is met
 * @param {Object} alert - Alert object with targetPrice, direction
 * @param {number} currentPrice - Current price from Binance
 * @returns {boolean}
 */
function checkAlertCondition(alert: any, currentPrice: number): boolean {
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
async function createNotification(alert: any, currentPrice: number) {
  try {
    await prismaClient.notification.create({
      data: {
        userId: alert.userId,
        crypto: alert.crypto,
        target: alert.targetPrice,
        direction: alert.direction,
      },
    });

    console.log(`[AlertsChecker] Notification created for user ${alert.userId}`);
  } catch (error: any) {
    console.error(`[AlertsChecker] Error creating notification:`, error.message);
  }
}

module.exports = { checkAllAlerts };


module.exports = { checkAllAlerts };
