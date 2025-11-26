const service = require("./auth.service");
const { sendSuccess, sendError } = require("../../utils/response");

async function register(req, res) {
  try {
    const result = await service.register(req.body);
    return sendSuccess(res, result, 201);
  } catch (error: any) {
    return sendError(res, "VALIDATION_ERROR", error.message, 400);
  }
}

async function login(req, res) {
  try {
    const result = await service.login(req.body);
    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, "AUTH_ERROR", error.message, 401);
  }
}

module.exports = { register, login };
