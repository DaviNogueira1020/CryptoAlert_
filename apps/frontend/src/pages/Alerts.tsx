import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, RefreshCw, Plus, Trash2, TrendingUp, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AlertItem {
  id: string;
  userId: number;
  crypto: string;
  tipo: 'precoAlvo' | 'altaPercentual' | 'quedaPercentual' | 'volume';
  precoAlvo?: number;
  percentualAlta?: number;
  percentualQueda?: number;
  volumeMinimo?: number;
  direction: 'above' | 'below';
  isActive: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  title?: string;
  description?: string;
  alertDate?: string;
  alertTime?: string;
  notificationType?: 'email' | 'sms' | 'push' | 'system';
  priority?: 'normal' | 'alta' | 'critica';
  repetition?: 'once' | 'diario' | 'semanal';
  triggerCount?: number;
  lastTriggeredAt?: string;
}

// Tooltip component
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40 border border-gray-700">
        {text}
      </div>
    </div>
  );
}

export default function Alerts() {
  const [items, setItems] = useState<AlertItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [crypto, setCrypto] = useState('bitcoin');
  const [tipo, setTipo] = useState<'precoAlvo' | 'altaPercentual' | 'quedaPercentual' | 'volume'>('precoAlvo');
  const [precoAlvo, setPrecoAlvo] = useState<number | ''>('');
  const [percentualAlta, setPercentualAlta] = useState<number | ''>('');
  const [percentualQueda, setPercentualQueda] = useState<number | ''>('');
  const [volumeMinimo, setVolumeMinimo] = useState<number | ''>('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [modalError, setModalError] = useState('');
  
  // ✨ Novos campos
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<'normal' | 'alta' | 'critica'>('normal');
  const [notificacao, setNotificacao] = useState<'email' | 'sms' | 'push' | 'system'>('system');
  const [repeticao, setRepeticao] = useState<'once' | 'diario' | 'semanal'>('once');
  const [dataAlerta, setDataAlerta] = useState('');
  const [horaAlerta, setHoraAlerta] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  async function load() {
    setLoading(true);
    setError('');
    try {
      const url = `${API_URL}/alerts/listar?page=${page}&limit=${limit}`;
      const resp = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!resp.ok) throw new Error(`Erro: ${resp.status}`);
      const json = await resp.json();
      setItems(json.data?.resultados ?? []);
      setTotal(json.data?.paginacao?.total ?? 0);
    } catch (err: any) {
      setError(err.message || 'Error loading alerts');
      toast.error('Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setModalError('');
    
    // Validar campos obrigatórios
    let condicio = null;
    if (tipo === 'precoAlvo') {
      condicio = precoAlvo;
      if (!condicio) {
        setModalError('💰 Informe o preço alvo');
        return;
      }
    } else if (tipo === 'altaPercentual') {
      condicio = percentualAlta;
      if (!condicio) {
        setModalError('📈 Informe o percentual de alta');
        return;
      }
    } else if (tipo === 'quedaPercentual') {
      condicio = percentualQueda;
      if (!condicio) {
        setModalError('📉 Informe o percentual de queda');
        return;
      }
    } else if (tipo === 'volume') {
      condicio = volumeMinimo;
      if (!condicio) {
        setModalError('📊 Informe o volume mínimo');
        return;
      }
    }

    try {
      const payload: any = {
        crypto: crypto.toLowerCase(),
        tipo,
        direction,
        title: titulo,
        description: descricao,
        notificationType: notificacao,
        priority: prioridade,
        repetition: repeticao,
      };

      if (dataAlerta) payload.alertDate = new Date(dataAlerta).toISOString();
      if (horaAlerta) payload.alertTime = horaAlerta;

      if (tipo === 'precoAlvo') payload.precoAlvo = Number(precoAlvo);
      else if (tipo === 'altaPercentual') payload.percentualAlta = Number(percentualAlta);
      else if (tipo === 'quedaPercentual') payload.percentualQueda = Number(percentualQueda);
      else if (tipo === 'volume') payload.volumeMinimo = Number(volumeMinimo);

      const resp = await fetch(`${API_URL}/alerts/criar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(json.error || `Error ${resp.status}`);
      }

      toast.success('✨ Alerta criado com sucesso!');
      await load();
      setPrecoAlvo('');
      setPercentualAlta('');
      setPercentualQueda('');
      setVolumeMinimo('');
      setCrypto('bitcoin');
      setDirection('above');
      setTipo('precoAlvo');
      setTitulo('');
      setDescricao('');
      setDataAlerta('');
      setHoraAlerta('');
      setPrioridade('normal');
      setNotificacao('system');
      setRepeticao('once');
      setShowModal(false);
    } catch (err: any) {
      setModalError(err.message || 'Error creating alert');
      toast.error('Erro ao criar alerta');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja remover este alerta?')) return;
    try {
      const resp = await fetch(`${API_URL}/alerts/remover/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      toast.success('🗑️ Alerta removido');
      await load();
    } catch (err: any) {
      setError(err.message || 'Error removing alert');
      toast.error('Erro ao remover alerta');
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const resp = await fetch(`${API_URL}/alerts/${id}/ativar-desativar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ativo: !currentStatus }),
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      toast.success(!currentStatus ? '✅ Alerta ativado' : '⏸️ Alerta desativado');
      await load();
    } catch (err: any) {
      setError(err.message || 'Error toggling alert');
      toast.error('Erro ao atualizar alerta');
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      precoAlvo: 'Preço Alvo',
      altaPercentual: 'Alta de %',
      quedaPercentual: 'Queda de %',
      volume: 'Volume',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      precoAlvo: '💰',
      altaPercentual: '📈',
      quedaPercentual: '📉',
      volume: '📊',
    };
    return icons[type] || '⚠️';
  };

  const getConditionValue = (alert: AlertItem) => {
    if (alert.tipo === 'precoAlvo') return `US$ ${(alert.precoAlvo ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (alert.tipo === 'altaPercentual') return `+${alert.percentualAlta}%`;
    if (alert.tipo === 'quedaPercentual') return `-${alert.percentualQueda}%`;
    if (alert.tipo === 'volume') return `US$ ${(alert.volumeMinimo ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
    return '—';
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-[#0a0e27] to-black py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* HEADER - Seção Principal com forte hierarquia visual */}
        <motion.div
          className="mb-12 space-y-6 mt-8 sm:mt-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#00B8D4]/20 to-[#5B52FF]/10 border border-[#00B8D4]/30">
                  <Bell className="w-8 h-8 text-[#00B8D4]" />
                </div>
                <div>
                  <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black">
                    Meus Alertas
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base mt-1">
                    Monitore seus ativos favoritos em tempo real
                  </p>
                </div>
              </div>
              {/* Estatísticas */}
              {items.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#00B8D4]/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">
                      <span className="font-bold text-white">{items.filter(a => a.isActive).length}</span> ativo
                      {items.filter(a => a.isActive).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">
                      <span className="font-bold text-white">{items.filter(a => !a.isActive).length}</span> desativo
                      {items.filter(a => !a.isActive).length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Botões - Principal bem destacado */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Tooltip text="Atualizar lista de alertas">
                <button
                  onClick={() => load()}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-gray-800/40 border border-gray-700/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-all font-medium"
                  aria-label="Atualizar"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Atualizar</span>
                </button>
              </Tooltip>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-[#00B8D4] via-[#5B52FF] to-[#7C3AED] text-white font-bold rounded-lg hover:from-[#00A3C0] hover:via-[#4F46E5] hover:to-[#6D28D9] transition-all shadow-lg shadow-[#5B52FF]/60 hover:shadow-xl hover:shadow-[#5B52FF]/80 scale-100 hover:scale-105 text-base sm:text-lg border-2 border-[#B5A3FF]"
              >
                <Plus className="w-6 h-6" />
                <span>Novo Alerta</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* MENSAGEM DE ERRO */}
        {error && (
          <motion.div
            className="mb-8 p-4 sm:p-5 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {/* CONTEÚDO */}
        {loading ? (
          <motion.div
            className="text-center py-20 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin inline-block mb-6">
              <RefreshCw className="w-10 h-10 text-[#00B8D4]" />
            </div>
            <p className="text-lg font-medium">Carregando seus alertas...</p>
            <p className="text-sm text-gray-500 mt-2">Isso pode levar alguns instantes</p>
          </motion.div>
        ) : items.length === 0 ? (
          // ESTADO VAZIO COM FEEDBACK VISUAL FORTE
          <motion.div
            className="text-center py-16 sm:py-24 px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="mb-8 sm:mb-10 inline-block p-6 rounded-2xl bg-gradient-to-br from-[#00B8D4]/10 to-[#5B52FF]/10 border border-[#00B8D4]/20 mt-6 sm:mt-8">
              <Bell className="w-16 h-16 text-[#00B8D4] mx-auto" />
            </div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Nenhum alerta criado ainda
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-4">
              Comece a monitorar suas criptomoedas favoritas agora mesmo
            </p>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
              Crie um novo alerta para receber notificações quando o preço atingir seus objetivos, 
              apresentar variações percentuais ou volumes específicos.
            </p>
            <motion.button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00B8D4] to-[#5B52FF] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#5B52FF]/50 transition-all scale-100 hover:scale-105"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Alerta
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* GRADE DE ALERTAS - Otimizada para mobile */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {items.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  className="group relative bg-gradient-to-br from-[#0a1628]/80 via-[#0f0f1e]/60 to-black rounded-xl p-5 sm:p-6 border border-[#00B8D4]/20 hover:border-[#00B8D4]/50 transition-all hover:shadow-lg hover:shadow-[#00B8D4]/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {/* Indicador de status colorido */}
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${alert.isActive ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-600'}`} />

                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-[#00B8D4]/30 to-[#5B52FF]/20 border border-[#00B8D4]/20">
                        <span className="text-xl">{getTypeIcon(alert.tipo)}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-bold text-lg capitalize truncate">
                          {alert.crypto}
                        </h3>
                        <p className="text-[#00B8D4] text-xs font-semibold uppercase tracking-wider">
                          {getTypeLabel(alert.tipo)}
                        </p>
                      </div>
                    </div>
                    <Tooltip text="Remover alerta">
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100"
                        aria-label="Remover alerta"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </Tooltip>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-[#00B8D4]/0 via-[#00B8D4]/20 to-[#00B8D4]/0 mb-4" />

                  {/* Card Body - Valor em destaque */}
                  <div className="space-y-4 mb-5">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">
                        Valor Alvo
                      </p>
                      <p className="text-white font-black text-2xl sm:text-3xl font-mono tracking-tight">
                        {getConditionValue(alert)}
                      </p>
                    </div>

                    {alert.tipo !== 'volume' && (
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-2">
                          Direção do Alerta
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-[#00B8D4]/30 rounded-lg">
                          <span className="text-lg">
                            {alert.direction === 'above' ? '📈' : '📉'}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {alert.direction === 'above' ? 'Acima de' : 'Abaixo de'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-1">
                      Criado há {Math.floor((Date.now() - new Date(alert.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dias
                    </div>
                  </div>

                  {/* Footer - Botão de status bem visível */}
                  <div className="flex gap-2 pt-4 border-t border-[#00B8D4]/10">
                    <Tooltip text={alert.isActive ? 'Desativar alerta' : 'Ativar alerta'}>
                      <button
                        onClick={() => toggleActive(alert.id, alert.isActive)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                          alert.isActive 
                            ? 'bg-green-900/30 border-green-600/50 text-green-300 hover:bg-green-900/50 hover:border-green-500/70' 
                            : 'bg-gray-900/30 border-gray-600/50 text-gray-400 hover:bg-gray-900/50 hover:border-gray-500/70'
                        }`}
                      >
                        {alert.isActive ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Ativo</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>Inativo</span>
                          </>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* PAGINAÇÃO */}
            {total > limit && (
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#00B8D4]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-sm text-gray-400">
                  Total de <span className="text-white font-bold text-lg">{total}</span> alertas
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-black/50 border border-[#00B8D4]/30 hover:border-[#00B8D4]/60 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    ← Anterior
                  </button>
                  <div className="px-4 py-2 bg-black/30 rounded-lg border border-[#00B8D4]/20">
                    <span className="text-white font-bold">Página {page}</span>
                  </div>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={items.length < limit}
                    className="px-4 py-2 bg-black/50 border border-[#00B8D4]/30 hover:border-[#00B8D4]/60 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Próximo →
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* MODAL - CREATE NEW ALERT */}
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-[#0b1020] to-[#05080f] rounded-2xl p-6 sm:p-8 border border-[#00B8D4]/30 max-w-md w-full shadow-2xl shadow-[#00B8D4]/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-black flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#00B8D4]/20 border border-[#00B8D4]/30">
                    <Bell className="w-5 h-5 text-[#00B8D4]" />
                  </div>
                  Novo Alerta
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800/50 rounded"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                {/* Coin ID */}
                <div>
                  <label className="text-white text-sm font-bold block mb-2 flex items-center gap-1.5">
                    ID da Moeda
                    <Tooltip text="Ex: bitcoin, ethereum, cardano">
                      <Info className="w-4 h-4 text-gray-400" />
                    </Tooltip>
                  </label>
                  <input
                    value={crypto}
                    onChange={(e) => setCrypto(e.target.value.toLowerCase())}
                    className="w-full px-4 py-3 bg-black/60 text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4]/70 focus:outline-none transition-colors font-medium text-base placeholder-gray-600"
                    placeholder="bitcoin"
                  />
                </div>

                {/* Alert Type */}
                <div>
                  <label className="text-white text-sm font-bold block mb-2">Tipo de Alerta</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full px-4 py-3 bg-black/60 text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4]/70 focus:outline-none transition-colors font-medium text-base"
                  >
                    <option value="precoAlvo">💰 Preço Alvo</option>
                    <option value="altaPercentual">📈 Alta de %</option>
                    <option value="quedaPercentual">📉 Queda de %</option>
                    <option value="volume">📊 Volume</option>
                  </select>
                </div>

                {/* Direction - hidden for Volume */}
                {tipo !== 'volume' && (
                  <div>
                    <label className="text-white text-sm font-bold block mb-2">Direção</label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as any)}
                      className="w-full px-4 py-3 bg-black/60 text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4]/70 focus:outline-none transition-colors font-medium text-base"
                    >
                      <option value="above">📈 Acima de</option>
                      <option value="below">📉 Abaixo de</option>
                    </select>
                  </div>
                )}

                {/* Conditional fields based on type */}
                {tipo === 'precoAlvo' && (
                  <div>
                    <label className="text-white text-sm font-bold block mb-2">Preço Alvo (USD)</label>
                    <input
                      value={precoAlvo as any}
                      onChange={(e) => setPrecoAlvo(e.target.value === '' ? '' : Number(e.target.value))}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-black/60 text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4]/70 focus:outline-none transition-colors font-medium text-base placeholder-gray-600"
                      placeholder="50000.00"
                    />
                  </div>
                )}

                {tipo === 'altaPercentual' && (
                  <div>
                    <label className="text-white text-sm font-bold block mb-2">Percentual de Alta (%)</label>
                    <input
                      value={percentualAlta as any}
                      onChange={(e) => setPercentualAlta(e.target.value === '' ? '' : Number(e.target.value))}
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-black/60 text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4]/70 focus:outline-none transition-colors font-medium text-base placeholder-gray-600"
                      placeholder="5.50"
                    />
                  </div>
                )}

                {tipo === 'quedaPercentual' && (
                  <div>
                    <label className="text-white text-sm font-bold block mb-2">Percentual de Queda (%)</label>
                    <input
                      value={percentualQueda as any}
                      onChange={(e) => setPercentualQueda(e.target.value === '' ? '' : Number(e.target.value))}
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-black/60 text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4]/70 focus:outline-none transition-colors font-medium text-base placeholder-gray-600"
                      placeholder="5.50"
                    />
                  </div>
                )}

                {tipo === 'volume' && (
                  <div>
                    <label className="text-white text-sm font-bold block mb-2">Volume Mínimo (USD)</label>
                    <input
                      value={volumeMinimo as any}
                      onChange={(e) => setVolumeMinimo(e.target.value === '' ? '' : Number(e.target.value))}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-black/60 text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4]/70 focus:outline-none transition-colors font-medium text-base placeholder-gray-600"
                      placeholder="1000000.00"
                    />
                  </div>
                )}

                {modalError && (
                  <motion.div
                    className="p-3 bg-red-900/30 border border-red-500/50 text-red-200 text-sm rounded-lg flex items-start gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{modalError}</p>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-800/30 border border-gray-700/50 text-white rounded-lg hover:bg-gray-700/50 transition-colors font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00B8D4] to-[#5B52FF] text-white rounded-lg hover:from-[#00A3C0] hover:to-[#4F46E5] transition-all font-bold shadow-lg shadow-[#5B52FF]/40 hover:shadow-[#5B52FF]/60"
                  >
                    Criar Alerta
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

  async function load() {
    setLoading(true);
    setError('');
    try {
      const url = `${API_URL}/alerts/listar?page=${page}&limit=${limit}`;
      const resp = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!resp.ok) throw new Error(`Erro: ${resp.status}`);
      const json = await resp.json();
      setItems(json.data?.resultados ?? []);
      setTotal(json.data?.paginacao?.total ?? 0);
    } catch (err: any) {
      setError(err.message || 'Error loading alerts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setModalError('');
    
    // Validar campos obrigatórios
    let condicio = null;
      if (tipo === 'precoAlvo') {
      condicio = precoAlvo;
      if (!condicio) return setModalError('Target price required');
    } else if (tipo === 'altaPercentual') {
      condicio = percentualAlta;
      if (!condicio) return setModalError('Increase percentage required');
    } else if (tipo === 'quedaPercentual') {
      condicio = percentualQueda;
      if (!condicio) return setModalError('Decrease percentage required');
    } else if (tipo === 'volume') {
      condicio = volumeMinimo;
      if (!condicio) return setModalError('Minimum volume required');
    }

    try {
      const payload: any = {
        crypto: crypto.toLowerCase(),
        tipo,
        direction,
      };

      if (tipo === 'precoAlvo') payload.precoAlvo = Number(precoAlvo);
      else if (tipo === 'altaPercentual') payload.percentualAlta = Number(percentualAlta);
      else if (tipo === 'quedaPercentual') payload.percentualQueda = Number(percentualQueda);
      else if (tipo === 'volume') payload.volumeMinimo = Number(volumeMinimo);

      const resp = await fetch(`${API_URL}/alerts/criar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(json.error || `Error ${resp.status}`);
      }

      await load();
      setPrecoAlvo('');
      setPercentualAlta('');
      setPercentualQueda('');
      setVolumeMinimo('');
      setCrypto('bitcoin');
      setDirection('above');
      setTipo('precoAlvo');
      setShowModal(false);
    } catch (err: any) {
      setModalError(err.message || 'Error creating alert');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove alert?')) return;
    try {
      const resp = await fetch(`${API_URL}/alerts/remover/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      await load();
    } catch (err: any) {
      setError(err.message || 'Error removing alert');
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const resp = await fetch(`${API_URL}/alerts/${id}/ativar-desativar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ativo: !currentStatus }),
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      await load();
    } catch (err: any) {
      setError(err.message || 'Error toggling alert');
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      precoAlvo: 'Target Price',
      altaPercentual: 'Increase %',
      quedaPercentual: 'Decrease %',
      volume: 'Volume',
    };
    return labels[type] || type;
  };

  const getConditionValue = (alert: AlertItem) => {
    if (alert.tipo === 'precoAlvo') return `US$ ${alert.precoAlvo?.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    if (alert.tipo === 'altaPercentual') return `${alert.percentualAlta}%`;
    if (alert.tipo === 'quedaPercentual') return `${alert.percentualQueda}%`;
    if (alert.tipo === 'volume') return `${alert.volumeMinimo?.toLocaleString(undefined)}`;
    return '—';
  };

  const getDirectionLabel = (dir: string) => {
    return dir === 'above' ? 'Above' : 'Below';
  };

  const getStatusColor = (active: boolean) => {
    return active ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="w-full min-h-screen bg-black py-12 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.div
          className="mb-10 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-white text-3xl sm:text-4xl font-bold flex items-center gap-3">
                <Bell className="w-8 h-8 text-[#00B8D4]" />
                Meus Alertas
              </h1>
              <p className="text-gray-400 text-sm mt-1">Gerencie seus alertas de preço</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => load()}
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 text-white rounded-lg transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5B52FF] to-[#7C3AED] text-white font-bold rounded-lg hover:from-[#4F46E5] hover:to-[#6D28D9] transition-all shadow-lg shadow-[#5B52FF]/40"
              >
                <Plus className="w-5 h-5" />
                <span>New Alert</span>
              </button>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="mb-8 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-lg mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* CONTENT */}
        {loading ? (
          <motion.div
            className="text-center py-12 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin inline-block">
              <RefreshCw className="w-8 h-8" />
            </div>
            <p className="mt-4">Loading alerts...</p>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Bell className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No alerts yet</p>
            <p className="text-gray-500 text-sm mt-2">Click "New Alert" to get started</p>
          </motion.div>
        ) : (
          <>
            {/* ALERTS GRID */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {items.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  className="bg-black rounded-xl p-6 sm:p-8 border-2 border-[#00B8D4]/30 hover:border-[#00B8D4]/60 transition-all hover:shadow-lg hover:shadow-[#00B8D4]/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#00B8D4]/20 to-[#00B8D4]/5">
                        <TrendingUp className="w-6 h-6 text-[#00B8D4]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg capitalize">{alert.crypto}</h3>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">{alert.crypto}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-red-400 hover:text-red-300"
                      aria-label="Delete alert"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-3 mb-5 pb-5 border-b border-[#00B8D4]/20">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Alert Type</p>
                      <p className="text-white font-bold text-sm">{getTypeLabel(alert.tipo)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">
                        {alert.tipo === 'precoAlvo' ? 'Target Price' : 
                         alert.tipo === 'altaPercentual' ? 'Increase %' : 
                         alert.tipo === 'quedaPercentual' ? 'Decrease %' : 
                         'Minimum Volume'}
                      </p>
                      <p className="text-white font-black text-2xl font-mono">
                        {getConditionValue(alert)}
                      </p>
                    </div>
                    {alert.tipo !== 'volume' && (
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Direction</p>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-black/60 border border-[#00B8D4]/30 rounded-lg text-sm font-semibold text-white capitalize">
                            {alert.direction === 'above' ? '📈 Above' : '📉 Below'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(alert.id, alert.isActive)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          alert.isActive 
                            ? 'bg-green-900/30 border border-green-600/50 text-green-300 hover:bg-green-900/50' 
                            : 'bg-red-900/30 border border-red-600/50 text-red-300 hover:bg-red-900/50'
                        }`}
                      >
                        {alert.isActive ? '✓ Active' : '✕ Inactive'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* PAGINATION */}
            {total > limit && (
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#00B8D4]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                  <div className="text-sm text-gray-400">
                  Total <span className="text-white font-bold">{total}</span> alerts
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-black/50 border border-[#00B8D4]/30 hover:border-[#00B8D4]/60 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 text-white font-bold">
                    Page {page}
                  </div>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={items.length < limit}
                    className="px-4 py-2 bg-black/50 border border-[#00B8D4]/30 hover:border-[#00B8D4]/60 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* MODAL - CREATE NEW ALERT */}
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-[#0b1020] rounded-2xl p-8 border-2 border-cyan-400 max-w-md w-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-black flex items-center gap-2">
                  <Bell className="w-6 h-6 text-cyan-400" />
                  Criar Novo Alerta
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Coin ID */}
                <div>
                  <label className="text-gray-300 text-sm font-semibold block mb-2">ID da Moeda</label>
                  <input
                    value={crypto}
                    onChange={(e) => setCrypto(e.target.value.toLowerCase())}
                    className="w-full px-4 py-3 bg-black text-white rounded-lg border border-cyan-700 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-base"
                    placeholder="bitcoin"
                  />
                  <p className="text-gray-500 text-xs mt-1">Ex: bitcoin, ethereum, cardano</p>
                </div>

                {/* Coin Name (Display) */}
                <div>
                  <label className="text-gray-300 text-sm font-semibold block mb-2">Nome da Moeda</label>
                  <input
                    value={crypto.charAt(0).toUpperCase() + crypto.slice(1)}
                    readOnly
                    className="w-full px-4 py-3 bg-black text-white rounded-lg border border-cyan-700 font-medium text-base opacity-80"
                  />
                </div>

                {/* Alert Type */}
                <div>
                  <label className="text-gray-300 text-sm font-semibold block mb-2">Condição</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full px-4 py-3 bg-black text-white rounded-lg border border-cyan-700 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-base"
                  >
                    <option value="precoAlvo">Preço Alvo</option>
                    <option value="altaPercentual">Percentual de Alta</option>
                    <option value="quedaPercentual">Percentual de Queda</option>
                    <option value="volume">Volume Mínimo</option>
                  </select>
                </div>

                {/* Direction - hidden for Volume */}
                {tipo !== 'volume' && (
                  <div>
                    <label className="text-gray-300 text-sm font-semibold block mb-2">Direção</label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as any)}
                      className="w-full px-4 py-3 bg-black text-white rounded-lg border border-cyan-700 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-base"
                    >
                      <option value="above">Acima de</option>
                      <option value="below">Abaixo de</option>
                    </select>
                  </div>
                )}

                {/* Conditional fields based on type */}
                {tipo === 'precoAlvo' && (
                  <div>
                    <label className="text-gray-300 text-sm font-semibold block mb-2">Preço Alvo (USD)</label>
                    <input
                      value={precoAlvo as any}
                      onChange={(e) => setPrecoAlvo(e.target.value === '' ? '' : Number(e.target.value))}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-black text-white rounded-lg border border-cyan-700 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-base"
                      placeholder="50000.00"
                    />
                    <p className="text-gray-500 text-xs mt-1">Campo obrigatório para o tipo selecionado</p>
                  </div>
                )}

                {tipo === 'altaPercentual' && (
                  <div>
                    <label className="text-gray-300 text-sm font-semibold block mb-2">Percentual de Alta (%)</label>
                    <input
                      value={percentualAlta as any}
                      onChange={(e) => setPercentualAlta(e.target.value === '' ? '' : Number(e.target.value))}
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-black text-white rounded-lg border border-cyan-700 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-base"
                      placeholder="5.50"
                    />
                    <p className="text-gray-500 text-xs mt-1">Campo obrigatório para o tipo selecionado</p>
                  </div>
                )}

                {tipo === 'quedaPercentual' && (
                  <div>
                    <label className="text-gray-300 text-sm font-semibold block mb-2">Percentual de Queda (%)</label>
                    <input
                      value={percentualQueda as any}
                      onChange={(e) => setPercentualQueda(e.target.value === '' ? '' : Number(e.target.value))}
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 bg-black text-white rounded-lg border border-cyan-700 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-base"
                      placeholder="5.50"
                    />
                    <p className="text-gray-500 text-xs mt-1">Campo obrigatório para o tipo selecionado</p>
                  </div>
                )}

                {tipo === 'volume' && (
                  <div>
                    <label className="text-gray-300 text-sm font-semibold block mb-2">Volume Mínimo (USD)</label>
                    <input
                      value={volumeMinimo as any}
                      onChange={(e) => setVolumeMinimo(e.target.value === '' ? '' : Number(e.target.value))}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-black text-white rounded-lg border border-cyan-700 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-base"
                      placeholder="1000000.00"
                    />
                    <p className="text-gray-500 text-xs mt-1">Campo obrigatório para o tipo selecionado</p>
                  </div>
                )}

                {/* ✨ Novos campos adicionais */}
                <div className="border-t border-cyan-700/30 pt-4 mt-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">⚙️ Configurações Avançadas (Opcional)</p>
                  
                  {/* Título do Alerta */}
                  <div className="mb-3">
                    <label className="text-gray-300 text-xs font-semibold block mb-1">📝 Título do Alerta</label>
                    <input
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full px-3 py-2 bg-black text-white rounded-lg border border-cyan-700/50 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-sm"
                      placeholder="Ex: Bitcoin Breakout"
                    />
                  </div>

                  {/* Descrição */}
                  <div className="mb-3">
                    <label className="text-gray-300 text-xs font-semibold block mb-1">📄 Descrição</label>
                    <textarea
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      className="w-full px-3 py-2 bg-black text-white rounded-lg border border-cyan-700/50 focus:border-cyan-400 focus:outline-none transition-colors font-medium text-sm resize-none"
                      placeholder="Notas sobre este alerta..."
                      rows={2}
                    />
                  </div>

                  {/* Prioridade */}
                  <div className="mb-3">
                    <label className="text-gray-300 text-xs font-semibold block mb-1">⭐ Prioridade</label>
                    <select
                      value={prioridade}
                      onChange={(e) => setPrioridade(e.target.value as any)}
                      className="w-full px-3 py-2 bg-black text-white rounded-lg border border-cyan-700/50 focus:border-cyan-400 focus:outline-none text-sm"
                    >
                      <option value="normal">🟢 Normal</option>
                      <option value="alta">🟠 Alta</option>
                      <option value="critica">🔴 Crítica</option>
                    </select>
                  </div>

                  {/* Tipo de Notificação */}
                  <div className="mb-3">
                    <label className="text-gray-300 text-xs font-semibold block mb-1">🔔 Tipo de Notificação</label>
                    <select
                      value={notificacao}
                      onChange={(e) => setNotificacao(e.target.value as any)}
                      className="w-full px-3 py-2 bg-black text-white rounded-lg border border-cyan-700/50 focus:border-cyan-400 focus:outline-none text-sm"
                    >
                      <option value="system">📱 Sistema</option>
                      <option value="email">📧 Email</option>
                      <option value="sms">💬 SMS</option>
                      <option value="push">🔔 Push</option>
                    </select>
                  </div>

                  {/* Recorrência */}
                  <div className="mb-3">
                    <label className="text-gray-300 text-xs font-semibold block mb-1">🔄 Recorrência</label>
                    <select
                      value={repeticao}
                      onChange={(e) => setRepeticao(e.target.value as any)}
                      className="w-full px-3 py-2 bg-black text-white rounded-lg border border-cyan-700/50 focus:border-cyan-400 focus:outline-none text-sm"
                    >
                      <option value="once">1️⃣ Uma Vez</option>
                      <option value="diario">📅 Diário</option>
                      <option value="semanal">📆 Semanal</option>
                    </select>
                  </div>

                  {/* Data e Hora */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-300 text-xs font-semibold block mb-1">📅 Data</label>
                      <input
                        type="date"
                        value={dataAlerta}
                        onChange={(e) => setDataAlerta(e.target.value)}
                        className="w-full px-3 py-2 bg-black text-white rounded-lg border border-cyan-700/50 focus:border-cyan-400 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs font-semibold block mb-1">⏰ Hora</label>
                      <input
                        type="time"
                        value={horaAlerta}
                        onChange={(e) => setHoraAlerta(e.target.value)}
                        className="w-full px-3 py-2 bg-black text-white rounded-lg border border-cyan-700/50 focus:border-cyan-400 focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {modalError && (
                  <motion.div
                    className="p-3 bg-red-900/30 border border-red-500 text-red-200 text-sm rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {modalError}
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg hover:bg-gray-700/50 transition-colors font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5B52FF] to-[#7C3AED] text-white rounded-lg hover:from-[#4F46E5] hover:to-[#6D28D9] transition-all font-bold shadow-lg shadow-[#5B52FF]/40"
                  >
                    Criar Alerta
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
