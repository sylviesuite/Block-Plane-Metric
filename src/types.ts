export type PhaseMap = {
  pointOfOrigin: number;
  production: number;
  transport: number;
  construction: number;
  disposal: number;
};

export type Material = {
  id: string;
  name: string;
  materialType: string;
  sourceRegion?: string;

  // Primary metric (usually CO2e)
  phases: PhaseMap;
  total: number;
  meta?: { unit?: string };

  // Optional: embodied energy metric (MJ, kWh, etc.)
  phasesEnergy?: PhaseMap;
  totalEnergy?: number;
  metaEnergy?: { unit?: string };
};
