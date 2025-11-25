const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const { errorHandler } = require("./middlewares/errorHandler");
const { limiter } = require("./middlewares/rateLimit.middleware");
const { httpLogger } = require("./utils/logger");

// Swagger
const swaggerUi = require("swagger-ui-express");
const openapi = require("../docs/openapi.json");

// Alerts routes
const alertsRoutes = require("./modules/alerts/alerts.routes");

// Notifications routes (ADICIONE ESTA LINHA)
const notificationRoutes = require("./modules/notifications/notification.routes");

const app = express();

// Middlewares
app.use(httpLogger);
app.use(cors());
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

module.exports = app;
