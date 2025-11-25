// Importa o serviço principal que verifica todos os alertas
const { verificarTodosAlertas } = require("../services/alerts-checker.service");

let intervaloAtivo = null;
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = Number(process.env.ALERTS_MAX_CONSECUTIVE_ERRORS || 5);
const RETRY_ATTEMPTS = Number(process.env.ALERTS_RETRY_ATTEMPTS || 2);
const RETRY_DELAY_MS = Number(process.env.ALERTS_RETRY_DELAY_MS || 2000);

/**
 * Inicia o job que verifica alertas periodicamente.
 * @param {number} intervaloMs - Tempo entre verificações (padrão: 60s)
 */
function iniciarJobAlertas(intervaloMs = 60000) {
  if (intervaloAtivo) {
    console.warn("[AlertsJob] O job já está rodando. Ignorando nova inicialização.");
    return;
  }

  console.log(
    `[AlertsJob] Job iniciado. Verificando alertas a cada ${(intervaloMs / 1000)} segundos...`
  );

  // Executa uma verificação imediata
  executarVerificacao();

  // Liga o loop
  intervaloAtivo = setInterval(() => executarVerificacao(), intervaloMs);
}

/**
 * Executa a verificação em si com tratamento de erros.
 */
function executarVerificacao() {
  // tenta com retries simples
  (async () => {
    for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt++) {
      try {
        await verificarTodosAlertas();
        // sucesso -> reset contador de erros
        consecutiveErrors = 0;
        return;
      } catch (erro) {
        consecutiveErrors++;
        const { logError, logInfo } = require("../utils/logger");
        logError(`[AlertsJob] Erro na verificação de alertas (attempt ${attempt}):`, erro);
        if (attempt < RETRY_ATTEMPTS) {
          logInfo(`[AlertsJob] Retry em ${RETRY_DELAY_MS}ms`);
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }

    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
      const { logError } = require("../utils/logger");
      logError(`[AlertsJob] Número máximo de erros consecutivos atingido (${consecutiveErrors}). Parando o job para investigação.`, new Error("Max consecutive errors"));
      if (intervaloAtivo) {
        clearInterval(intervaloAtivo);
        intervaloAtivo = null;
      }
    }
  })();
}

/**
 * Para o job de alertas.
 */
function pararJobAlertas() {
  if (!intervaloAtivo) {
    console.warn("[AlertsJob] Não há job ativo para parar.");
    return;
  }

  clearInterval(intervaloAtivo);
  intervaloAtivo = null;

  console.log("[AlertsJob] Job de alertas foi parado.");
}

// Exportações em PT-BR + aliases legados (backwards compatibility)
module.exports = {
  iniciarJobAlertas,
  pararJobAlertas,
  startAlertsJob: iniciarJobAlertas,
  stopAlertsJob: pararJobAlertas,
};
