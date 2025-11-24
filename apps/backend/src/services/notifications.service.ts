const notificationsModule = require("../modules/notifications/notification.service");
const notificationsRepository = require("../modules/notifications/notifications.repository");

class NotificationsService {
  /**
   * Cria uma notificação.
   * Aceita payloads variados — sempre tenta persistir os campos mínimos (crypto/target/direction).
   */
  async createNotification(payload) {
    const { userId } = payload;

    // se vierem campos de alerta, prefira eles
    const crypto = payload.crypto || payload.alerta?.crypto || null;
    const target = payload.target ?? payload.alerta?.targetPrice ?? null;
    const direction = payload.direction || payload.alerta?.direction || null;

    // Se tivermos os campos mínimos para o modelo Notification usado em CRUD de Alerts, persista-os.
    if (crypto && target != null && direction) {
      // normalize
      const data = {
        userId,
        crypto: String(crypto).toUpperCase(),
        target: Number(target),
        direction,
        title: payload.title ?? null,
        message: payload.message ?? null,
        type: payload.type ?? "alert",
        read: false,
      };

      // usa o repositório para criar — o repositório encapsula o prisma
      return notificationsRepository.create(data);
    }

    // fallback: se o módulo exportar um método criar compatível, tente usá-lo
    if (typeof notificationsModule.criar === "function") {
      return notificationsModule.criar(userId, payload);
    }

    throw new Error("Payload inválido para criação de notificação");
  }
}

module.exports = { NotificationsService };
// TODO: Implementar serviços de notificações

module.exports = {};
