const axios = require("axios");

const BINANCE_API = "https://api.binance.com/api/v3/ticker/price";

/**
 * Fetch price from Binance API
 * @param {string} symbol - e.g., BTCUSDT, ETHUSDT
 * @returns {Promise<number>} price
 */
async function obterPreco(symbol) {
  try {
    const response = await axios.get(BINANCE_API, {
      params: { symbol },
      timeout: 5000,
    });
    return parseFloat(response.data.price);
  } catch (error: any) {
    console.error(`[Binance] Erro ao buscar ${symbol}:`, error && error.message ? error.message : error);
    throw new Error(`Falha ao obter preço para ${symbol}`);
  }
}

/**
 * Fetch prices for multiple symbols
 * @param {string[]} symbols - array of symbols
 * @returns {Promise<Object>} { BTCUSDT: 45000, ETHUSDT: 2500, ... }
 */
async function obterPrecos(symbols) {
  if (!symbols || symbols.length === 0) return {};

  try {
    // Normalize requested symbols to uppercase
    const wanted = symbols.map((s) => String(s).toUpperCase());

    const response = await axios.get(BINANCE_API, { timeout: 5000 });
    const prices: Record<string, number> = {};
    const data = Array.isArray(response.data) ? response.data : [response.data];

    data.forEach((item: any) => {
      const sym = item && item.symbol ? String(item.symbol).toUpperCase() : null;
      if (sym && wanted.includes(sym)) {
        prices[sym] = parseFloat(item.price);
      }
    });

    return prices;
  } catch (error: any) {
    console.error("[Binance] Erro ao buscar preços:", error && error.message ? error.message : error);
    // Retorna mapa vazio em caso de erro para que o verificador continue funcionando
    return {};
  }
}

// Aliases legados para compatibilidade
module.exports = {
  obterPreco,
  obterPrecos,
  getPrice: obterPreco,
  getPrices: obterPrecos,
};
