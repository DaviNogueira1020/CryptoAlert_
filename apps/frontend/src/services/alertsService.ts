import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Backend routes are exposed at the root (e.g. /alerts). Do not append
// a `/api` prefix here — keep baseURL pointing to the backend host.
const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Novo tipo de alerta com suporte ao CRUD completo
export interface Alert {
  id: string;
  userId: number;
  crypto: string;
  targetPrice?: number;
  direction: 'above' | 'below';
  tipo: 'precoAlvo' | 'altaPercentual' | 'quedaPercentual' | 'volume';
  isActive: boolean;
  
  // Campos avançados
  title?: string;
  description?: string;
  notificationType: 'email' | 'sms' | 'push' | 'system';
  priority: 'normal' | 'alta' | 'critica';
  repetition: 'once' | 'diario' | 'semanal';
  
  // Data e Hora
  alertDate?: string;
  alertTime?: string;
  
  // Campos adicionais
  baseCurrency?: string;
  percentualAlta?: number;
  percentualQueda?: number;
  volumeMinimo?: number;
  triggerCount?: number;
  lastTriggeredAt?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertInput {
  crypto: string;
  tipo?: 'precoAlvo' | 'altaPercentual' | 'quedaPercentual' | 'volume';
  
  // Condições
  precoAlvo?: number;
  percentualAlta?: number;
  percentualQueda?: number;
  volumeMinimo?: number;
  
  direction?: 'above' | 'below';
  
  // Campos avançados
  title?: string;
  description?: string;
  notificationType?: 'email' | 'sms' | 'push' | 'system';
  priority?: 'normal' | 'alta' | 'critica';
  repetition?: 'once' | 'diario' | 'semanal';
  
  // Data e Hora
  alertDate?: string;
  alertTime?: string;
  
  isActive?: boolean;
  baseCurrency?: string;
}

export interface UpdateAlertInput {
  crypto?: string;
  tipo?: 'precoAlvo' | 'altaPercentual' | 'quedaPercentual' | 'volume';
  precoAlvo?: number;
  percentualAlta?: number;
  percentualQueda?: number;
  volumeMinimo?: number;
  direction?: 'above' | 'below';
  alertDate?: string;
  alertTime?: string;
  notificationType?: 'email' | 'sms' | 'push' | 'system';
  priority?: 'normal' | 'alta' | 'critica';
  repetition?: 'once' | 'diario' | 'semanal';
  title?: string;
  description?: string;
  isActive?: boolean;
  baseCurrency?: string;
}

export const alertsService = {
  // Listar alertas com paginação e filtros
  getAll: async (page = 1, limit = 10): Promise<{ alerts: Alert[], total: number }> => {
    const { data } = await api.get('/alerts/listar', {
      params: { page, limit },
    });
    return data;
  },

  // Listar com filtros avançados
  getAllFiltered: async (filters?: any): Promise<Alert[]> => {
    const { data } = await api.get('/alerts/listar', {
      params: filters || {},
    });
    return data.alerts || data;
  },

  getById: async (id: string): Promise<Alert> => {
    const { data } = await api.get(`/alerts/${id}`);
    return data.data || data;
  },

  // Criar novo alerta (PUT -> novo endpoint)
  create: async (alert: CreateAlertInput): Promise<Alert> => {
    const { data } = await api.post('/alerts/criar', alert);
    return data.data || data;
  },

  // Atualizar alerta existente
  update: async (id: string, updates: UpdateAlertInput): Promise<Alert> => {
    const { data } = await api.put(`/alerts/atualizar/${id}`, updates);
    return data.data || data;
  },

  // Deletar alerta
  delete: async (id: string): Promise<void> => {
    await api.delete(`/alerts/remover/${id}`);
  },

  // Ativar/desativar alerta
  toggleActive: async (id: string, ativo: boolean): Promise<Alert> => {
    const { data } = await api.patch(`/alerts/${id}/ativar-desativar`, { ativo });
    return data.data || data;
  },

  // Duplicar alerta
  duplicate: async (id: string): Promise<Alert> => {
    const { data } = await api.post(`/alerts/${id}/duplicar`);
    return data.data || data;
  },

  // Exportar alertas
  export: async (formato: 'json' | 'csv' = 'json'): Promise<any> => {
    const { data } = await api.get(`/alerts/exportar/alertas`, {
      params: { formato },
    });
    return data;
  },
};
