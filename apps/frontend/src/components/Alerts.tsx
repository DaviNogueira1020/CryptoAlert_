import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: string;
}

interface AlertsProps {
  accessToken: string;
}

export function Alerts({ accessToken }: AlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    coinId: '',
    coinName: '',
    targetPrice: '',
    condition: 'above' as 'above' | 'below',
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    try {
      // Carregar alertas do localStorage
      const stored = localStorage.getItem('cryptoAlerts');
      if (stored) {
        setAlerts(JSON.parse(stored));
      }
      setError('');
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
      setError('Erro ao carregar alertas');
    }
  };

  const createAlert = async () => {
    if (!createData.coinId || !createData.coinName || !createData.targetPrice) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      const newAlert: Alert = {
        id: Date.now().toString(),
        coinId: createData.coinId,
        coinName: createData.coinName,
        targetPrice: parseFloat(createData.targetPrice),
        condition: createData.condition,
        active: true,
        createdAt: new Date().toISOString(),
      };

      const updatedAlerts = [...alerts, newAlert];
      setAlerts(updatedAlerts);
      localStorage.setItem('cryptoAlerts', JSON.stringify(updatedAlerts));

      toast.success(`Alerta criado para ${createData.coinName}`);
      setShowCreateModal(false);
      setCreateData({
        coinId: '',
        coinName: '',
        targetPrice: '',
        condition: 'above',
      });
    } catch (err) {
      toast.error('Erro ao criar alerta');
    }
  };

  const deleteAlert = (id: string) => {
    try {
      const updatedAlerts = alerts.filter(alert => alert.id !== id);
      setAlerts(updatedAlerts);
      localStorage.setItem('cryptoAlerts', JSON.stringify(updatedAlerts));
      toast.success('Alerta removido');
    } catch (err) {
      toast.error('Erro ao remover alerta');
    }
  };

  const toggleAlert = (id: string) => {
    try {
      const updatedAlerts = alerts.map(alert =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      );
      setAlerts(updatedAlerts);
      localStorage.setItem('cryptoAlerts', JSON.stringify(updatedAlerts));
      toast.success('Alerta atualizado');
    } catch (err) {
      toast.error('Erro ao atualizar alerta');
    }
  };

  return (
    <div className="min-h-screen bg-black py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-white text-4xl font-bold flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-[#00B8D4]" />
            Meus Alertas
          </h1>
          <p className="text-gray-400">Gerencie seus alertas de preço de criptomoedas</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="mb-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5B52FF] to-[#7C3AED] text-white font-bold rounded-lg hover:from-[#4F46E5] hover:to-[#6D28D9] transition-all shadow-lg shadow-[#5B52FF]/40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Novo Alerta
        </motion.button>

        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-[#0A0E27] rounded-lg border-2 border-[#00B8D4]/30"
          >
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhum alerta criado ainda</p>
            <p className="text-gray-500 text-sm">Clique em "Novo Alerta" para começar</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {alerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#0A0E27] rounded-lg p-6 border-2 border-[#00B8D4]/30 hover:border-[#00B8D4] transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white text-xl font-bold">{alert.coinName}</h3>
                      <p className="text-gray-400 text-sm">{alert.coinId}</p>
                    </div>
                    <motion.button
                      onClick={() => deleteAlert(alert.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Preço Alvo:</span>
                      <span className="text-white font-bold">$ {alert.targetPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Condição:</span>
                      <div className={`flex items-center gap-1 ${alert.condition === 'above' ? 'text-green-400' : 'text-red-400'}`}>
                        {alert.condition === 'above' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-bold">{alert.condition === 'above' ? 'Acima de' : 'Abaixo de'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-[#00B8D4]/20">
                      <span className="text-gray-400 text-sm">Status:</span>
                      <motion.button
                        onClick={() => toggleAlert(alert.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          alert.active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {alert.active ? 'Ativo' : 'Inativo'}
                      </motion.button>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs mt-4">
                    Criado em {new Date(alert.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Modal de Criação */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0E27] rounded-lg p-8 max-w-md w-full border-2 border-[#00B8D4]"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white text-2xl font-bold">Novo Alerta</h2>
                  <motion.button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-bold mb-2">ID da Moeda</label>
                    <input
                      type="text"
                      value={createData.coinId}
                      onChange={(e) => setCreateData({ ...createData, coinId: e.target.value })}
                      placeholder="ex: bitcoin"
                      className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-bold mb-2">Nome da Moeda</label>
                    <input
                      type="text"
                      value={createData.coinName}
                      onChange={(e) => setCreateData({ ...createData, coinName: e.target.value })}
                      placeholder="ex: Bitcoin"
                      className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-bold mb-2">Preço Alvo (USD)</label>
                    <input
                      type="number"
                      value={createData.targetPrice}
                      onChange={(e) => setCreateData({ ...createData, targetPrice: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-bold mb-2">Condição</label>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setCreateData({ ...createData, condition: 'above' })}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                          createData.condition === 'above'
                            ? 'bg-green-500 text-white'
                            : 'bg-[#1a1f35] text-gray-400 border border-[#00B8D4]/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        Acima de ↑
                      </motion.button>
                      <motion.button
                        onClick={() => setCreateData({ ...createData, condition: 'below' })}
                        className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                          createData.condition === 'below'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#1a1f35] text-gray-400 border border-[#00B8D4]/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        Abaixo de ↓
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={createAlert}
                    disabled={loading}
                    className="w-full mt-6 bg-gradient-to-r from-[#5B52FF] to-[#7C3AED] text-white font-bold py-3 rounded-lg hover:from-[#4F46E5] hover:to-[#6D28D9] transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Criando...' : 'Criar Alerta'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
