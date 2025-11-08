export type LifecyclePhase =
  | "pointOfOrigin"
  | "production"
  | "transport"
  | "construction"
  | "disposal";

export type ConstructionIntensity = "low" | "medium" | "high";

export interface LifecycleMaterial {
  name: string;
  pointOfOrigin: number;
  production: number;
  transport: number;
  construction: number;
  disposal: number;
  constructionIntensity?: ConstructionIntensity;
}

export const phaseLabels: Record<LifecyclePhase, string> = {
  pointOfOrigin: "Point of Origin",
  production: "Production",
  transport: "Transport",
  construction: "Construction",
  disposal: "Maintenance & End of Life",
};

export const phaseColors: Record<LifecyclePhase, string> = {
  pointOfOrigin: "hsl(var(--phase-origin))",
  production: "hsl(var(--phase-production))",
  transport: "hsl(var(--phase-transport))",
  construction: "hsl(var(--phase-construction))",
  disposal: "hsl(var(--phase-disposal))",
};

export function formatEnergy(value: number): string {
  return `${Number(value ?? 0).toLocaleString()} MJ`;
}

export function getTotalEnergy(m: LifecycleMaterial): number {
  return (
    (m.pointOfOrigin || 0) +
    (m.production || 0) +
    (m.transport || 0) +
    (m.construction || 0) +
    (m.disposal || 0)
  );
}
