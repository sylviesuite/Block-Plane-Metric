import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import type { Material } from "../../types";
import { formatNumber } from "../../lib/formatters";

export type PhaseKey = "pointOfOrigin" | "production" | "transport" | "construction" | "disposal";

const PHASES: { key: PhaseKey; label: string; grad: string }[] = [
  { key: "pointOfOrigin", label: "Point of Origin", grad: "url(#grad-origin)" },
  { key: "production",    label: "Production",      grad: "url(#grad-production)" },
  { key: "transport",     label: "Transport",       grad: "url(#grad-transport)" },
  { key: "construction",  label: "Construction",    grad: "url(#grad-construction)" },
  { key: "disposal",      label: "Disposal",        grad: "url(#grad-disposal)" },
];

export function LifecycleBar({
  datum,
  highlightPhase,
  onPhaseHover,
  xDomain,
}: {
  datum: Material;
  highlightPhase?: PhaseKey | null;
  onPhaseHover?: (p: PhaseKey | null) => void;
  xDomain?: [number, number];
}) {
  const chartData = useMemo(() => ([
    { name: datum.name, ...datum.phases, total: datum.total }
  ]), [datum]);

  return (
    <div className="relative">
      {/* Gradients */}
      <svg width={0} height={0} aria-hidden>
        <defs>
          <linearGradient id="grad-origin" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="grad-production" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <linearGradient id="grad-transport" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="grad-construction" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="grad-disposal" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
      </svg>

      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barCategoryGap={0}>
            <CartesianGrid horizontal={false} stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis type="number" hide domain={xDomain ?? ["auto", "auto"]} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              wrapperStyle={{ outline: "none" }}
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const seg = payload[0];
                const key = String(seg.dataKey) as PhaseKey;
                const val = Number(seg.value ?? 0);
                const pct = datum.total ? val / datum.total : 0;
                const label = PHASES.find(p => p.key === key)?.label ?? key;
                return (
                  <div className="rounded-xl border border-emerald-200/60 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 px-3 py-2 shadow-lg backdrop-blur">
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-100">{label}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      {formatNumber(val)} {datum?.meta?.unit ?? "units"} · {(pct * 100).toFixed(0)}%
                    </div>
                  </div>
                );
              }}
            />
            {PHASES.map(({ key, grad }) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={grad}
                radius={[6, 6, 6, 6]}
                opacity={highlightPhase && highlightPhase !== key ? 0.4 : 1}
                onMouseEnter={() => onPhaseHover?.(key)}
                onMouseLeave={() => onPhaseHover?.(null)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {PHASES.map(({ key, label, grad }) => (
          <button
            key={key}
            onMouseEnter={() => onPhaseHover?.(key)}
            onMouseLeave={() => onPhaseHover?.(null)}
            className="group flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 transition hover:border-emerald-300/70"
            aria-pressed={highlightPhase === key}
            title={label}
          >
            <span className="h-2 w-3 rounded-sm" style={{ background: grad }} />
            <span className="text-slate-700 dark:text-slate-200">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
