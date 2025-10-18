import type { CanonicalPayload, DeclaredUnit, IndicatorModules } from '../types/en15804.js';

const KG_FACTORS: Record<string, number|undefined> = { kg: 1, g: 0.001, ton: 1000 };

export function convertToKg(value: number, from: DeclaredUnit, opts: { density_kg_per_m3?: number; thickness_m?: number }): number {
  if (from === 'kg') return value;
  if (from in KG_FACTORS) return value * (KG_FACTORS[from as keyof typeof KG_FACTORS] as number);
  if (from === 'm3') {
    if (!opts.density_kg_per_m3) throw new Error('ERR_DENSITY_REQUIRED');
    return value * opts.density_kg_per_m3;
  }
  if (from === 'm2') {
    const { density_kg_per_m3, thickness_m } = opts;
    if (!density_kg_per_m3) throw new Error('ERR_DENSITY_REQUIRED');
    if (!thickness_m) throw new Error('ERR_THICKNESS_REQUIRED');
    const surfaceKgPerM2 = density_kg_per_m3 * thickness_m; // kg/m2
    return value * surfaceKgPerM2;
  }
  if (from === 'piece') throw new Error('ERR_PIECE_MAPPING_REQUIRED');
  throw new Error('ERR_UNIT_UNSUPPORTED');
}

export function normalizeEpdUnits(payload: CanonicalPayload, target: DeclaredUnit='kg'): CanonicalPayload {
  if (payload.metadata.declared_unit === target) return { ...payload, metadata: { ...payload.metadata, normalized_unit: target } };
  const { declared_unit, density_kg_per_m3, thickness_m } = payload.metadata;
  const out: CanonicalPayload = { ...payload, indicators: {}, metadata: { ...payload.metadata, normalized_unit: target } };
  for (const [key, mods] of Object.entries(payload.indicators)) {
    const nm: IndicatorModules = {};
    for (const [m, v] of Object.entries(mods)) {
      nm[m as keyof IndicatorModules] = v == null ? 0 : Number(convertToKg(v, declared_unit, { density_kg_per_m3, thickness_m }).toFixed(2));
    }
    (out.indicators as any)[key] = nm;
  }
  return out;
}
