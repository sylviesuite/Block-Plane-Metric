// src/lib/transform.ts
import type { Row } from "../types";
import type { MaterialPhaseData } from "../components/LifecycleBarChart";

/** Safe number coercion with fallback */
function num(v: unknown, fallback = 0): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Convert a single Row into phase data (LIS is explicit if provided, else sum of phases) */
export function rowToMaterialPhaseData(r: Row): MaterialPhaseData {
  const origin = num((r as any).origin);
  const factory = num((r as any).factory);
  const transport = num((r as any).transport);
  const construction = num((r as any).construction);
  const disposal = num((r as any).disposal);

  const lis =
    (r as any).lis != null && Number.isFinite(Number((r as any).lis))
      ? Number((r as any).lis)
      : origin + factory + transport + construction + disposal;

  const ris = num((r as any).ris);

  return {
    name: (r as any).name ?? "Unnamed",
    lis,
    ris,
    origin,
    factory,
    transport,
    construction,
    disposal,
  };
}

/**
 * Convert many rows to phase data.
 * If groupByName=true, rows with the same name are summed.
 */
export function rowsToMaterialPhaseData(
  rows: Row[],
  opts: { groupByName?: boolean } = {},
): MaterialPhaseData[] {
  const { groupByName = false } = opts;
  if (!groupByName) return rows.map(rowToMaterialPhaseData);

  const map = new Map<string, MaterialPhaseData>();
  for (const r of rows) {
    const d = rowToMaterialPhaseData(r);
    const prev = map.get(d.name);
    if (!prev) {
      map.set(d.name, { ...d });
    } else {
      prev.origin = num(prev.origin) + num(d.origin);
      prev.factory = num(prev.factory) + num(d.factory);
      prev.transport = num(prev.transport) + num(d.transport);
      prev.construction = num(prev.construction) + num(d.construction);
      prev.disposal = num(prev.disposal) + num(d.disposal);
      prev.lis = num(prev.lis) + num(d.lis);
      prev.ris = num(prev.ris) + num(d.ris);
    }
  }
  return Array.from(map.values());
}
