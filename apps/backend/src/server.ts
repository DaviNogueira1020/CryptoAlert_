const app = require("./app");
const { default: prismaClient } = require("./lib/prisma");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await prismaClient.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Backend rodando na porta ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 Auth: http://localhost:${PORT}/auth`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n👋 Shutting down gracefully...");
  await prismaClient.$disconnect();
  process.exit(0);
});
