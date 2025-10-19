import { useEffect, useMemo, useState } from "react";
import type { Material } from "../types";
import { loadMaterials } from "../lib/loadMaterials";
import { MaterialFilters } from "../components/controls/MaterialFilters";
import { LifecycleBar, type PhaseKey } from "../components/charts/LifecycleBar";
import { formatNumber } from "../lib/formatters";
import { CompareModal } from "../components/CompareModal";

export default function LifecycleBreakdown() {
  const [all, setAll] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [materialType, setMaterialType] = useState<string>("All");
  const [comparisonView, setComparisonView] = useState<"single" | "compare2" | "compareSet">("single");
  const [query, setQuery] = useState("");
  const [sharedScale, setSharedScale] = useState(false);

  const [highlightPhase, setHighlightPhase] = useState<PhaseKey | null>(null);

  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);

  const [selectedSet, setSelectedSet] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await loadMaterials();
        if (!cancelled) setAll(rows);
      } catch (e:any) {
        if (!cancelled) setError(e?.message || "Failed to load materials.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const data = useMemo(() => {
    let rows = all;
    if (materialType !== "All") rows = rows.filter(d => d.materialType === materialType);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.materialType.toLowerCase().includes(q) ||
        (d.sourceRegion ?? "").toLowerCase().includes(q)
      );
    }
    return rows;
  }, [all, materialType, query]);

  const xDomain = useMemo<[number, number] | undefined>(() => {
    if (!sharedScale || data.length === 0) return undefined;
    const max = Math.max(...data.map(d => d.total));
    return [0, Math.max(1, Math.ceil(max))];
  }, [sharedScale, data]);

  const left = leftId ? data.find(d => d.id === leftId) ?? null : null;
  const right = rightId ? data.find(d => d.id === rightId) ?? null : null;

  const toggleSelect = (id: string) =>
    setSelectedSet((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedItems = useMemo(
    () => data.filter(d => selectedSet[d.id]),
    [data, selectedSet]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/70 border-b border-emerald-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-emerald-800 dark:text-emerald-300">
            Lifecycle Breakdown
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Visualizing impact from <span className="font-medium text-emerald-700 dark:text-emerald-300">Point of Origin</span> to <span className="font-medium text-rose-600 dark:text-rose-400">Disposal</span>.
          </p>

          <div className="mt-4">
            <MaterialFilters
              materialType={materialType}
              setMaterialType={setMaterialType}
              comparisonView={comparisonView}
              setComparisonView={(v) => {
                setComparisonView(v);
                if (v === "compare2") setSharedScale(true); // default on in compare2
              }}
              query={query}
              setQuery={setQuery}
              sharedScale={sharedScale}
              setSharedScale={setSharedScale}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {loading && <div className="text-slate-600 dark:text-slate-300">Loading…</div>}
        {!loading && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {comparisonView === "compare2" && (
              <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="flex flex-col">
                  <span className="mb-1 text-xs text-slate-600">Left material</span>
                  <select
                    value={leftId ?? ""}
                    onChange={(e) => setLeftId(e.target.value || null)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                  >
                    <option value="">— Select —</option>
                    {data.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="mb-1 text-xs text-slate-600">Right material</span>
                  <select
                    value={rightId ?? ""}
                    onChange={(e) => setRightId(e.target.value || null)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                  >
                    <option value="">— Select —</option>
                    {data.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </label>
              </div>
            )}

            {data.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center text-slate-500 dark:text-slate-300">
                No materials match your filters.
              </div>
            ) : comparisonView === "compare2" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[left, right].map((d, i) => (
                  <article key={i} className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-5">
                    {d ? (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold">{d.name}</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              {d.materialType}{d.sourceRegion ? ` · ${d.sourceRegion}` : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Total</p>
                            <p className="text-sm font-semibold">
                              {formatNumber(d.total)} {d.meta?.unit ?? ""}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <LifecycleBar datum={d} xDomain={xDomain} highlightPhase={highlightPhase} onPhaseHover={setHighlightPhase} />
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-500">Select a material above.</div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((d) => (
                  <article
                    key={d.id}
                    className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-emerald-100/40 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{d.name}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {d.materialType}{d.sourceRegion ? ` · ${d.sourceRegion}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Total</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {formatNumber(d.total)} {d.meta?.unit ?? ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <LifecycleBar
                        datum={d}
                        xDomain={xDomain}
                        highlightPhase={highlightPhase}
                        onPhaseHover={setHighlightPhase}
                      />
                    </div>

                    {comparisonView === "compareSet" && (
                      <label className="mt-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={!!selectedSet[d.id]}
                          onChange={() => toggleSelect(d.id)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        Include in comparison set
                      </label>
                    )}
                  </article>
                ))}
              </div>
            )}

            {comparisonView === "compareSet" && selectedItems.length > 0 && (
              <div className="sticky bottom-4 mt-8 mx-auto max-w-7xl">
                <div className="rounded-2xl bg-emerald-600 text-white px-5 py-3 shadow-lg flex items-center justify-between">
                  <span className="text-sm">
                    Selected: <strong>{selectedItems.length}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="rounded-xl bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25"
                    >
                      Compare {selectedItems.length} →
                    </button>
                    <button
                      onClick={() => setSelectedSet({})}
                      className="rounded-xl bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            <footer className="mt-10 text-sm text-slate-600 dark:text-slate-300">
              Phases: <span className="font-medium text-emerald-700 dark:text-emerald-300">Point of Origin</span> →
              <span className="mx-1 font-medium text-teal-700 dark:text-teal-300">Production</span> →
              <span className="mr-1 font-medium text-sky-700 dark:text-sky-300">Transport</span> →
              <span className="mr-1 font-medium text-amber-700 dark:text-amber-300">Construction</span> →
              <span className="font-medium text-rose-700 dark:text-rose-300">Disposal</span>.
            </footer>
          </>
        )}
      </main>

      <CompareModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={selectedItems}
        xDomain={xDomain ?? [0, Math.max(1, Math.ceil(Math.max(...selectedItems.map(s => s.total), 1)))]}
      />
    </div>
  );
}
