import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { alertsService, Alert, CreateAlertInput } from '../services/alertsService';

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Estado do formulário
  const [createData, setCreateData] = useState({
    crypto: '',
    tipo: 'precoAlvo' as const,
    precoAlvo: '',
    direction: 'above' as 'above' | 'below',
    title: '',
    description: '',
    notificationType: 'system' as const,
    priority: 'normal' as const,
    repetition: 'once' as const,
    alertDate: '',
    alertTime: '',
    baseCurrency: 'USDT',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const result = await alertsService.getAll(1, 10);
      setAlerts(Array.isArray(result) ? result : []);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
      setError('Erro ao carregar alertas');
      toast.error('Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    try {
      // Validar campos obrigatórios
      if (!createData.crypto) {
        toast.error('Selecione uma criptomoeda');
        return;
      }

      if (createData.tipo === 'precoAlvo' && !createData.precoAlvo) {
        toast.error('Defina um preço alvo');
        return;
      }

      setLoading(true);

      // Preparar dados para envio
      const alertPayload: CreateAlertInput = {
        crypto: createData.crypto.toUpperCase(),
        tipo: createData.tipo,
        direction: createData.direction,
        title: createData.title || `Alerta ${createData.crypto.toUpperCase()}`,
        description: createData.description,
        notificationType: createData.notificationType,
        priority: createData.priority,
        repetition: createData.repetition,
        baseCurrency: createData.baseCurrency,
      };

      // Adicionar campo específico conforme tipo
      if (createData.tipo === 'precoAlvo' && createData.precoAlvo) {
        alertPayload.precoAlvo = parseFloat(createData.precoAlvo);
      }

      // Adicionar data/hora se fornecidas
      if (createData.alertDate) {
        alertPayload.alertDate = createData.alertDate;
      }
      if (createData.alertTime) {
        alertPayload.alertTime = createData.alertTime;
      }

      const newAlert = await alertsService.create(alertPayload);
      
      setAlerts([newAlert, ...alerts]);
      toast.success(`Alerta criado para ${createData.crypto.toUpperCase()}`);
      
      // Resetar formulário
      setShowCreateModal(false);
      setCreateData({
        crypto: '',
        tipo: 'precoAlvo',
        precoAlvo: '',
        direction: 'above',
        title: '',
        description: '',
        notificationType: 'system',
        priority: 'normal',
        repetition: 'once',
        alertDate: '',
        alertTime: '',
        baseCurrency: 'USDT',
      });
    } catch (err) {
      console.error('Erro ao criar alerta:', err);
      const errorMsg = (err instanceof Error) ? err.message : 'Erro ao criar alerta';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      await alertsService.delete(id);
      setAlerts(alerts.filter(alert => alert.id !== id));
      toast.success('Alerta removido');
    } catch (err) {
      console.error('Erro ao remover alerta:', err);
      toast.error('Erro ao remover alerta');
    }
  };

  const toggleAlert = async (id: string, currentActive: boolean) => {
    try {
      const updated = await alertsService.toggleActive(id, !currentActive);
      setAlerts(alerts.map(a => a.id === id ? updated : a));
      toast.success(`Alerta ${!currentActive ? 'ativado' : 'desativado'}`);
    } catch (err) {
      console.error('Erro ao atualizar alerta:', err);
      toast.error('Erro ao atualizar alerta');
    }
  };

  return (
    <div className="min-h-screen bg-black py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative pt-12"
        >
          <div className="absolute -top-12 left-0 right-0 h-12 bg-black"></div>
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

        <motion.div
          className="mb-8 flex gap-3 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#5B52FF] text-white font-bold rounded-lg hover:bg-[#4F46E5] transition-all shadow-lg shadow-[#5B52FF]/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Novo Alerta
          </motion.button>
        </motion.div>

        {loading && alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-[#0A0E27] rounded-lg border-2 border-[#00B8D4]/30"
          >
            <div className="animate-spin w-12 h-12 border-4 border-[#00B8D4] border-t-[#7C3AED] rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Carregando alertas...</p>
          </motion.div>
        ) : alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-[#0A0E27] rounded-lg border-2 border-[#00B8D4]/30"
          >
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhum alerta criado ainda</p>
            <p className="text-gray-500 text-sm">Clique em &quot;Novo Alerta&quot; para começar</p>
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
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-bold">{alert.crypto}</h3>
                      {alert.title && <p className="text-gray-400 text-sm">{alert.title}</p>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#5B52FF]/20 text-[#9F8FF6]">
                          {alert.tipo}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.priority === 'critica' ? 'bg-red-500/20 text-red-400' :
                          alert.priority === 'alta' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {alert.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-[#1a1f35] rounded"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Deletar alerta"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {alert.targetPrice && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Preço Alvo:</span>
                        <span className="text-white font-bold">$ {alert.targetPrice.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Condição:</span>
                      <div className={`flex items-center gap-1 ${alert.direction === 'above' ? 'text-green-400' : 'text-red-400'}`}>
                        {alert.direction === 'above' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-bold">{alert.direction === 'above' ? 'Acima de' : 'Abaixo de'}</span>
                      </div>
                    </div>

                    {alert.notificationType && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Notificação:</span>
                        <span className="text-white capitalize">{alert.notificationType}</span>
                      </div>
                    )}

                    {alert.repetition && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Repetição:</span>
                        <span className="text-white capitalize">
                          {alert.repetition === 'once' ? 'Uma vez' : 
                           alert.repetition === 'diario' ? 'Diário' : 'Semanal'}
                        </span>
                      </div>
                    )}

                    {alert.triggerCount !== undefined && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Disparos:</span>
                        <span className="text-white font-bold">{alert.triggerCount}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-[#00B8D4]/20">
                      <span className="text-gray-400 text-sm">Status:</span>
                      <motion.button
                        onClick={() => toggleAlert(alert.id, alert.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          alert.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {alert.isActive ? 'Ativo' : 'Inativo'}
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

        {/* Modal de Criação Expandido */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                // Fecha o modal apenas se clicar no overlay (área escura)
                if (e.target === e.currentTarget) {
                  setShowCreateModal(false);
                }
              }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="modal-scrollable-container"
              >
                {/* Header fixo */}
                <div>
                  <h2 className="text-white text-2xl font-bold">Novo Alerta</h2>
                  <motion.button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white hover:bg-[#1a1f35] p-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    title="Fechar (Esc)"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Conteúdo rolável */}
                <div>
                  <div className="space-y-4 p-6">
                  {/* Seção Básica */}
                  <div className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#00B8D4]/20">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#5B52FF] text-white text-xs flex items-center justify-center">1</span>
                      Informações Básicas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-bold mb-2">Criptomoeda *</label>
                        <input
                          type="text"
                          value={createData.crypto}
                          onChange={(e) => setCreateData({ ...createData, crypto: e.target.value })}
                          placeholder="ex: BTC, ETH"
                          className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-bold mb-2">Tipo de Alerta</label>
                        <select
                          value={createData.tipo}
                          onChange={(e) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const newTipo = e.target.value as any;
                            setCreateData({ ...createData, tipo: newTipo });
                          }}
                          className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none cursor-pointer"
                        >
                          <option value="precoAlvo">Preço Alvo</option>
                          <option value="altaPercentual">Alta Percentual</option>
                          <option value="quedaPercentual">Queda Percentual</option>
                          <option value="volume">Volume</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-white text-sm font-bold mb-2">
                          {createData.tipo === 'precoAlvo' ? 'Preço Alvo (USD)' :
                           createData.tipo === 'altaPercentual' ? 'Percentual de Alta' :
                           createData.tipo === 'quedaPercentual' ? 'Percentual de Queda' :
                           'Volume Mínimo'} *
                        </label>
                        <input
                          type="number"
                          value={createData.precoAlvo}
                          onChange={(e) => setCreateData({ ...createData, precoAlvo: e.target.value })}
                          placeholder="0.00"
                          step="0.01"
                          className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm font-bold mb-2">Condição</label>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => setCreateData({ ...createData, direction: 'above' })}
                            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                              createData.direction === 'above'
                                ? 'bg-green-500 text-white'
                                : 'bg-[#1a1f35] text-gray-400 border border-[#00B8D4]/30'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            Acima ↑
                          </motion.button>
                          <motion.button
                            onClick={() => setCreateData({ ...createData, direction: 'below' })}
                            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                              createData.direction === 'below'
                                ? 'bg-red-500 text-white'
                                : 'bg-[#1a1f35] text-gray-400 border border-[#00B8D4]/30'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            Abaixo ↓
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção Avançada (Colapsável) */}
                  <motion.button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full py-3 px-4 bg-[#1a1f35]/50 border border-[#00B8D4]/20 rounded-lg text-white font-bold hover:bg-[#1a1f35]/70 transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#5B52FF] text-white text-xs flex items-center justify-center">2</span>
                      Configurações Avançadas
                    </span>
                    <span className="text-sm">{showAdvanced ? '▼' : '▶'}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#1a1f35]/50 rounded-lg p-4 border border-[#00B8D4]/20 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white text-sm font-bold mb-2">Título</label>
                            <input
                              type="text"
                              value={createData.title}
                              onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                              placeholder="ex: Bitcoin Breakout"
                              className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-white text-sm font-bold mb-2">Prioridade</label>
                            <select
                              value={createData.priority}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onChange={(e) => setCreateData({ ...createData, priority: e.target.value as any })}
                              className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none cursor-pointer"
                            >
                              <option value="normal">Normal</option>
                              <option value="alta">Alta</option>
                              <option value="critica">Crítica</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white text-sm font-bold mb-2">Tipo de Notificação</label>
                            <select
                              value={createData.notificationType}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onChange={(e) => setCreateData({ ...createData, notificationType: e.target.value as any })}
                              className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none cursor-pointer"
                            >
                              <option value="system">Sistema</option>
                              <option value="email">Email</option>
                              <option value="sms">SMS</option>
                              <option value="push">Push</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-white text-sm font-bold mb-2">Repetição</label>
                            <select
                              value={createData.repetition}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              onChange={(e) => setCreateData({ ...createData, repetition: e.target.value as any })}
                              className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none cursor-pointer"
                            >
                              <option value="once">Uma vez</option>
                              <option value="diario">Diariamente</option>
                              <option value="semanal">Semanalmente</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-white text-sm font-bold mb-2">Descrição</label>
                          <textarea
                            value={createData.description}
                            onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                            placeholder="Descrição opcional do alerta"
                            rows={3}
                            className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white text-sm font-bold mb-2">Data</label>
                            <input
                              type="date"
                              value={createData.alertDate}
                              onChange={(e) => setCreateData({ ...createData, alertDate: e.target.value })}
                              className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-white text-sm font-bold mb-2">Hora</label>
                            <input
                              type="time"
                              value={createData.alertTime}
                              onChange={(e) => setCreateData({ ...createData, alertTime: e.target.value })}
                              className="w-full px-4 py-2 bg-[#1a1f35] text-white rounded-lg border border-[#00B8D4]/30 focus:border-[#00B8D4] focus:outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                </div>

                {/* Footer fixo */}
                <div>
                  <motion.button
                    onClick={() => setShowCreateModal(false)}
                    className="py-3 px-4 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: 'calc(50% - 6px)', display: 'inline-block' }}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={createAlert}
                    disabled={loading}
                    className="py-3 px-4 bg-gradient-to-r from-[#5B52FF] to-[#7C3AED] text-white font-bold rounded-lg hover:from-[#4F46E5] hover:to-[#6D28D9] transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ width: 'calc(50% - 6px)', display: 'inline-block', marginLeft: '12px' }}
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

