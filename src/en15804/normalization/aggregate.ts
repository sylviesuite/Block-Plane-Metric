import type { IndicatorModules, ModuleGroup, NormalizedIndicator } from '../types/en15804.js';

const GROUPS: Record<ModuleGroup, (keyof IndicatorModules)[]> = {
  A1A3: ['A1','A2','A3','A1A3'],
  A4A5: ['A4','A5'],
  B1B7: ['B1','B2','B3','B4','B5','B6','B7'],
  C1C4: ['C1','C2','C3','C4'],
  D: ['D']
};
const CORE_KEYS = ['A1A3','A4','A5','C1','C2','C3','C4'] as const;

export function aggregateIndicator(mods: IndicatorModules, includeD=false): NormalizedIndicator {
  const modules: Record<ModuleGroup, number> = { A1A3:0, A4A5:0, B1B7:0, C1C4:0, D:0 };
  const notes: string[] = [];
  const a1a3 = (mods.A1A3 ?? 0) || ((mods.A1 ?? 0)+(mods.A2 ?? 0)+(mods.A3 ?? 0));
  modules.A1A3 = round(a1a3);
  for (const g of (['A4A5','B1B7','C1C4','D'] as ModuleGroup[])) {
    modules[g] = round(GROUPS[g].reduce((s,k)=> s + (mods[k] ?? 0), 0));
  }
  const core = round(mods.A4 ?? 0) + round(mods.A5 ?? 0) + round(mods.C1 ?? 0)+round(mods.C2 ?? 0)+round(mods.C3 ?? 0)+round(mods.C4 ?? 0) + round(a1a3);
  const withD = round(core + (mods.D ?? 0));
  for (const k of CORE_KEYS) if (!(k in mods) && !(k==='A1A3' && (mods.A1||mods.A2||mods.A3))) notes.push(`Missing ${k} data`);
  return { modules, total_core_A1C: round(core), total_with_D: includeD ? withD : round(core), notes };
}

export function applyLifetimeScaling(mods: IndicatorModules, maintenanceFreqYears: number, projectYears: number): IndicatorModules {
  const copies = { ...mods };
  const events = projectYears / maintenanceFreqYears;
  for (const k of ['B2','B4'] as const) if (copies[k] != null) copies[k] = round((copies[k] as number) * events);
  return copies;
}

export function applyTransportScaling(mods: IndicatorModules, distanceKm: number, modeFactor=1): IndicatorModules {
  const copies = { ...mods };
  if (copies.A4 != null) copies.A4 = round((copies.A4 as number) * distanceKm * modeFactor);
  return copies;
}

const round = (n: number) => Number(n.toFixed(2));
