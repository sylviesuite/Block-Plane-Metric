// src/lib/units.ts

/** Normalize common unit labels to simple canonical forms */
export function normalizeUnit(u?: string): string | undefined {
  if (!u) return undefined;
  const s = u.trim().toLowerCase().replace(/\s+/g, "");
  // area
  if (
    [
      "m2",
      "m^2",
      "m²",
      "sqm",
      "sqmeter",
      "squaremeter",
      "squaremeters",
    ].includes(s)
  )
    return "m2";
  if (
    ["ft2", "ft^2", "ft²", "sqft", "sf", "squarefoot", "squarefeet"].includes(s)
  )
    return "ft2";
  // length
  if (["m", "meter", "meters", "metre", "metres"].includes(s)) return "m";
  if (["ft", "foot", "feet"].includes(s)) return "ft";
  // volume
  if (["m3", "m^3", "m³", "cubicmeter", "cubicmeters"].includes(s)) return "m3";
  if (["ft3", "ft^3", "ft³", "cubicfoot", "cubicfeet"].includes(s))
    return "ft3";
  // mass
  if (["kg", "kilogram", "kilograms"].includes(s)) return "kg";
  if (["lb", "lbs", "pound", "pounds"].includes(s)) return "lb";
  // count
  if (
    ["ea", "each", "pc", "pcs", "piece", "pieces", "unit", "units"].includes(s)
  )
    return "ea";
  // default: keep as-is
  return s;
}

/** Consider units compatible if equal after normalization or part of a known convertible pair */
export function areUnitsCompatible(a?: string, b?: string): boolean {
  if (!a || !b) return true; // be permissive when unspecified
  const A = normalizeUnit(a);
  const B = normalizeUnit(b);
  if (!A || !B) return true;
  if (A === B) return true;
  const convertiblePairs: Array<[string, string]> = [
    ["m2", "ft2"],
    ["m", "ft"],
    ["m3", "ft3"],
    ["kg", "lb"],
  ];
  return convertiblePairs.some(
    ([u1, u2]) => (A === u1 && B === u2) || (A === u2 && B === u1),
  );
}
