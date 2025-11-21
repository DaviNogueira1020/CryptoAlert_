const app = require("./app");
const prismaClient = require("./lib/prisma");
const { iniciarJobAlertas, pararJobAlertas } = require("./jobs/alerts-checker.job");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;
const ALERTS_CHECK_INTERVAL = parseInt(process.env.ALERTS_CHECK_INTERVAL || "60000"); // 1 minute default

const startServer = async () => {
  try {
    // Test database connection
    await prismaClient.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Backend rodando na porta ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 Auth: http://localhost:${PORT}/auth`);
      console.log(`🔔 Alerts: http://localhost:${PORT}/alerts`);
    });

    // Iniciar job de verificação de alertas
    iniciarJobAlertas(ALERTS_CHECK_INTERVAL);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n👋 Shutting down gracefully...");
  pararJobAlertas();
  await prismaClient.$disconnect();
  process.exit(0);
});

