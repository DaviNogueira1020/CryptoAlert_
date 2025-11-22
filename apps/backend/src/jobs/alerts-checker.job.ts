// Importa o serviço principal que verifica todos os alertas
const { verificarTodosAlertas } = require("../services/alerts-checker.service");

let intervaloAtivo = null;

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
  verificarTodosAlertas().catch((erro) => {
    console.error("[AlertsJob] Erro durante a verificação de alertas:", erro);
  });
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
