import type { Row } from "../types";

export function num(x: unknown, fallback = 0): number {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : fallback;
}

export function lisOf(r: Row): number {
  if (r.lis != null && Number.isFinite(Number(r.lis))) return Number(r.lis);
  return (
    num(r.origin) +
    num(r.factory) +
    num(r.transport) +
    num(r.construction) +
    num(r.disposal)
  );
}

export function metricsOf(r: Row) {
  return {
    lis: lisOf(r),
    ris: r.ris != null ? num(r.ris) : undefined,
    cpi: r.cpi != null ? num(r.cpi) : undefined,
    price: r.price != null ? num(r.price) : undefined,
  };
}

/** Compute deltas (scenario - baseline) for a *filtered* subset using _id to align rows */
export function aggregateDelta(
  filtered: Row[],
  baselineById: Map<number, Row>,
) {
  let baseLIS = 0,
    scenLIS = 0,
    baseRIS = 0,
    scenRIS = 0;
  for (const r of filtered) {
    const id = (r as any)._id as number | undefined;
    const base = id != null ? baselineById.get(id) : undefined;
    const s = metricsOf(r);
    const b = base ? metricsOf(base) : { lis: 0, ris: 0 };
    scenLIS += s.lis;
    baseLIS += b.lis;
    scenRIS += num(s.ris, 0);
    baseRIS += num(b.ris, 0);
  }
  return {
    baseLIS,
    scenLIS,
    deltaLIS: scenLIS - baseLIS,
    baseRIS,
    scenRIS,
    deltaRIS: scenRIS - baseRIS,
  };
}
