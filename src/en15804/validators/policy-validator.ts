import type { CanonicalPayload } from '../types/en15804.js';

export function validatePolicy(p: CanonicalPayload) {
  const errors: { code: string; message: string; path: string }[] = [];
  const gwp = p.indicators['gwp_kgco2e'];
  const a1a3 = (gwp?.A1A3 ?? 0) || ((gwp?.A1 ?? 0) + (gwp?.A2 ?? 0) + (gwp?.A3 ?? 0));
  if (a1a3 === 0) errors.push({ code: 'ERR_MISSING_A1A3', message: 'A1–A3 missing for GWP.', path: 'indicators.gwp_kgco2e.A1A3' });
  return { valid: errors.length === 0, errors };
}
