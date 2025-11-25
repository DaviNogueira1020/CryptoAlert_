// Integration test for AlertsChecker (mocking Prisma, Binance and Notifications)
jest.mock("../../src/lib/prisma", () => ({
  alert: {
    findMany: jest.fn(() => Promise.resolve([
      {
        id: "alert1",
        userId: 1,
        crypto: "BTC",
        targetPrice: 100,
        direction: "above",
        notifyOnce: false,
        cooldown: 0,
        initialPrice: null,
        lastTriggeredAt: null,
        isActive: true,
        user: { id: 1, email: "a@b" },
      },
    ])),
    update: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock("../../src/services/binance.service", () => ({
  obterPrecos: jest.fn((symbols) => Promise.resolve({ BTC: 100 })),
}));

const createNotificationMock = jest.fn(() => Promise.resolve());
const NotificationsService = jest.fn().mockImplementation(() => ({ createNotification: createNotificationMock }));
jest.mock("../../src/services/notifications.service", () => ({ NotificationsService, createNotificationMock }));

const { verificarTodosAlertas } = require("../../src/services/alerts-checker.service");

describe("AlertsChecker integration (mocked)", () => {
  test("should call NotificationsService when alert condition met", async () => {
    await verificarTodosAlertas();
    expect(createNotificationMock).toHaveBeenCalled();
  });
});
