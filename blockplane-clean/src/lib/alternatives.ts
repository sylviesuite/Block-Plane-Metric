// src/lib/alternatives.ts
import type { Row, AltRec } from "../types";
import { areUnitsCompatible } from "./units";
import { evaluatePolicy } from "./policy";

/** Coercion helpers */
const num = (x: unknown): number => {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : 0;
};
const optNum = (x: unknown): number | undefined => {
  const n = typeof x === "number" ? x : Number(x);
  return Number.isFinite(n) ? n : undefined;
};

const lisOf = (r: Row): number =>
  r.lis != null && Number.isFinite(Number(r.lis))
    ? Number(r.lis)
    : num(r.origin) +
      num(r.factory) +
      num(r.transport) +
      num(r.construction) +
      num(r.disposal);

type Weights = { wLIS: number; wCPI: number; wRIS: number };
type Options = {
  minDeltaLIS?: number; // absolute points
  minRelLIS?: number; // fraction, e.g., 0.12 = 12%
  maxResults?: number;
  weights?: Weights; // scoring weights (will be normalized by caller if desired)
  penalizeHigherCPI?: boolean;
  nameBlocklist?: string[]; // additional simple blocklist
};

export function generateAltRecs(rows: Row[], opts: Options = {}): AltRec[] {
  const {
    minDeltaLIS = 10,
    minRelLIS = 0.1,
    maxResults = 8,
    weights = { wLIS: 0.6, wCPI: 0.3, wRIS: 0.1 },
    penalizeHigherCPI = true,
    nameBlocklist = [],
  } = opts;

  if (!rows.length) return [];

  const blockedBySettings = (name?: string) =>
    !name
      ? false
      : nameBlocklist.some((b) => name.toLowerCase().includes(b.toLowerCase()));

  // Group by category|subtype for fair swaps
  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    const key = `${r.category ?? "unknown"}|${r.subtype ?? "general"}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const recs: AltRec[] = [];

  for (const [key, group] of groups.entries()) {
    if (group.length < 2) continue;

    // compute features + policy upfront
    const items = group.map((r) => {
      const pol = evaluatePolicy(r.name, r.category, r.subtype);
      return {
        r,
        name: r.name ?? "Unnamed",
        lis: lisOf(r),
        cpi: optNum(r.cpi),
        ris: optNum(r.ris),
        unit: r.unit,
        policy: pol,
      };
    });

    for (const base of items) {
      // we still allow suggesting an alt even if base has policy issues
      if (blockedBySettings(base.name)) continue;

      let best: { rec: AltRec; score: number } | null = null;

      for (const cand of items) {
        if (cand === base) continue;
        if (!areUnitsCompatible(base.unit, cand.unit)) continue;
        if (blockedBySettings(cand.name)) continue;

        // Policy: skip candidates explicitly disallowed
        if (!cand.policy.allowed) continue;

        const deltaLIS = base.lis - cand.lis; // want positive
        const relLIS = base.lis > 0 ? deltaLIS / base.lis : 0;
        if (deltaLIS < minDeltaLIS || relLIS < minRelLIS) continue;

        const deltaCPI =
          base.cpi != null && cand.cpi != null
            ? base.cpi - cand.cpi
            : undefined; // want positive
        const deltaRIS =
          base.ris != null && cand.ris != null
            ? cand.ris - base.ris
            : undefined; // want positive

        // Normalize components to 0..1
        const lisTerm = Math.max(0, Math.min(1, relLIS));
        const cpiTerm =
          deltaCPI == null
            ? 0
            : Math.max(0, Math.min(1, deltaCPI / Math.max(1, base.cpi!)));
        const risTerm =
          deltaRIS == null || (base.ris ?? 0) <= 0
            ? deltaRIS != null && deltaRIS > 0
              ? 0.1
              : 0
            : Math.max(0, Math.min(1, deltaRIS / Math.max(1, base.ris!)));

        let score =
          weights.wLIS * lisTerm +
          weights.wCPI * cpiTerm +
          weights.wRIS * risTerm;

        // Penalize CPI increases if requested
        if (penalizeHigherCPI && deltaCPI != null && deltaCPI < 0) score *= 0.6;

        const notes: string[] = [];
        if (lisTerm > 0) notes.push(`−${Math.round(deltaLIS)} LIS`);
        if (deltaCPI != null && deltaCPI > 0)
          notes.push(`−${deltaCPI.toFixed(1)} CPI`);
        if (deltaRIS != null && deltaRIS > 0)
          notes.push(`+${deltaRIS.toFixed(1)} RIS`);

        // Apply policy multiplier for candidate, and note policy changes
        if (cand.policy.notes.length) {
          notes.push(...cand.policy.notes.map((n) => `alt: ${n}`));
        }
        if (base.policy.notes.length) {
          notes.push(...base.policy.notes.map((n) => `base: ${n}`));
        }

        // If candidate improves policy vs. base, give a small bump
        const policyImprovement =
          cand.policy.multiplier - base.policy.multiplier; // positive is better
        if (policyImprovement > 0.05) {
          score *= 1 + Math.min(0.1, policyImprovement); // up to +10%
          notes.push("policy improvement");
        }

        // Finally multiply by candidate policy multiplier
        score *= cand.policy.multiplier;

        const [category, subtype] = key.split("|");

        const rec: AltRec = {
          category: category === "unknown" ? undefined : category,
          subtype: subtype === "general" ? undefined : subtype,
          baseName: base.name,
          baseLIS: base.lis,
          baseCPI: base.cpi,
          baseRIS: base.ris,
          altName: cand.name,
          altLIS: cand.lis,
          altCPI: cand.cpi,
          altRIS: cand.ris,
          deltaLIS,
          deltaCPI,
          deltaRIS,
          score,
          confidence:
            [true, deltaCPI != null, deltaRIS != null].filter(Boolean).length /
            3,
          notes,
        };

        if (!best || score > best.score) best = { rec, score };
      }

      if (best) recs.push(best.rec);
    }
  }

  // Dedupe and rank
  const seen = new Set<string>();
  const uniq = recs.filter((r) => {
    const k = `${r.baseName}->${r.altName}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  uniq.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return uniq.slice(0, maxResults);
}
