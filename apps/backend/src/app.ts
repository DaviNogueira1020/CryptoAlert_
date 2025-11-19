const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const { errorHandler } = require("./middlewares/errorHandler");
const { limiter } = require("./middlewares/rateLimit.middleware");
const { httpLogger } = require("./utils/logger");
// Alerts routes (module)
const alertsRoutes = require("./modules/alerts/alerts.routes");

const app = express();

// Middlewares
app.use(httpLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Routes
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/alerts", alertsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    code: "NOT_FOUND",
    path: req.path,
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
