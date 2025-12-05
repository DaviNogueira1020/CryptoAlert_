"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// Hardcoded list of popular cryptocurrencies with their Binance symbols
const POPULAR_COINS = [
    { id: "bitcoin", symbol: "btc", name: "Bitcoin", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
    { id: "ethereum", symbol: "eth", name: "Ethereum", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
    { id: "binancecoin", symbol: "bnb", name: "Binance Coin", image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
    { id: "ripple", symbol: "xrp", name: "Ripple", image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
    { id: "cardano", symbol: "ada", name: "Cardano", image: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
    { id: "solana", symbol: "sol", name: "Solana", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
    { id: "dogecoin", symbol: "doge", name: "Dogecoin", image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" },
    { id: "polkadot", symbol: "dot", name: "Polkadot", image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png" },
    { id: "litecoin", symbol: "ltc", name: "Litecoin", image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png" },
    { id: "chainlink", symbol: "link", name: "Chainlink", image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png" },
];
// Cache for coin prices (update every 5 minutes)
let coinCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
async function fetchCoinsFromCoinGecko() {
    try {
        const ids = POPULAR_COINS.map(c => c.id).join(",");
        const response = await axios_1.default.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: {
                vs_currency: "usd",
                ids,
                order: "market_cap_desc",
                per_page: 250,
                sparkline: false,
            },
            timeout: 10000,
        });
        return response.data.map((coin) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price || 0,
            price_change_percentage_24h: coin.price_change_percentage_24h || 0,
            market_cap: coin.market_cap || 0,
            total_volume: coin.total_volume || 0,
        }));
    }
    catch (error) {
        console.error("[CoinsRoute] Error fetching from CoinGecko:", error.message);
        throw new Error("Failed to fetch coin data from CoinGecko");
    }
}
// GET /coins - Get list of cryptocurrencies
router.get("/", async (req, res) => {
    try {
        const now = Date.now();
        // Return cached data if still valid
        if (coinCache && (now - lastCacheUpdate) < CACHE_DURATION) {
            return res.json(coinCache);
        }
        // Fetch fresh data
        const coins = await fetchCoinsFromCoinGecko();
        coinCache = coins;
        lastCacheUpdate = now;
        return res.json(coins);
    }
    catch (error) {
        console.error("[CoinsRoute]", error.message);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch coins",
        });
    }
});
exports.default = router;
//# sourceMappingURL=coins.routes.js.map