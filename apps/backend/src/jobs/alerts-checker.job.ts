const { checkAllAlerts } = require("../services/alerts-checker.service");

let checkInterval: NodeJS.Timeout | null = null;

/**
 * Start the alerts checker job
 * @param {number} intervalMs - Interval in milliseconds (default: 60000 = 1 minute)
 */
function startAlertsJob(intervalMs: number = 60000) {
  if (checkInterval) {
    console.warn("[AlertsJob] Job already running, skipping...");
    return;
  }

  console.log(`[AlertsJob] Starting alerts checker job (interval: ${intervalMs}ms)`);

  // Run immediately on start
  checkAllAlerts().catch((err: any) => {
    console.error("[AlertsJob] Initial check failed:", err);
  });

  // Then run periodically
  checkInterval = setInterval(() => {
    checkAllAlerts().catch((err: any) => {
      console.error("[AlertsJob] Check failed:", err);
    });
  }, intervalMs);
}

/**
 * Stop the alerts checker job
 */
function stopAlertsJob() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    console.log("[AlertsJob] Alerts job stopped");
  }
}

module.exports = { startAlertsJob, stopAlertsJob };
