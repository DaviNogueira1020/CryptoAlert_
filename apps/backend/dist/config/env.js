"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, value) {
    if (!value)
        throw new Error(`Missing required env var: ${name}`);
    return value;
}
exports.env = {
    PORT: Number(process.env.PORT || 3000),
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: required("DATABASE_URL", process.env.DATABASE_URL),
    JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "15") * 60 * 1000,
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
};
//# sourceMappingURL=env.js.map