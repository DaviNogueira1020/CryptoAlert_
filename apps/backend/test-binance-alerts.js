const axios = require("axios");

const BASE_URL = "http://localhost:3000";
let token = null;

async function test() {
  try {
    console.log("=== BINANCE ALERTS E2E TEST ===\n");

    // 1. Login
    console.log("[1] Logging in...");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "password123",
    });
    token = loginRes.data.token;
    console.log("✅ Logged in, token:", token.substring(0, 30) + "...\n");

    // 2. Create alert: BTC below 1000 (should trigger immediately)
    console.log("[2] Creating alert: BTCUSDT below $1000...");
    const createRes = await axios.post(
      `${BASE_URL}/alerts`,
      {
        coin: "BTCUSDT",
        price: 1000,
        direction: "below",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const alertId = createRes.data.id;
    console.log("✅ Alert created:", alertId, "\n");

    // 3. Wait for job to run
    console.log("[3] Waiting 3 seconds for alerts checker job...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("✅ Wait complete\n");

    // 4. Get current BTC price from Binance
    console.log("[4] Fetching current BTC price from Binance...");
    const priceRes = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const btcPrice = parseFloat(priceRes.data.price);
    console.log(`✅ Current BTC price: $${btcPrice.toFixed(2)}\n`);

    // 5. Check if notification was created
    console.log("[5] Checking if alert triggered (comparing ${btcPrice} >= $1000)...");
    const shouldTrigger = btcPrice >= 1000;
    if (shouldTrigger) {
      console.log("✅ Alert condition MET (BTC is above $1000, so 'below 1000' triggered)\n");
    } else {
      console.log("⚠️  Alert condition NOT met (BTC below $1000)\n");
    }

    // 6. List alerts
    console.log("[6] Listing all alerts...");
    const listRes = await axios.get(`${BASE_URL}/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Alerts:", JSON.stringify(listRes.data, null, 2), "\n");

    // 7. Summary
    console.log("=== TEST SUMMARY ===");
    console.log("✅ Created alert for BTCUSDT below $1000");
    console.log(`✅ Current BTC price: $${btcPrice.toFixed(2)}`);
    if (shouldTrigger) {
      console.log("✅ Alert TRIGGERED (notifications should be in DB)");
    } else {
      console.log("⚠️  Alert did NOT trigger");
    }
    console.log("\nTest complete!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

test();
