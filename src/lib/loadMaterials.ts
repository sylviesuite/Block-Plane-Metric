import type { Material, PhaseMap } from "../types";

function normalizePhases(raw: any): PhaseMap {
  const p: any = raw || {};
  const origin =
    typeof p.pointOfOrigin === "number"
      ? p.pointOfOrigin
      : typeof p.pointofOrigin === "number"
      ? p.pointofOrigin
      : 0;

  return {
    pointOfOrigin: Number(origin) || 0,
    production: Number(p.production) || 0,
    transport: Number(p.transport) || 0,
    construction: Number(p.construction) || 0,
    disposal: Number(p.disposal) || 0,
  };
}

function sumPhases(ph: PhaseMap | undefined): number {
  if (!ph) return 0;
  return (
    (ph.pointOfOrigin || 0) +
    (ph.production || 0) +
    (ph.transport || 0) +
    (ph.construction || 0) +
    (ph.disposal || 0)
  );
}

function withTotals(m: any): Material {
  const phases = normalizePhases(m.phases);

  // Try to find energy phases in a few common shapes
  const rawEnergy =
    m.phasesEnergy ??
    m.energy?.phases ??
    m.phasesMJ ??
    null;

  const phasesEnergy = rawEnergy ? normalizePhases(rawEnergy) : undefined;

  const total =
    typeof m.total === "number" ? Number(m.total) : sumPhases(phases);

  const totalEnergy =
    typeof m.totalEnergy === "number"
      ? Number(m.totalEnergy)
      : phasesEnergy
      ? sumPhases(phasesEnergy)
      : undefined;

  return {
    id: String(m.id ?? m.name ?? crypto.randomUUID()),
    name: String(m.name ?? "Unnamed"),
    materialType: String(m.materialType ?? m.category ?? "Unknown"),
    sourceRegion: m.sourceRegion ? String(m.sourceRegion) : undefined,

    phases,
    total,
    meta: m.meta && typeof m.meta === "object" ? { unit: m.meta.unit } : undefined,

    phasesEnergy,
    totalEnergy,
    metaEnergy:
      m.metaEnergy && typeof m.metaEnergy === "object"
        ? { unit: m.metaEnergy.unit }
        : m.energy?.meta && typeof m.energy.meta === "object"
        ? { unit: m.energy.meta.unit }
        : undefined,
  };
}

export async function loadMaterials(): Promise<Material[]> {
  const mode = import.meta.env.VITE_DATA_SOURCE || "import";

  if (mode === "public") {
    const v = import.meta.env.VITE_BUILD_VERSION ?? Date.now();
    const url = new URL("/data/materials.v2.json", window.location.origin);
    url.searchParams.set("v", String(v));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr = await res.json();
    return (Array.isArray(arr) ? arr : []).map(withTotals);
  }

  const imported = (await import("../data/materials.v2.json")).default as any[];
  return (Array.isArray(imported) ? imported : []).map(withTotals);
}
