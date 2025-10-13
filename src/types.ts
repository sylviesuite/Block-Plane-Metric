export interface Material {
  id: string;
  name: string;
  category?: string;
  unit?: string;
  weight_kg?: number;
  embodiedEnergy_MJ_per_kg?: number;
  co2_kg_per_kg?: number;
  density_kg_per_m3?: number;
  notes?: string;
}
