import { checkAllAlerts } from "../services/alerts-checker.service";
import { env } from "../config/env";

const INTERVAL_SECONDS = Number(process.env.ALERT_CHECK_INTERVAL_SECONDS || 60);

async function runLoop() {
  console.log("[AlertsWorker] Iniciando worker de alerts-checker");
  try {
    await checkAllAlerts();
  } catch (err) {
    console.error("[AlertsWorker] Erro no checkAllAlerts:", err);
  }
}

setInterval(runLoop, INTERVAL_SECONDS * 1000);

// Run once on start
runLoop().catch((e) => console.error(e));

// Keep process alive
process.stdin.resume();
