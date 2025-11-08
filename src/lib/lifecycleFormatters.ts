export type PhaseKey = "production"|"transport"|"construction"|"maintenance"|"endOfLife";

export const PHASES: {key: PhaseKey; label: string}[] = [
  { key: "production",   label: "Production" },
  { key: "transport",    label: "Transport" },
  { key: "construction", label: "Construction" },
  { key: "maintenance",  label: "Maintenance" },
  { key: "endOfLife",    label: "End of Life" },
];

export const phaseColor = (key: PhaseKey) => {
  const m: Record<PhaseKey,string> = {
    production:   "var(--phase-prod, #1e3a8a)",
    transport:    "var(--phase-trans, #0e7490)",
    construction: "var(--phase-const, #047857)",
    maintenance:  "var(--phase-main, #a16207)",
    endOfLife:    "var(--phase-eol, #9f1239)"
  };
  return m[key];
};

export function fmtUnit(val: number, unit: string) {
  const clean = unit.replace(/Ω/g, "g"); // defense: kΩ -> kg
  const isKgCO2e = /kg\s*CO₂e/i.test(clean) || /kg\s*CO2e/i.test(clean);
  const isMJ = /^MJ$/i.test(clean);
  if (isKgCO2e) {
    if (val >= 1000) return { value: +(val/1000).toFixed(2), unit: "t CO₂e" };
    return { value: +val.toFixed(2), unit: "kg CO₂e" };
  }
  if (isMJ) {
    if (val >= 1000) return { value: +(val/1000).toFixed(2), unit: "GJ" };
    return { value: +val.toFixed(2), unit: "MJ" };
  }
  return { value: +val.toFixed(2), unit: clean };
}

export function qual(value: number, max=100) {
  const p = value/max;
  if (p >= 0.7) return {label:"High",   tone:"bg-emerald-100 text-emerald-800"};
  if (p >= 0.4) return {label:"Medium", tone:"bg-amber-100 text-amber-800"};
  return {label:"Low",   tone:"bg-rose-100 text-rose-800"};
}
