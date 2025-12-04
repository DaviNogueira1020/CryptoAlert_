import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoDetailProps {
  coinId?: string;
  onBack?: () => void;
}

export function CryptoDetail({ coinId: propCoinId, onBack: propOnBack }: CryptoDetailProps) {
  const { coinId: paramCoinId } = useParams();
  const navigate = useNavigate();
  
  const coinId = paramCoinId || propCoinId || '';
  const onBack = propOnBack || (() => navigate('/dashboard'));

  const [coin, setCoin] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!coinId) {
        setError('Moeda não especificada');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`);
        if (!res.ok) throw new Error('Falha ao buscar detalhes');
        const data = await res.json();
        setCoin(data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching coin details:', err);
        setError(err.message || 'Falha ao carregar detalhes');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [coinId]);

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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black py-12 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-[#00B8D4] hover:text-[#00D9FF] mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl">Carregando detalhes...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="w-full min-h-screen bg-black py-12 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-[#00B8D4] hover:text-[#00D9FF] mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-6 rounded-lg text-center">
            {error || 'Falha ao carregar detalhes'}
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = coin.market_data?.current_price?.usd || 0;
  const priceChange24h = coin.market_data?.price_change_percentage_24h || 0;
  const marketCap = coin.market_data?.market_cap?.usd || 0;
  const volume24h = coin.market_data?.total_volume?.usd || 0;

  return (
    <div className="w-full min-h-screen bg-black py-12 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Voltar */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-[#00B8D4] hover:text-[#00D9FF] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        {/* Header */}
        <div className="bg-[#0A0E27] rounded-xl p-6 border-2 border-[#00B8D4]/30 mb-8">
          <div className="flex items-center gap-4">
            {coin.image?.large && (
              <img src={coin.image.large} alt={coin.name} className="w-20 h-20 rounded-full" />
            )}
            <div>
              <h1 className="text-white text-4xl font-bold">{coin.name}</h1>
              <p className="text-gray-400 text-lg">
                {coin.symbol?.toUpperCase()} • Rank #{coin.market_cap_rank}
              </p>
            </div>
          </div>
        </div>

        {/* Preço */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#0A0E27] rounded-xl p-8 border-2 border-[#00B8D4]/30">
            <div className="text-gray-400 text-sm uppercase mb-3">Preço Atual</div>
            <div className="text-white text-5xl font-bold mb-4">{formatPrice(currentPrice)}</div>
            <div className={`flex items-center gap-2 text-xl font-bold ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange24h >= 0 ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
              {Math.abs(priceChange24h).toFixed(2)}% (24h)
            </div>
          </div>

          <div className="bg-[#0A0E27] rounded-xl p-8 border-2 border-[#00B8D4]/30">
            <div className="space-y-4">
              <div>
                <div className="text-gray-400 text-sm uppercase mb-1">Market Cap</div>
                <div className="text-white text-2xl font-bold">${formatNumber(marketCap)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm uppercase mb-1">Volume (24h)</div>
                <div className="text-white text-2xl font-bold">${formatNumber(volume24h)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0A0E27] rounded-xl p-6 border-2 border-[#00B8D4]/30">
            <div className="text-gray-400 text-sm uppercase mb-2">Supply em Circulação</div>
            <div className="text-white text-xl font-bold">
              {coin.market_data?.circulating_supply
                ? formatNumber(coin.market_data.circulating_supply)
                : '—'}
            </div>
          </div>
          <div className="bg-[#0A0E27] rounded-xl p-6 border-2 border-[#00B8D4]/30">
            <div className="text-gray-400 text-sm uppercase mb-2">Supply Total</div>
            <div className="text-white text-xl font-bold">
              {coin.market_data?.total_supply
                ? formatNumber(coin.market_data.total_supply)
                : '—'}
            </div>
          </div>
          <div className="bg-[#0A0E27] rounded-xl p-6 border-2 border-[#00B8D4]/30">
            <div className="text-gray-400 text-sm uppercase mb-2">ATH</div>
            <div className="text-white text-xl font-bold">
              {coin.market_data?.ath?.usd ? formatPrice(coin.market_data.ath.usd) : '—'}
            </div>
          </div>
        </div>

        {/* Descrição */}
        {coin.description?.en && (
          <div className="bg-[#0A0E27] rounded-xl p-6 border-2 border-[#00B8D4]/30">
            <h2 className="text-white text-2xl font-bold mb-4">Sobre {coin.name}</h2>
            <div
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.slice(0, 500),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
