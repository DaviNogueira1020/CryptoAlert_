import { useState, useCallback } from 'react';
import { alertsService, Alert, CreateAlertInput } from '../services/alertsService';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async (userId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await alertsService.getAll(userId);
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlert = useCallback(async (alert: CreateAlertInput) => {
    try {
      const newAlert = await alertsService.create(alert);
      setAlerts([newAlert, ...alerts]);
      return newAlert;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert');
      throw err;
    }
  }, [alerts]);

  const updateAlert = useCallback(async (id: string, updates: Partial<Alert>) => {
    try {
      const updated = await alertsService.update(id, updates);
      setAlerts(alerts.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update alert');
      throw err;
    }
  }, [alerts]);

  const deleteAlert = useCallback(async (id: string) => {
    try {
      await alertsService.delete(id);
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete alert');
      throw err;
    }
  }, [alerts]);

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
  };
};
