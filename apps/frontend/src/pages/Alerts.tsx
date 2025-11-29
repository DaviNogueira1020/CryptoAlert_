import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AlertItem {
  id: string;
  userId: number;
  crypto: string;
  targetPrice: number;
  direction: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
}

export default function Alerts() {
  const [items, setItems] = useState<AlertItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [crypto, setCrypto] = useState('BTCUSDT');
  const [price, setPrice] = useState<number | ''>('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function load() {
    setLoading(true);
    setError('');
    try {
      const url = `${API_URL}/alerts?page=${page}&limit=${limit}`;
      const resp = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!resp.ok) throw new Error(`Erro: ${resp.status}`);
      const json = await resp.json();
      // backend returns { items, total, page, limit }
      setItems(json.data?.items ?? json.items ?? []);
      setTotal(json.data?.total ?? json.total ?? 0);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar alertas');
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
    setError('');
    if (!price) return setError('Informe um preço válido');
    try {
      const resp = await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ coin: crypto, price: Number(price), direction }),
      });
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error?.message || j.error || `Erro ${resp.status}`);
      }
      await load();
      setPrice('');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar alerta');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover alerta?')) return;
    try {
      const resp = await fetch(`${API_URL}/alerts/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!resp.ok) throw new Error(`Erro ${resp.status}`);
      await load();
    } catch (err: any) {
      setError(err.message || 'Erro ao remover alerta');
    }
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto text-white">
        <h2 className="text-2xl mb-4">Meus Alerts</h2>

        <form onSubmit={handleCreate} className="flex gap-2 mb-4">
          <input value={crypto} onChange={(e) => setCrypto(e.target.value.toUpperCase())} className="px-3 py-2 rounded bg-[#0A0E27]" />
          <input value={price as any} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" step="0.01" className="px-3 py-2 rounded bg-[#0A0E27]" />
          <select value={direction} onChange={(e) => setDirection(e.target.value as any)} className="px-3 py-2 rounded bg-[#0A0E27]">
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
          <button className="px-4 py-2 bg-[#5B52FF] rounded">Criar</button>
        </form>

        {error && <div className="mb-4 text-red-400">{error}</div>}

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Moeda</th>
                  <th>Preço</th>
                  <th>Direção</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t border-[#222]">
                    <td className="py-2">{it.crypto}</td>
                    <td>{it.targetPrice}</td>
                    <td>{it.direction}</td>
                    <td>
                      <button onClick={() => handleDelete(it.id)} className="text-red-400">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <div>Total: {total}</div>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-[#222] rounded">Anterior</button>
                <div className="px-3 py-1">{page}</div>
                <button onClick={() => setPage((p) => p + 1)} disabled={items.length < limit} className="px-3 py-1 bg-[#222] rounded">Próxima</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
