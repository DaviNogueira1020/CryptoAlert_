import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Alert {
  id: string;
  userId: number;
  crypto: string;
  targetPrice: number;
  direction: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertInput {
  userId: number;
  crypto: string;
  targetPrice: number;
  direction: 'above' | 'below';
}

export const alertsService = {
  getAll: async (userId?: number): Promise<Alert[]> => {
    const { data } = await api.get('/alerts', {
      params: userId ? { userId } : {},
    });
    return data;
  },

  getById: async (id: string): Promise<Alert> => {
    const { data } = await api.get(`/alerts/${id}`);
    return data;
  },

  create: async (alert: CreateAlertInput): Promise<Alert> => {
    const { data } = await api.post('/alerts', alert);
    return data;
  },

  update: async (id: string, updates: Partial<Alert>): Promise<Alert> => {
    const { data } = await api.put(`/alerts/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/alerts/${id}`);
  },
};
