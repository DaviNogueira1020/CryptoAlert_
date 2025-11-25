const errorHandler = (err, req, res, next) => {
  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : "Erro interno do servidor";
  const code = err && err.code ? err.code : "INTERNAL_ERROR";

  const { logError } = require("../utils/logger");
  logError(`${code} - ${message}`, err instanceof Error ? err : new Error(String(err)));

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
