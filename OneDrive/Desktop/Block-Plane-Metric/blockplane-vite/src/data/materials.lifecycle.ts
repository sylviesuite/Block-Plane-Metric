import { Material } from "@/types/material";

export const lifecycleMaterials: Material[] = [
  {
    id: "rammed-earth",
    name: "Rammed Earth (wall unit)",
    unit: "m²",
    constructionIntensity: "intensive",
    phases: {
      pointOfOrigin: { energyMJ: 8,  co2kg: 2 },
      production:    { energyMJ: 12, co2kg: 3 },
      transport:     { energyMJ: 5,  co2kg: 1.2 },
      construction:  { energyMJ: 14, co2kg: 3.5 },
      disposal:      { energyMJ: 2,  co2kg: 0.5 },
    },
  },
  {
    id: "drywall-4x8-1/2",
    name: "Drywall 4x8 (1/2\")",
    unit: "sheet",
    constructionIntensity: "medium",
    phases: {
      pointOfOrigin: { energyMJ: 3,  co2kg: 0.8 },
      production:    { energyMJ: 11, co2kg: 2.6 },
      transport:     { energyMJ: 2,  co2kg: 0.6 },
      construction:  { energyMJ: 14, co2kg: 3.5 },
      disposal:      { energyMJ: 1,  co2kg: 0.3 },
    },
  },
  {
    id: "hempcrete-infill",
    name: "Hempcrete (infill)",
    unit: "m³",
    constructionIntensity: "intensive",
    phases: {
      pointOfOrigin: { energyMJ: 6,  co2kg: -8 },
      production:    { energyMJ: 9,  co2kg: -2 },
      transport:     { energyMJ: 3,  co2kg: 0.7 },
      construction:  { energyMJ: 18, co2kg: 4.2 },
      disposal:      { energyMJ: 2,  co2kg: -0.5 },
    },
  },
];
