"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : "Erro interno do servidor";
    const code = err && err.code ? err.code : "INTERNAL_ERROR";
    (0, logger_1.logError)(`${code} - ${message}`, err instanceof Error ? err : new Error(String(err)));
    res.status(status).json({
        success: false,
        error: {
            code,
            message,
        },
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map