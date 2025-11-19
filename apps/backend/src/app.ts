const express = require("express");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/notifications", notificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

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
