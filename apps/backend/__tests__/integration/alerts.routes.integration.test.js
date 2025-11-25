// Integration tests for Alerts routes (mocked auth and service)
jest.mock("../../src/middlewares/auth.middleware", () => ({
  authMiddleware: (req, res, next) => {
    req.userId = 1;
    next();
  },
}));

jest.mock("../../src/modules/alerts/alerts.service", () => ({
  criarAlerta: jest.fn((userId, body) =>
    Promise.resolve({ id: "a1", userId, crypto: body.coin, targetPrice: Number(body.price), direction: body.direction })
  ),
  listarAlertas: jest.fn((userId) => Promise.resolve([{ id: "a1", userId, crypto: "BTC", targetPrice: 100 }]))
}));

const request = require("supertest");
const app = require("../../src/app");

describe("Alerts routes (integration mocked)", () => {
  test("POST /alerts creates an alert", async () => {
    const res = await request(app)
      .post("/alerts")
      .send({ coin: "BTC", price: 100, direction: "above" })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toMatchObject({ crypto: "BTC", targetPrice: 100, direction: "above" });
  });

  test("GET /alerts lists alerts", async () => {
    const res = await request(app).get("/alerts").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("id");
  });
});
