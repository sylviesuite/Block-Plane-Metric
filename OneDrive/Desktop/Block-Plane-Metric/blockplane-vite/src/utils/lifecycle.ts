import type { LifecyclePhases } from "@/types/material";

export const phaseOrder = [
  "pointOfOrigin",
  "production",
  "transport",
  "construction",
  "disposal",
] as const;

export function totals(phases: LifecyclePhases) {
  return phaseOrder.reduce(
    (acc, key) => {
      acc.energyMJ += phases[key].energyMJ;
      acc.co2kg += phases[key].co2kg;
      return acc;
    },
    { energyMJ: 0, co2kg: 0 }
  );
}

export const phaseLabels: Record<string, string> = {
  pointOfOrigin: "Point of Origin",
  production: "Production",
  transport: "Transport",
  construction: "Construction",
  disposal: "Disposal",
};

export const preProdLabelUI = "Point of Origin → Production";
