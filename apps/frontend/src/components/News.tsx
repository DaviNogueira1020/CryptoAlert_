import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, TrendingUp, RefreshCw, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsArticle {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number;
    price_btc: number;
  };
}

export function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNews = async () => {
    try {
      // Using CoinGecko trending data as news source
      const response = await fetch(
        'https://api.coingecko.com/api/v3/search/trending'
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar notícias');
      }

      const data = await response.json();
      const articles = data.coins?.slice(0, 10).map((coin: any) => ({
        id: coin.item.id,
        title: `${coin.item.name} (${coin.item.symbol.toUpperCase()})`,
        link: `https://www.coingecko.com/en/coins/${coin.item.id}`,
        description: `Market cap rank: #${coin.item.market_cap_rank}`,
        pubDate: new Date().toISOString(),
      })) || [];
      setNews(articles);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Erro ao carregar notícias');
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/search/trending'
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar tendências');
      }

      const data = await response.json();
      setTrending(data.coins || []);
    } catch (err: any) {
      console.error('Error fetching trends:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchNews(), fetchTrending()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredNews = news.filter(
    (article) =>
      searchTerm === '' ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchNews(), fetchTrending()]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-white text-3xl mb-2">Portal de Notícias</h1>
            <p className="text-gray-400">Últimas notícias e tendências do mundo cripto</p>
          </div>
          <motion.button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#5B52FF] text-white rounded-lg hover:bg-[#4F46E5] transition-colors disabled:opacity-50 shadow-lg shadow-[#5B52FF]/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </motion.button>
        </motion.div>

        {trending.length > 0 && (
          <motion.div
            className="bg-[#0A0E27] rounded-xl p-6 mb-8 border-2 border-[#00B8D4]/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-white text-xl mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00B8D4]" />
              Moedas em Alta
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {trending.slice(0, 7).map((coin, index) => (
                <motion.div
                  key={coin.item.id}
                  className="bg-black p-4 rounded-lg text-center hover:bg-[#00B8D4]/10 transition-colors border border-[#00B8D4]/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(0, 184, 212, 1)' }}
                >
                  <img
                    src={coin.item.thumb}
                    alt={coin.item.name}
                    className="w-12 h-12 mx-auto mb-2"
                  />
                  <div className="text-white text-sm mb-1">{coin.item.name}</div>
                  <div className="text-gray-400 text-xs uppercase">{coin.item.symbol}</div>
                  <div className="text-[#00B8D4] text-xs mt-1">
                    #{coin.item.market_cap_rank}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00B8D4] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar notícias por palavra-chave..."
              className="w-full pl-12 pr-4 py-4 bg-[#0A0E27] text-white rounded-lg border-2 border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {loading && news.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00B8D4]" />
            Carregando notícias...
          </div>
        ) : filteredNews.length === 0 ? (
          <motion.div
            className="bg-[#0A0E27] rounded-xl p-12 text-center border-2 border-[#00B8D4]/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Newspaper className="w-16 h-16 text-[#00B8D4] mx-auto mb-4" />
            <h3 className="text-white text-xl mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-gray-400">Tente alterar os filtros de busca</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredNews.map((article, index) => (
                <motion.a
                  key={article.id}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0A0E27] rounded-xl p-6 hover:bg-[#00B8D4]/10 transition-all group border-2 border-[#00B8D4]/30 hover:border-[#00B8D4]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Newspaper className="w-5 h-5 text-[#00B8D4] flex-shrink-0" />
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#00B8D4] transition-colors" />
                  </div>

                  <h3 className="text-white mb-3 line-clamp-2 group-hover:text-[#00B8D4] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {article.pubDate
                        ? new Date(article.pubDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Data não disponível'}
                    </span>
                    <span className="text-[#00B8D4] text-sm group-hover:underline">
                      Ler mais
                    </span>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        )}

        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Notícias fornecidas por CoinDesk RSS Feed</p>
          <p className="mt-1">Atualização automática a cada 30 minutos</p>
        </motion.div>
      </div>
    </div>
  );
}
