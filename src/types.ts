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
  phases: PhaseMap;
  total: number;
  meta?: { unit?: string };
};
