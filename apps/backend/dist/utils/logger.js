"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
exports.log = log;
exports.logError = logError;
exports.logInfo = logInfo;
exports.logWarn = logWarn;
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("../config/env");
// Logger para requisições HTTP
exports.httpLogger = (0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev");
// Logger customizado
function log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`, data);
}
function logError(message, error) {
    log("ERROR", message, { error: error.message, stack: error.stack });
}
function logInfo(message, data) {
    log("INFO", message, data);
}
function logWarn(message, data) {
    log("WARN", message, data);
}
//# sourceMappingURL=logger.js.map