// src/components/InsightWrapper.tsx
import React, { useEffect, useMemo } from "react";
import type { Row, Insight } from "../types";

export interface InsightWrapperProps {
  rows: Row[];
  baselineName: string;
  csvText: string;
  className?: string;
  onGenerateInsights?: (insights: Insight[]) => void;
}

function num(x: unknown): number {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : 0;
}

function lisOf(r: Row): number {
  if (r.lis != null && Number.isFinite(Number(r.lis))) return Number(r.lis);
  return (
    num(r.origin) +
    num(r.factory) +
    num(r.transport) +
    num(r.construction) +
    num(r.disposal)
  );
}

const InsightWrapper: React.FC<InsightWrapperProps> = ({
  rows,
  baselineName,
  csvText,
  className,
  onGenerateInsights,
}) => {
  const stats = useMemo(() => {
    const totalLIS = rows.reduce((s, r) => s + lisOf(r), 0);
    const totalRIS = rows.reduce((s, r) => s + num(r.ris), 0);
    const materials = rows.length;
    const topByLIS = [...rows]
      .map((r) => ({ name: r.name ?? "Unnamed", lis: lisOf(r) }))
      .sort((a, b) => b.lis - a.lis)
      .slice(0, 3);
    return { totalLIS, totalRIS, materials, topByLIS };
  }, [rows]);

  const insights: Insight[] = useMemo(() => {
    const out: Insight[] = [];
    if (stats.materials === 0) {
      out.push({
        id: "empty",
        title: "No materials loaded",
        body: "Upload a CSV or verify CSV_PATH to see lifecycle insights and comparisons.",
        severity: "info",
      });
      return out;
    }
    out.push({
      id: "summary",
      title: "Project summary",
      body: `Baseline: ${baselineName}. Materials: ${stats.materials}. LIS≈${Math.round(
        stats.totalLIS,
      )}. RIS≈${Math.round(stats.totalRIS)}.`,
      severity: "info",
      tags: ["overview"],
    });
    if (stats.topByLIS[0]) {
      const t = stats.topByLIS[0];
      out.push({
        id: "top-lis",
        title: `Highest LIS material: ${t.name}`,
        body: `Largest lifecycle burden (LIS ≈ ${Math.round(
          t.lis,
        )}). Consider alternatives or reductions.`,
        severity: "warn",
        tags: ["hotspot"],
      });
    }
    return out;
  }, [baselineName, stats]);

  useEffect(() => {
    onGenerateInsights?.(insights);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvText, insights]);

  return (
    <section className={className}>
      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2">Insights</h2>

        <p className="text-sm opacity-80 mb-3">
          Baseline <span className="font-mono">{baselineName}</span> ·{" "}
          {stats.materials} materials · LIS≈{Math.round(stats.totalLIS)} · RIS≈
          {Math.round(stats.totalRIS)}
        </p>

        <ul className="space-y-2">
          {insights.map((ins) => (
            <li key={ins.id} className="rounded-md border bg-white p-3 text-sm">
              <div className="font-medium">{ins.title}</div>
              {ins.body && <div className="opacity-80">{ins.body}</div>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default InsightWrapper;
