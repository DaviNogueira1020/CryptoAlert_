import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TickerCoin {
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export function PriceTicker() {
  const [coins, setCoins] = useState<TickerCoin[]>([]);

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        // First try backend, then fallback to CoinGecko
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await fetch(`${API_URL}/coins`);
          if (response.ok) {
            const data = await response.json();
            setCoins(data.slice(0, 10));
            return;
          }
        } catch (_e) {
          console.log('Backend unavailable, using CoinGecko');
        }

        // Fallback to CoinGecko
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false'
        );

        if (response.ok) {
          const data = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedCoins = data.map((coin: any) => ({
            symbol: coin.symbol.toUpperCase(),
            current_price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h,
          }));
          setCoins(formattedCoins);
        }
      } catch (error) {
        console.error('Error fetching ticker data:', error);
      }
    };

    fetchTopCoins();
    const interval = setInterval(fetchTopCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  if (coins.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: price < 1 ? 4 : 0,
    }).format(price);
  };

  // Duplicar moedas para loop contínuo
  const duplicatedCoins = [...coins, ...coins, ...coins];

  return (
    <div className="bg-[#0A0E27]/80 border-b border-[#00B8D4]/30 overflow-hidden backdrop-blur-md">
      <div className="relative h-10 flex items-center">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{
            x: [0, -100 * coins.length / 3],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedCoins.map((coin, index) => (
            <div
              key={`${coin.symbol}-${index}`}
              className="flex items-center gap-2"
            >
              <span className="text-[#00B8D4] uppercase">{coin.symbol}</span>
              <span className="text-white">{formatPrice(coin.current_price)}</span>
              <span
                className={`text-sm ${
                  coin.price_change_percentage_24h >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
