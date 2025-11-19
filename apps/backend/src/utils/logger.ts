const morgan = require("morgan");
const { env } = require("../config/env");

// Logger para requisições HTTP
const httpLogger = morgan(
  env.NODE_ENV === "production" ? "combined" : "dev"
);

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

module.exports = { httpLogger, log, logError, logInfo, logWarn };
