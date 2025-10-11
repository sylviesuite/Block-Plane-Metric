import { useState, useMemo, useEffect } from 'react';

export default function MaterialLibrary() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/materials.sample.csv')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            name: values[0],
            category: values[1],
            unit: values[2],
            embodied_energy_mj_per_unit: parseFloat(values[3]),
            co2_kg_per_unit: parseFloat(values[4]),
            price_usd_per_unit: parseFloat(values[5]),
            source_id: values[6],
            notes: values[7] || ''
          };
        });
        setRows(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load materials:', err);
        setLoading(false);
      });
  }, []);

  const cats = useMemo(() => {
    const s = new Set(rows.map(r => r.category));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter(r => {
      const matchesQ = !query || Object.values(r).join(' ').toLowerCase().includes(query);
      const matchesCat = !cat || r.category === cat;
      return matchesQ && matchesCat;
    });
  }, [rows, q, cat]);

  const downloadCSV = () => {
    const header = ["name","category","unit","embodied_energy_mj_per_unit","co2_kg_per_unit","price_usd_per_unit","source_id","notes"];
    const body = filtered.map(r => header.map(h => r[h]));
    const csv = [header.join(','), ...body.map(row => row.map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materials_preview.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading material library...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Material Library</h2>
      
      <div className="flex gap-3 items-center mb-4">
        <input
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search materials, sources, notes…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select 
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          value={cat} 
          onChange={e => setCat(e.target.value)}
        >
          <option value="">All categories</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={downloadCSV}
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-auto border rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-semibold">Name</th>
              <th className="text-left p-3 font-semibold">Category</th>
              <th className="text-left p-3 font-semibold">Unit</th>
              <th className="text-right p-3 font-semibold">EE (MJ/unit)</th>
              <th className="text-right p-3 font-semibold">CO₂ (kg/unit)</th>
              <th className="text-right p-3 font-semibold">Price ($/unit)</th>
              <th className="text-left p-3 font-semibold">Source</th>
              <th className="text-left p-3 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className={i % 2 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.category}</td>
                <td className="p-3">{r.unit}</td>
                <td className="p-3 text-right">{r.embodied_energy_mj_per_unit}</td>
                <td className="p-3 text-right">{r.co2_kg_per_unit}</td>
                <td className="p-3 text-right">${r.price_usd_per_unit.toFixed(2)}</td>
                <td className="p-3 text-xs text-gray-600">{r.source_id}</td>
                <td className="p-3 text-xs text-gray-600">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        Preview data — illustrative only. Production requires licensed/verified sources. 
        Showing {filtered.length} of {rows.length} materials.
      </p>
    </div>
  );
}
