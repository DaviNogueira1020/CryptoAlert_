"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message, status = 200) {
    return res.status(status).json({
        success: true,
        message: message || 'Sucesso',
        data: data || null
    });
}
function sendError(res, message, status = 400) {
    return res.status(status).json({
        success: false,
        error: message
    });
}
//# sourceMappingURL=response.js.map