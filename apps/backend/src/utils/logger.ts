import morgan from "morgan";
import { env } from "../config/env";

// Logger para requisições HTTP
export const httpLogger = morgan(env.NODE_ENV === "production" ? "combined" : "dev");

// Logger customizado
export function log(level: string, message: string, data: any = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`, data);
}

export function logError(message: string, error: Error) {
  log("ERROR", message, { error: error.message, stack: (error as any).stack });
}

export function logInfo(message: string, data: any) {
  log("INFO", message, data);
}

export function logWarn(message: string, data: any) {
  log("WARN", message, data);
}
