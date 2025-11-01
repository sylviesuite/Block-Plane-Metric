export type LifecyclePhaseKey =
  | "pointOfOrigin"
  | "production"
  | "transport"
  | "construction"
  | "disposal";

export type ConstructionIntensity = "light" | "medium" | "intensive";

export interface LifecyclePhases {
  pointOfOrigin: { energyMJ: number; co2kg: number };
  production:    { energyMJ: number; co2kg: number };
  transport:     { energyMJ: number; co2kg: number };
  construction:  { energyMJ: number; co2kg: number };
  disposal:      { energyMJ: number; co2kg: number };
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  densityKgPerM3?: number;
  embodiedEnergyMJ?: number;
  co2kg?: number;
  phases: LifecyclePhases;
  constructionIntensity?: ConstructionIntensity;
}
