// Integration tests for Notifications routes (mocked auth and service)
jest.mock("../../src/middlewares/auth.middleware", () => ({
  authMiddleware: (req, res, next) => {
    req.userId = 1;
    next();
  },
}));

jest.mock("../../src/modules/notifications/notification.service", () => ({
  criar: jest.fn((userId, body) => Promise.resolve({ id: "n1", userId, crypto: body.crypto, target: body.target })),
  listar: jest.fn((userId, options) => Promise.resolve({ items: [{ id: "n1", userId, crypto: "BTC" }], total: 1, page: 1, limit: 20 })),
  remover: jest.fn((userId, id) => Promise.resolve()),
  marcarComoLida: jest.fn((userId, id) => Promise.resolve()),
  removerTodas: jest.fn((userId) => Promise.resolve())
}));

const request = require("supertest");
const app = require("../../src/app");

describe("Notifications routes (integration mocked)", () => {
  test("POST /notifications/criar creates a notification", async () => {
    const res = await request(app)
      .post("/notifications/criar")
      .send({ crypto: "BTC", target: 100, direction: "above" })
      .expect(201);

    expect(res.body).toHaveProperty("id");
  });

  test("GET /notifications/listar returns paginated results", async () => {
    const res = await request(app).get("/notifications/listar").expect(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("items");
  });
});
