"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, status = 200) {
    return res.status(status).json({ success: true, data });
}
function sendError(res, code, message, status = 400) {
    return res.status(status).json({ success: false, error: { code, message } });
}
//# sourceMappingURL=response.js.map