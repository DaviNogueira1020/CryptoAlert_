import app from "./app";
import prismaClient from "./lib/prisma";
import dotenv from "dotenv";
import { iniciarJobAlertas, pararJobAlertas } from "./jobs/alerts-checker.job";

dotenv.config();

const PORT = process.env.PORT || 3000;
// Permite configurar o intervalo pelo .env (opcional)
const ALERTS_INTERVAL = Number(process.env.ALERTS_CHECK_INTERVAL || 60000);

async function startServer() {
  try {
    // Testando conexão com o banco
    await prismaClient.$queryRaw`SELECT 1`;
    console.log("🟢 Banco conectado com sucesso");

    // Iniciando servidor API
    app.listen(PORT, () => {
      console.log(`🚀 Backend rodando na porta ${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth: http://localhost:${PORT}/auth`);
      console.log(`🔔 Alerts: http://localhost:${PORT}/alerts`);
      console.log(`📨 Notificações: http://localhost:${PORT}/notification`);
    });

    // Inicia o Scheduler (alertas)
    iniciarJobAlertas(ALERTS_INTERVAL);

  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();

// Finalização segura
process.on("SIGINT", async () => {
  console.log("\n👋 Encerrando com segurança...");

  pararJobAlertas();
  await prismaClient.$disconnect();

  console.log("🟡 Conexões fechadas. Adeus!");
  process.exit(0);
});
