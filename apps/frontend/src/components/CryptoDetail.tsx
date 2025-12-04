import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Bell, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
      brl: number;
      eur: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    circulating_supply: number;
    total_supply: number;
  };
  description: {
    en: string;
  };
}

interface CryptoDetailProps {
  coinId: string;
  onBack: () => void;
  onCreateAlert: (coinId: string, coinName: string, currentPrice: number) => void;
}

export function CryptoDetail({ coinId, onBack, onCreateAlert }: CryptoDetailProps) {
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [convertAmount, setConvertAmount] = useState('1');

  const fetchCoinDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch from CoinGecko with detailed market data
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes');
      }

      const data = await response.json();
      setCoin(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching coin details:', err);
      setError(err.message || 'Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinDetails();
  }, [coinId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00B8D4]" />
            Carregando detalhes...
          </div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-[#00B8D4] hover:text-[#00D9FF] mb-6"
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </motion.button>
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error || 'Erro ao carregar detalhes'}
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num);
  };

  const convertedBRL = parseFloat(convertAmount) * coin.market_data.current_price.brl;
  const convertedEUR = parseFloat(convertAmount) * coin.market_data.current_price.eur;

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-[#00B8D4] hover:text-[#00D9FF] mb-6 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </motion.button>

        <motion.div
          className="bg-[#0A0E27] rounded-xl p-8 mb-6 border-2 border-[#00B8D4]/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <motion.img
                src={coin.image.large}
                alt={coin.name}
                className="w-16 h-16"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
              <div>
                <h1 className="text-white text-3xl">{coin.name}</h1>
                <p className="text-gray-400 uppercase">{coin.symbol}</p>
              </div>
            </div>
            <motion.button
              onClick={() => onCreateAlert(coin.id, coin.name, coin.market_data.current_price.usd)}
              className="flex items-center gap-2 px-6 py-3 bg-[#5B52FF] text-white rounded-lg hover:bg-[#4F46E5] transition-colors shadow-lg shadow-[#5B52FF]/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-4 h-4" />
              Criar Alerta
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-black rounded-lg p-6 border border-[#00B8D4]/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 184, 212, 1)' }}
            >
              <div className="text-gray-400 mb-2">Preço Atual (USD)</div>
              <div className="text-white text-2xl">
                {formatPrice(coin.market_data.current_price.usd)}
              </div>
            </motion.div>

            <motion.div
              className="bg-black rounded-lg p-6 border border-[#00B8D4]/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 184, 212, 1)' }}
            >
              <div className="text-gray-400 mb-2">Variação 24h</div>
              <div
                className={`text-2xl flex items-center gap-2 ${
                  coin.market_data.price_change_percentage_24h >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {coin.market_data.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <TrendingDown className="w-6 h-6" />
                )}
                {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
              </div>
            </motion.div>

            <motion.div
              className="bg-black rounded-lg p-6 border border-[#00B8D4]/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 184, 212, 1)' }}
            >
              <div className="text-gray-400 mb-2">Máxima 24h</div>
              <div className="text-white text-2xl">
                {formatPrice(coin.market_data.high_24h.usd)}
              </div>
            </motion.div>

            <motion.div
              className="bg-black rounded-lg p-6 border border-[#00B8D4]/30"
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 184, 212, 1)' }}
            >
              <div className="text-gray-400 mb-2">Mínima 24h</div>
              <div className="text-white text-2xl">
                {formatPrice(coin.market_data.low_24h.usd)}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-black rounded-lg p-6 border border-[#00B8D4]/30"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-gray-400 mb-2">Variação 7d</div>
              <div
                className={`text-xl ${
                  coin.market_data.price_change_percentage_7d >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {coin.market_data.price_change_percentage_7d?.toFixed(2) || 'N/A'}%
              </div>
            </motion.div>

            <motion.div
              className="bg-black rounded-lg p-6 border border-[#00B8D4]/30"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-gray-400 mb-2">Variação 30d</div>
              <div
                className={`text-xl ${
                  coin.market_data.price_change_percentage_30d >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {coin.market_data.price_change_percentage_30d?.toFixed(2) || 'N/A'}%
              </div>
            </motion.div>

            <motion.div
              className="bg-black rounded-lg p-6 border border-[#00B8D4]/30"
              whileHover={{ scale: 1.03 }}
            >
              <div className="text-gray-400 mb-2">Market Cap</div>
              <div className="text-white text-xl">
                ${formatNumber(coin.market_data.market_cap.usd)}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-[#0A0E27] rounded-xl p-6 border-2 border-[#00B8D4]/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-white text-xl mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#00B8D4]" />
              Conversor
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Quantidade de {coin.symbol.toUpperCase()}</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-black text-white rounded-lg border-2 border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
                  min="0"
                  step="any"
                />
              </div>

              <div className="space-y-3">
                <motion.div
                  className="flex justify-between items-center p-4 bg-black rounded-lg border border-[#00B8D4]/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-400">USD</span>
                  <span className="text-white">
                    {formatPrice(parseFloat(convertAmount || '0') * coin.market_data.current_price.usd)}
                  </span>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center p-4 bg-black rounded-lg border border-[#00B8D4]/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-400">BRL (R$)</span>
                  <span className="text-white">
                    R$ {convertedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center p-4 bg-black rounded-lg border border-[#00B8D4]/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-400">EUR (€)</span>
                  <span className="text-white">
                    € {convertedEUR.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-[#0A0E27] rounded-xl p-6 border-2 border-[#00B8D4]/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-white text-xl mb-4">Informações Adicionais</h2>
            <div className="space-y-3">
              <motion.div
                className="flex justify-between items-center p-4 bg-black rounded-lg border border-[#00B8D4]/30"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-gray-400">Volume 24h</span>
                <span className="text-white">${formatNumber(coin.market_data.total_volume.usd)}</span>
              </motion.div>
              <motion.div
                className="flex justify-between items-center p-4 bg-black rounded-lg border border-[#00B8D4]/30"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-gray-400">Oferta Circulante</span>
                <span className="text-white">
                  {formatNumber(coin.market_data.circulating_supply)} {coin.symbol.toUpperCase()}
                </span>
              </motion.div>
              {coin.market_data.total_supply && (
                <motion.div
                  className="flex justify-between items-center p-4 bg-black rounded-lg border border-[#00B8D4]/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-gray-400">Oferta Total</span>
                  <span className="text-white">
                    {formatNumber(coin.market_data.total_supply)} {coin.symbol.toUpperCase()}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {coin.description?.en && (
          <motion.div
            className="bg-[#0A0E27] rounded-xl p-6 mt-6 border-2 border-[#00B8D4]/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-white text-xl mb-4">Sobre {coin.name}</h2>
            <div
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: coin.description.en.split('. ').slice(0, 3).join('. ') + '.' }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
