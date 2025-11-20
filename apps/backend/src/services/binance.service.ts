const axios = require("axios");

const BINANCE_API = "https://api.binance.com/api/v3/ticker/price";

/**
 * Fetch price from Binance API
 * @param {string} symbol - e.g., BTCUSDT, ETHUSDT
 * @returns {Promise<number>} price
 */
async function getPrice(symbol: string): Promise<number> {
  try {
    const response = await axios.get(BINANCE_API, {
      params: { symbol },
      timeout: 5000,
    });
    return parseFloat(response.data.price);
  } catch (error: any) {
    console.error(`[Binance] Error fetching ${symbol}:`, error.message);
    throw new Error(`Failed to fetch price for ${symbol}`);
  }
}

/**
 * Fetch prices for multiple symbols
 * @param {string[]} symbols - array of symbols
 * @returns {Promise<Object>} { BTCUSDT: 45000, ETHUSDT: 2500, ... }
 */
async function getPrices(symbols: string[]): Promise<Record<string, number>> {
  if (!symbols || symbols.length === 0) return {};

  try {
    const response = await axios.get(BINANCE_API, {
      timeout: 5000,
    });

    const prices: Record<string, number> = {};
    const data = Array.isArray(response.data) ? response.data : [response.data];

    data.forEach((item: any) => {
      if (symbols.includes(item.symbol)) {
        prices[item.symbol] = parseFloat(item.price);
      }
    });

    return prices;
  } catch (error: any) {
    console.error("[Binance] Error fetching prices:", error.message);
    throw new Error("Failed to fetch prices from Binance");
  }
}

module.exports = { getPrice, getPrices };
