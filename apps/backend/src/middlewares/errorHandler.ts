const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Erro interno do servidor";
  const code = err.code || "INTERNAL_ERROR";

  console.error(`[${status}] ${code} - ${message}`);

  res.status(status).json({
    error: {
      code,
      message,
      status,
    },
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
