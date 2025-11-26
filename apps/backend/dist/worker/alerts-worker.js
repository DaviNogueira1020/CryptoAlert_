"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alerts_checker_service_1 = require("../services/alerts-checker.service");
const INTERVAL_SECONDS = Number(process.env.ALERT_CHECK_INTERVAL_SECONDS || 60);
async function runLoop() {
    console.log("[AlertsWorker] Iniciando worker de alerts-checker");
    try {
        await (0, alerts_checker_service_1.checkAllAlerts)();
    }
    catch (err) {
        console.error("[AlertsWorker] Erro no checkAllAlerts:", err);
    }
}
setInterval(runLoop, INTERVAL_SECONDS * 1000);
// Run once on start
runLoop().catch((e) => console.error(e));
// Keep process alive
process.stdin.resume();
//# sourceMappingURL=alerts-worker.js.map