// src/lib/scenario.ts
import type { Row } from "../types";

export type ReplacementMap = Record<string, string>;

/**
 * Apply name-based replacements.
 * For each row whose name appears in `repl`, copy impact/cost metrics
 * from the candidate row (matched by name), while keeping the original
 * row's quantity/unit/category/subtype.
 */
export function applyReplacements(rows: Row[], repl: ReplacementMap): Row[] {
  if (!rows?.length || !repl || Object.keys(repl).length === 0) return rows;

  // Fast lookup: base data by name
  const byName = new Map<string, Row>();
  for (const r of rows) {
    if (r?.name) byName.set(String(r.name), r);
  }

  return rows.map((r) => {
    const baseName = r.name ?? "";
    const altName = repl[baseName];
    if (!altName) return r; // no swap for this row

    const cand = byName.get(altName);
    if (!cand) return r; // safety: alternative not found

    // Compute LIS if missing on candidate (sum of phases)
    const lis =
      toNum(cand.lis) ??
      (toNum(cand.origin) ?? 0) +
        (toNum(cand.factory) ?? 0) +
        (toNum(cand.transport) ?? 0) +
        (toNum(cand.construction) ?? 0) +
        (toNum(cand.disposal) ?? 0);

    // Return a new row: keep qty/unit/category/subtype from original,
    // but copy metrics from candidate and rename to the chosen alt.
    return {
      ...r,
      name: altName,
      lis,
      ris: toNum(cand.ris),
      origin: toNum(cand.origin),
      factory: toNum(cand.factory),
      transport: toNum(cand.transport),
      construction: toNum(cand.construction),
      disposal: toNum(cand.disposal),
      price: toNum(cand.price),
      cpi: toNum(cand.cpi),
    };
  });
}

function toNum(x: unknown): number | undefined {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : undefined;
}
