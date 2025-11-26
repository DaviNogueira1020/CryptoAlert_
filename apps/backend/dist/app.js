"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimit_middleware_1 = require("./middlewares/rateLimit.middleware");
const logger_1 = require("./utils/logger");
// Swagger
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_json_1 = __importDefault(require("../docs/openapi.json"));
// Alerts routes
const alerts_routes_1 = __importDefault(require("./modules/alerts/alerts.routes"));
// Notifications routes (ADICIONE ESTA LINHA)
const notificationRoutes = require("./modules/notifications/notification.routes");
// Users
const usersRoutes = require("./modules/users/users.routes");
const app = (0, express_1.default)();
// Middlewares
app.use(logger_1.httpLogger);
// Security headers
app.use((0, helmet_1.default)());
// CORS configuration: allow only configured origins in production, permissive in dev
const corsOptions = {
    origin: env_1.env.NODE_ENV === "production" ? (process.env.CORS_ORIGIN || "https://your-frontend.example.com") : true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(rateLimit_middleware_1.limiter);
// -------------------
// Rotas da Aplicação
// -------------------
app.use("/health", health_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/alerts", alerts_routes_1.default);
// Rota de Notificações (ADICIONE ESTA LINHA)
app.use("/notifications", notificationRoutes);
// Rotas de Usuários
app.use("/users", usersRoutes);
// Swagger UI
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_json_1.default));
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Rota não encontrada",
        code: "NOT_FOUND",
        path: req.path,
    });
});
// Error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map