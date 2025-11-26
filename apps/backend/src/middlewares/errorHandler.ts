import { logError } from "../utils/logger";

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  const status = err && err.status ? err.status : 500;
  const message = err && err.message ? err.message : "Erro interno do servidor";
  const code = err && err.code ? err.code : "INTERNAL_ERROR";

  logError(`${code} - ${message}`, err instanceof Error ? err : new Error(String(err)));

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

export const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
