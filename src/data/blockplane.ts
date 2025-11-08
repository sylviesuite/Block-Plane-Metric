/**
 * BlockPlane -> Visuals adapter
 * Expects either:
 *  - src/data/materials.v2.json (array of { name, phases: {origin, production, transport, construction, disposal} })
 *  - or src/data/materials.ts exporting same as default.
 */
export type PhaseKey = "origin"|"production"|"transport"|"construction"|"disposal";

export interface BPItem {
  name: string;
  phases: Record<PhaseKey, number>; // values in MJ
}

async function tryLoadDynamic(path: string) {
  try { return (await import(/* @vite-ignore */ path)).default; }
  catch { return null; }
}

/** Load materials from the most likely files, otherwise return null. */
export async function loadBlockPlaneMaterials(): Promise<BPItem[] | null> {
  // Try TS first, then JSON
  const ts = await tryLoadDynamic("/src/data/materials.ts");
  if (ts && Array.isArray(ts)) return ts as BPItem[];

  const json = await tryLoadDynamic("/src/data/materials.v2.json");
  if (json && Array.isArray(json)) return json as BPItem[];

  return null;
}

/** Convert to the Recharts Visuals format */
export async function getVisualData() {
  const mats = await loadBlockPlaneMaterials();
  if (mats) {
    return mats.map(m => ({
      name: m.name,
      origin: m.phases.origin ?? 0,
      production: m.phases.production ?? 0,
      transport: m.phases.transport ?? 0,
      construction: m.phases.construction ?? 0,
      disposal: m.phases.disposal ?? 0,
    }));
  }
  // Fallback demo data if your file isn't present yet
  return [
    { name: "Douglas Fir\nFraming", origin: 260, production: 540, transport: 210, construction: 120, disposal: 80 },
    { name: "Concrete\nFoundation", origin: 520, production: 3200, transport: 380, construction: 700, disposal: 420 },
    { name: "Steel Rebar", origin: 980, production: 4800, transport: 420, construction: 650, disposal: 520 },
    { name: "Fiberglass\nInsulation", origin: 320, production: 980, transport: 140, construction: 220, disposal: 110 },
    { name: "Asphalt Shingles", origin: 860, production: 2200, transport: 360, construction: 540, disposal: 620 },
    { name: "Vinyl Siding", origin: 900, production: 1800, transport: 300, construction: 480, disposal: 520 },
  ];
}
