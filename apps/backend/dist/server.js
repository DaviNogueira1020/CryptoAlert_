"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const dotenv_1 = __importDefault(require("dotenv"));
const alerts_checker_job_1 = require("./jobs/alerts-checker.job");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Permite configurar o intervalo pelo .env (opcional)
const ALERTS_INTERVAL = Number(process.env.ALERTS_CHECK_INTERVAL || 60000);
async function startServer() {
    try {
        // Testando conexão com o banco
        await prisma_1.default.$queryRaw `SELECT 1`;
        console.log("🟢 Banco conectado com sucesso");
        // Iniciando servidor API
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Backend rodando na porta ${PORT}`);
            console.log(`📊 Health: http://localhost:${PORT}/health`);
            console.log(`🔐 Auth: http://localhost:${PORT}/auth`);
            console.log(`🔔 Alerts: http://localhost:${PORT}/alerts`);
            console.log(`📨 Notificações: http://localhost:${PORT}/notification`);
        });
        // Inicia o Scheduler (alertas)
        (0, alerts_checker_job_1.iniciarJobAlertas)(ALERTS_INTERVAL);
    }
    catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
}
startServer();
// Finalização segura
process.on("SIGINT", async () => {
    console.log("\n👋 Encerrando com segurança...");
    (0, alerts_checker_job_1.pararJobAlertas)();
    await prisma_1.default.$disconnect();
    console.log("🟡 Conexões fechadas. Adeus!");
    process.exit(0);
});
//# sourceMappingURL=server.js.map