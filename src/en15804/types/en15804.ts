export type ModuleAtomic = 'A1'|'A2'|'A3'|'A4'|'A5'|'B1'|'B2'|'B3'|'B4'|'B5'|'B6'|'B7'|'C1'|'C2'|'C3'|'C4'|'D';
export type ModuleGroup  = 'A1A3'|'A4A5'|'B1B7'|'C1C4'|'D';
export type Boundary = 'A1C'|'A1D';
export type DeclaredUnit = 'kg'|'m2'|'m3'|'piece';
export type IndicatorKey = 'gwp_kgco2e'|'pe_mj'|string;

export type IndicatorModules = Partial<Record<ModuleAtomic|'A1A3', number>>;
export type IndicatorsByKey = Record<IndicatorKey, IndicatorModules>;

export interface EpdMetadata {
  declared_unit: DeclaredUnit;
  density_kg_per_m3?: number;
  thickness_m?: number;
  normalized_unit?: DeclaredUnit;
}

export interface CanonicalPayload {
  material_id: string;
  version: string;
  metadata: EpdMetadata;
  indicators: IndicatorsByKey;
}

export interface NormalizationOptions {
  targetUnit?: DeclaredUnit;
  includeD?: boolean;
  applyLifetimeScaling?: boolean;
  projectLifetimeYears?: number;
  maintenanceFrequencyYears?: number;
  applyTransportScaling?: boolean;
  transportDistanceKm?: number;
  transportModeFactor?: number;
}

export interface NormalizedIndicator {
  modules: Readonly<Record<ModuleGroup, number>>;
  total_core_A1C: number;
  total_with_D: number;
  notes: readonly string[];
}
export interface NormalizationResult {
  material_id: string;
  indicators: Record<IndicatorKey, NormalizedIndicator>;
  metadata: EpdMetadata;
  warnings: readonly string[];
  processing_time_ms: number;
}
