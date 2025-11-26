import prisma from "../lib/prisma";
import { NotificationsService } from "./notifications.service";
import { obterPrecos } from "./binance.service";
const { logInfo, logWarn, logError } = require("../utils/logger");

const notifications = new NotificationsService();

/**
 * Verifica todos os alertas ativos
 */
export async function verificarTodosAlertas() {
  try {
    console.log("[AlertsChecker] Iniciando verificação de alertas...");

    const alertas = await prisma.alert.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    if (alertas.length === 0) {
      logInfo("[AlertsChecker] Nenhum alerta ativo");
      return;
    }

    const symbols = [...new Set(alertas.map((a) => a.crypto))];
    const prices = await obterPrecos(symbols);

    for (const alerta of alertas) {
      const precoAtual = prices[alerta.crypto];

      if (!precoAtual) {
        console.warn(`[AlertsChecker] Sem preço para ${alerta.crypto}`);
        continue;
      }

      // Atualiza initialPrice caso ainda não exista
      if (alerta.initialPrice == null) {
        try {
          await prisma.alert.update({ where: { id: alerta.id }, data: { initialPrice: precoAtual } });
        } catch (e: any) {
          logWarn(`[AlertsChecker] Falha ao setar initialPrice para ${alerta.id}: ${e.message}`);
        }
      }

      // Determine cooldown in seconds: prefer cooldownMinutes if available
      const cooldownSeconds = alerta.cooldownMinutes != null ? Number(alerta.cooldownMinutes) * 60 : (alerta.cooldown ? Number(alerta.cooldown) : 0);

      // Respeitar cooldown: se lastTriggeredAt for recente (< cooldownSeconds), pula
      if (alerta.lastTriggeredAt && cooldownSeconds) {
        const elapsedMs = Date.now() - new Date(alerta.lastTriggeredAt).getTime();
        if (elapsedMs < cooldownSeconds * 1000) {
          continue;
        }
      }

      // Se notifyOnce e já foi disparado antes, pular
      if (alerta.notifyOnce && alerta.lastTriggeredAt) {
        continue;
      }

      const condicaoAtendida = checarCondicaoAlerta(alerta, precoAtual);

      if (condicaoAtendida) {
        logInfo(`[AlertsChecker] Alerta disparado para ${alerta.crypto}`);

        await criarNotificacao(alerta, precoAtual);

        // Atualiza lastTriggeredAt e desativa se notifyOnce
        try {
          await prisma.alert.update({
            where: { id: alerta.id },
            data: {
              lastTriggeredAt: new Date(),
              isActive: alerta.notifyOnce ? false : alerta.isActive,
            },
          });
        } catch (e: any) {
          logError(`[AlertsChecker] Falha ao atualizar alerta ${alerta.id}: ${e.message}`, e);
        }
      }
    }
  } catch (err: any) {
    console.error("[AlertsChecker] Erro:", err);
  }
}

/**
 * Lógica da condição: acima/abaixo
 */
export function checarCondicaoAlerta(alerta, precoAtual) {
  if (alerta.direction === "above") return precoAtual >= alerta.targetPrice;
  if (alerta.direction === "below") return precoAtual <= alerta.targetPrice;
  return false;
}

/**
 * Cria notificação usando o novo módulo notifications.service
 */
async function criarNotificacao(alerta, precoAtual) {
  try {
    // Envia um payload rico para o serviço de notifications — o service decidirá quais campos persistir
    await notifications.createNotification({
      userId: alerta.userId,
      crypto: alerta.crypto,
      target: alerta.targetPrice,
      direction: alerta.direction,
      title: `Alerta disparado: ${alerta.crypto}`,
      message: `O preço atingiu ${precoAtual} (${alerta.direction} ${alerta.targetPrice})`,
      type: "alert",
    });

    console.log(`[AlertsChecker] Notificação criada para ${alerta.userId}`);
  } catch (err) {
    console.error("[AlertsChecker] Erro ao criar notificação:", err);
  }
}

export const checkAllAlerts = verificarTodosAlertas;
export const checkAlertCondition = checarCondicaoAlerta;
export const createNotification = criarNotificacao;
