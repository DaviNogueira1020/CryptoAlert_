"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const openapi = __importStar(require("../docs/openapi.json"));
const alerts_new_routes_1 = __importDefault(require("./routes/alerts-new.routes"));
// Coins routes
const coins_routes_1 = __importDefault(require("./routes/coins.routes"));
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
app.use("/coins", coins_routes_1.default);
app.use("/alerts", alerts_new_routes_1.default); // Nova estrutura de alertas
// Rota de Notificações (ADICIONE ESTA LINHA)
app.use("/notifications", notificationRoutes);
// Rotas de Usuários
app.use("/users", usersRoutes);
// Swagger UI
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi));
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