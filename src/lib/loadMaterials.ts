import type { Material, PhaseMap } from "../types";

// Accepts any of: pointOfOrigin / pointofOrigin and fills missing fields with 0
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

function withTotal(m: any): Material {
  const phases = normalizePhases(m.phases);
  const total =
    typeof m.total === "number"
      ? m.total
      : Object.values(phases).reduce((a: number, b: number) => a + (Number(b) || 0), 0);

  return {
    id: String(m.id ?? m.name ?? crypto.randomUUID()),
    name: String(m.name ?? "Unnamed"),
    materialType: String(m.materialType ?? m.category ?? "Unknown"),
    sourceRegion: m.sourceRegion ? String(m.sourceRegion) : undefined,
    phases,
    total: Number(total) || 0,
    meta: m.meta && typeof m.meta === "object" ? { unit: m.meta.unit } : undefined,
  };
}

export async function loadMaterials(): Promise<Material[]> {
  // prefer local static import in dev (rock solid)
  const mode = import.meta.env.VITE_DATA_SOURCE || "import";

  if (mode === "public") {
    // fetch from /public for deploy parity
    const v = import.meta.env.VITE_BUILD_VERSION ?? Date.now();
    const url = new URL("/data/materials.v2.json", window.location.origin);
    url.searchParams.set("v", String(v));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr = await res.json();
    return (Array.isArray(arr) ? arr : []).map(withTotal);
  }

  // default: import bundled JSON
  const imported = (await import("../data/materials.v2.json")).default as any[];
  return (Array.isArray(imported) ? imported : []).map(withTotal);
}
