// src/lib/policy.ts

export interface PolicyEval {
  /** If false, we refuse to suggest this material as an alternative. */
  allowed: boolean;
  /** Multiplier applied to the candidate's score (0..1 typical, >1 is a bonus). */
  multiplier: number;
  /** Notes explaining the decision. */
  notes: string[];
}

const DISALLOW_TERMS = ["asbestos", "lead paint", "creosote"];

const WARN_TERMS: Array<{ term: string; multiplier: number; note: string }> = [
  { term: "pvc", multiplier: 0.7, note: "PVC flagged (chlorinated plastic)" },
  { term: "pfas", multiplier: 0.6, note: "PFAS flagged (forever chemicals)" },
  { term: "chromium vi", multiplier: 0.6, note: "Chromium VI flagged" },
  {
    term: "formaldehyde",
    multiplier: 0.75,
    note: "Formaldehyde emissions risk",
  },
];

const PREFER_TERMS: Array<{ term: string; boost: number; note: string }> = [
  { term: "fsc", boost: 1.1, note: "FSC-cert preference" },
  { term: "recycled", boost: 1.1, note: "Recycled content preference" },
  { term: "low-voc", boost: 1.05, note: "Low-VOC preference" },
  { term: "e0", boost: 1.05, note: "E0 formaldehyde preference" },
];

function includesIgnoreCase(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

/** Evaluate a material name/category/subtype against simple policy rules */
export function evaluatePolicy(
  name?: string,
  category?: string,
  subtype?: string,
): PolicyEval {
  const hay = [name ?? "", category ?? "", subtype ?? ""]
    .join(" ")
    .toLowerCase();
  const notes: string[] = [];
  let allowed = true;
  let multiplier = 1;

  // Disallow
  for (const term of DISALLOW_TERMS) {
    if (includesIgnoreCase(hay, term)) {
      allowed = false;
      notes.push(`Disallowed term: ${term}`);
    }
  }
  if (!allowed) return { allowed, multiplier: 0, notes };

  // Warn/penalize
  for (const w of WARN_TERMS) {
    if (includesIgnoreCase(hay, w.term)) {
      multiplier *= w.multiplier;
      notes.push(w.note);
    }
  }

  // Prefer/boost
  for (const p of PREFER_TERMS) {
    if (includesIgnoreCase(hay, p.term)) {
      multiplier *= p.boost;
      notes.push(p.note);
    }
  }

  // clamp
  if (multiplier < 0.3) multiplier = 0.3;
  if (multiplier > 1.25) multiplier = 1.25;

  return { allowed, multiplier, notes };
}
