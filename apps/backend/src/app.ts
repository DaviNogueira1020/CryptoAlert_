export {};
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { limiter } from "./middlewares/rateLimit.middleware";
import { httpLogger } from "./utils/logger";

// Swagger
import swaggerUi from "swagger-ui-express";
import openapi from "../docs/openapi.json";

// Alerts routes
import alertsRoutes from "./modules/alerts/alerts.routes";

// Notifications routes (ADICIONE ESTA LINHA)
const notificationRoutes = require("./modules/notifications/notification.routes");
// Users
const usersRoutes = require("./modules/users/users.routes");

const app = express();

// Middlewares
app.use(httpLogger);
// Security headers
app.use(helmet());
// CORS configuration: allow only configured origins in production, permissive in dev
const corsOptions = {
  origin: env.NODE_ENV === "production" ? (process.env.CORS_ORIGIN || "https://your-frontend.example.com") : true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// -------------------
// Rotas da Aplicação
// -------------------
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/alerts", alertsRoutes);

// Rota de Notificações (ADICIONE ESTA LINHA)
app.use("/notifications", notificationRoutes);
// Rotas de Usuários
app.use("/users", usersRoutes);

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    code: "NOT_FOUND",
    path: req.path,
  });
});

// Error handler
app.use(errorHandler);

export default app;
