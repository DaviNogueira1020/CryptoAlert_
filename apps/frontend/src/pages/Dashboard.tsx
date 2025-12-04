import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface DashboardProps {
  onViewDetails?: (coinId: string) => void;
}

export function Dashboard({ onViewDetails }: DashboardProps) {
  const navigate = useNavigate();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const handleViewDetails = (coinId: string) => {
    if (onViewDetails) {
      onViewDetails(coinId);
    } else {
      navigate(`/crypto/${coinId}`);
    }
  };

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Tentar primeiro com a API local
      let data;
      try {
        const response = await fetch(`${API_URL}/coins`);
        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error('Local API retornou erro');
        }
      } catch (localError) {
        // Se falhar, usar CoinGecko diretamente
        console.log('Usando CoinGecko como fallback...');
        const coinIds = 'bitcoin,ethereum,binancecoin,ripple,cardano,solana,dogecoin,polkadot,litecoin,chainlink';
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=250&sparkline=false`
        );
        if (!response.ok) {
          throw new Error('Erro ao buscar dados da CoinGecko');
        }
        data = await response.json();
        
        // Transformar dados do CoinGecko para o formato esperado
        data = data.map((coin: any) => ({
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
      
      setCoins(data);
      setFilteredCoins(data);
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error('Error fetching coins:', err);
      setError(err.message || 'Erro ao carregar cotações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCoins(coins);
    } else {
      const filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCoins(filtered);
    }
  }, [searchTerm, coins]);

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

  return (
    <div className="w-full min-h-screen bg-black py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8 space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-white text-4xl font-bold mb-2">Painel de Cotações</h1>
              <p className="text-gray-400">
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              </p>
            </div>
            <motion.button
              onClick={fetchCoins}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#5B52FF] text-white rounded-lg hover:bg-[#4F46E5] transition-colors disabled:opacity-50 shadow-lg shadow-[#5B52FF]/30 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </motion.button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00B8D4] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar criptomoeda..."
              className="w-full pl-12 pr-4 py-4 bg-[#0A0E27] text-white rounded-lg border-2 border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 mt-6"
          >
            {error}
          </motion.div>
        )}

        {loading && coins.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00B8D4]" />
            Carregando cotações...
          </div>
        ) : (
          <motion.div
            className="mt-10 rounded-xl overflow-hidden border-2 border-[#00B8D4] shadow-lg"
            style={{ backgroundColor: '#0A0E27' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black">
                  <tr>
                    <th className="px-6 py-4 text-left text-white">#</th>
                    <th className="px-6 py-4 text-left text-white">Moeda</th>
                    <th className="px-6 py-4 text-right text-white">Preço</th>
                    <th className="px-6 py-4 text-right text-white">24h</th>
                    <th className="px-6 py-4 text-right text-white">Market Cap</th>
                    <th className="px-6 py-4 text-right text-white">Volume</th>
                    <th className="px-6 py-4 text-right text-white">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#00B8D4]">
                  <AnimatePresence>
                    {filteredCoins.map((coin, index) => (
                      <motion.tr
                        key={coin.id}
                        className="bg-[#0A0E27] hover:bg-[#07121a] transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                            <div>
                              <div className="text-white">{coin.name}</div>
                              <div className="text-gray-400 text-sm uppercase">{coin.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-white">
                          {formatPrice(coin.current_price)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div
                            className={`flex items-center justify-end gap-1 ${
                              coin.price_change_percentage_24h >= 0
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          >
                            {coin.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-300">
                          ${formatNumber(coin.market_cap)}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-300">
                          ${formatNumber(coin.total_volume)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <motion.button
                            onClick={() => handleViewDetails(coin.id)}
                            className="inline-flex items-center gap-1 text-[#00B8D4] hover:text-[#00D9FF] transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            Detalhes
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredCoins.length === 0 && !loading && (
              <div className="text-center text-gray-400 py-12">
                Nenhuma criptomoeda encontrada
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
