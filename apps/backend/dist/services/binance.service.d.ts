export {};
/**
 * Fetch price from Binance API
 * @param {string} symbol - e.g., BTCUSDT, ETHUSDT
 * @returns {Promise<number>} price
 */
export declare function obterPreco(symbol: any): Promise<number>;
/**
 * Fetch prices for multiple symbols
 * @param {string[]} symbols - array of symbols
 * @returns {Promise<Object>} { BTCUSDT: 45000, ETHUSDT: 2500, ... }
 */
export declare function obterPrecos(symbols: any): Promise<Record<string, number>>;
//# sourceMappingURL=binance.service.d.ts.map