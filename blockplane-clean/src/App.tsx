


import React, { useEffect, useMemo, useState } from 'react';

import DarkModeToggle from './components/DarkModeToggle';
import ShareBanner from './components/ShareBanner';
import FilterBar from './components/FilterBar';
import MaterialsTable from './components/MaterialsTable';
import StatsHeader from './components/StatsHeader';

import type { Material, Sort } from './lib/types';

// --- data loader ------------------------------------------------------------
async function loadMaterials(): Promise<Material[]> {
  // Prefer public path (/public/data/materials.json). Fallback to module-relative.
  try {
    const r1 = await fetch('/data/materials.json', { cache: 'no-store' });
    if (r1.ok) return (await r1.json()) as Material[];
  } catch {}
  const r2 = await fetch('./data/materials.json', { cache: 'no-store' });
  return (await r2.json()) as Material[];
}

// --- helpers ----------------------------------------------------------------
function normalize(s: string) {
  return (s || '').toLowerCase();
}

function matchesQuery(m: Material, q: string) {
  if (!q) return true;
  const hay = `${m.name} ${m.category} ${m.subtype}`.toLowerCase();
  return hay.includes(q);
}

function unique<T extends string>(arr: T[]): T[] {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

// --- main -------------------------------------------------------------------
export default function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [subtype, setSubtype] = useState('');

  // table sort (defaults)
  const [sort, setSort] = useState<Sort>({ field: 'name', dir: 'asc' });

  // load data
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const rows = await loadMaterials();
        if (active) setMaterials(rows);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // derived options
  const categories = useMemo(
    () => unique(materials.map(m => m.category)),
    [materials]
  );

  const subtypes = useMemo(() => {
    // category-aware subtype narrowing
    const base = category
      ? materials.filter(m => m.category === category)
      : materials;
    return unique(base.map(m => m.subtype));
  }, [materials, category]);

  // filtered rows
  const filtered = useMemo(() => {
    const q = normalize(query);
    return materials
      .filter(m => matchesQuery(m, q))
      .filter(m => (category ? m.category === category : true))
      .filter(m => (subtype ? m.subtype === subtype : true));
  }, [materials, query, category, subtype]);

  // sorted rows
  const sorted = useMemo(() => {
    const s = [...filtered];
    const { field, dir } = sort;
    s.sort((a, b) => {
      const va = (a as any)[field];
      const vb = (b as any)[field];
      if (typeof va === 'number' && typeof vb === 'number') {
        return dir === 'asc' ? va - vb : vb - va;
      }
      return dir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return s;
  }, [filtered, sort]);

  // KPI stats derived from *visible* rows
  const stats = useMemo(() => {
    if (!sorted.length) {
      return {
        totalMaterials: 0,
        avgLifespan: 0,
        topCategory: '—',
        sustainabilityScore: 0,
      };
    }
    const total = sorted.length;
    const avgLifespan =
      sorted.reduce((a, m) => a + (m.lifespan ?? 0), 0) / total;

    // top category by count
    const byCat = new Map<string, number>();
    for (const m of sorted) {
      byCat.set(m.category, (byCat.get(m.category) ?? 0) + 1);
    }
    const topCategory =
      [...byCat.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    // simple sustainability proxy from carbon footprint (lower is better)
    const vals = sorted.map(m => m.carbonFootprint ?? 0);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = Math.max(1, max - min);
    const score =
      100 -
      Math.round(
        (sorted.reduce((acc, v) => acc + (v.carbonFootprint - min) / span, 0) /
          total) *
          100
      );
    const sustainabilityScore = Math.max(0, Math.min(100, score));

    return { totalMaterials: total, avgLifespan, topCategory, sustainabilityScore };
  }, [sorted]);

  // share/export/print actions
  const handleShare = () => {
    navigator.clipboard?.writeText(location.href);
    alert('Link copied to clipboard.');
  };

  const handleExport = async () => {
    // cheap export (export what’s visible)
    const rows = sorted;
    const header = [
      'name',
      'category',
      'subtype',
      'lifespan',
      'carbonFootprint',
      'recyclability',
      'cost',
    ];
    const csv =
      [header.join(',')]
        .concat(
          rows.map(r =>
            [
              r.name,
              r.category,
              r.subtype,
              r.lifespan,
              r.carbonFootprint,
              r.recyclability,
              r.cost,
            ]
              .map(v =>
                String(v ?? '')
                  .replace(/"/g, '""')
                  .replace(/,/g, ';')
              )
              .join(',')
          )
        )
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materials.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100">
      {/* top bar */}
      <header className="print:hidden sticky top-0 z-40 bg-transparent px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">BlockPlane Tailwind OK</h1>
        <DarkModeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* actions */}
        <ShareBanner onShare={handleShare} onExport={handleExport} onPrint={handlePrint} />

        {/* KPIs */}
        <section id="kpis" className="mb-6 print:break-inside-avoid">
          <StatsHeader
            stats={{
              totalMaterials: stats.totalMaterials,
              avgLifespan: stats.avgLifespan,
              topCategory: stats.topCategory,
              sustainabilityScore: stats.sustainabilityScore,
            }}
          />
        </section>

        {/* Filters */}
        <section id="filters" className="mb-4">
          <FilterBar
            searchTerm={query}
            onSearchChange={setQuery}
            category={category}
            onCategoryChange={setCategory}
            subtype={subtype}
            onSubtypeChange={setSubtype}
            categories={categories}
            subtypes={subtypes}
            filteredCount={filtered.length}
            totalCount={materials.length}
            isLoading={loading}
          />
        </section>

        {/* Table */}
        <section id="materials" className="print:break-inside-avoid">
          <MaterialsTable rows={sorted} sort={sort} onSort={setSort} />
        </section>

        {/* print footer */}
        <footer className="hidden print:block mt-12 pt-6 text-center text-xs text-gray-500">
          Generated on {new Date().toLocaleDateString()}
        </footer>
      </main>
    </div>
  );
}

