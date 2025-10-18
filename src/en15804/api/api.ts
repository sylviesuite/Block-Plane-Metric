import type { CanonicalPayload, NormalizationOptions, NormalizationResult, IndicatorKey } from '../types/en15804.js';
import { normalizeEpdUnits } from '../normalization/units.js';
import { aggregateIndicator, applyLifetimeScaling, applyTransportScaling } from '../normalization/aggregate.js';

export class EpdNormalizer {
  private processed = 0;
  private totalMs = 0;

  getNormalizedIndicators(payload: CanonicalPayload, opts: NormalizationOptions = {}): NormalizationResult {
    const t0 = performance?.now ? performance.now() : Date.now();
    const warnings: string[] = [];

    let normalized = normalizeEpdUnits(payload, opts.targetUnit ?? 'kg');

    const scaled: Record<string, any> = {};
    for (const [k, mods] of Object.entries(normalized.indicators)) {
      let m = mods;
      if (opts.applyLifetimeScaling && opts.projectLifetimeYears && opts.maintenanceFrequencyYears) {
        m = applyLifetimeScaling(m, opts.maintenanceFrequencyYears, opts.projectLifetimeYears);
      }
      if (opts.applyTransportScaling && opts.transportDistanceKm) {
        m = applyTransportScaling(m, opts.transportDistanceKm, opts.transportModeFactor ?? 1);
      }
      scaled[k] = m;
    }
    normalized = { ...normalized, indicators: scaled as any };

    const out: NormalizationResult = {
      material_id: payload.material_id,
      indicators: {} as any,
      metadata: normalized.metadata,
      warnings,
      processing_time_ms: 0
    };
    for (const [key, mods] of Object.entries(normalized.indicators)) {
      out.indicators[key as IndicatorKey] = aggregateIndicator(mods, opts.includeD ?? false);
      warnings.push(...out.indicators[key as IndicatorKey].notes);
    }

    const ms = (performance?.now ? performance.now() : Date.now()) - t0;
    this.processed++; this.totalMs += ms;
    out.processing_time_ms = Number(ms.toFixed(2));
    return out;
  }

  batchNormalize(payloads: readonly CanonicalPayload[], opts?: NormalizationOptions): NormalizationResult[] {
    return payloads.map(p => this.getNormalizedIndicators(p, opts));
  }

  getPerformanceStats() {
    return {
      total_processed: this.processed,
      total_time_ms: Number(this.totalMs.toFixed(2)),
      avg_time_per_record_ms: this.processed ? Number((this.totalMs/this.processed).toFixed(2)) : undefined
    };
  }
}
