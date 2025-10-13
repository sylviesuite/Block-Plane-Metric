import { useEffect, useMemo, useState } from 'react';
import type { Material } from './types';
import MaterialsTable from './components/MaterialsTable';

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch('/data/materials.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setMaterials(json);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load materials');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return materials;
    return materials.filter((m) =>
      [m.name, m.category, m.notes].filter(Boolean).some((v) =>
        String(v).toLowerCase().includes(term)
      )
    );
  }, [materials, q]);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">BlockPlane — Materials Explorer</h1>
        <p className="text-sm text-gray-600">
          LIS/RIS/CPI-ready dataset (starter demo)
        </p>
      </header>
      <div className="mb-3">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search materials…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <MaterialsTable data={filtered} loading={loading} error={error} />
    </main>
  );
}

export default App;
