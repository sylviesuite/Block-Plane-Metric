import React, { useMemo, useState } from "react";
import LifecycleBarChart from "@/components/LifecycleBarChart";
import { lifecycleMaterials } from "@/data/materials.lifecycle";
import { totals, preProdLabelUI, phaseOrder, phaseLabels } from "@/utils/lifecycle";
import { ConstructionIntensity, Material } from "@/types/material";

export default function LifecycleBreakdown() {
  const [materials, setMaterials] = useState<Material[]>(lifecycleMaterials);

  const tableRows = useMemo(() => {
    return materials.map((m) => {
      const t = totals(m.phases);
      return { ...m, totalEnergyMJ: t.energyMJ, totalCO2kg: t.co2kg };
    });
  }, [materials]);

  const onIntensityChange = (id: string, val: ConstructionIntensity) => {
    setMaterials(prev => prev.map(m => {
      if (m.id !== id) return m;
      const factor = val === "light" ? 0.5 : val === "medium" ? 1.0 : 2.0;
      const base = 14; // ~4 kWh/m² ≈ 14.4 MJ baseline for Medium
      return {
        ...m,
        constructionIntensity: val,
        phases: {
          ...m.phases,
          construction: {
            ...m.phases.construction,
            energyMJ: Math.round(base * factor),
          },
        },
      };
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Lifecycle Breakdown</h1>
        <p className="text-sm text-gray-600">
          Phases: <span className="font-medium">{preProdLabelUI}</span>, Transport, Construction, Disposal.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Energy by Phase (Stacked)</h2>
        <LifecycleBarChart materials={materials} />
      </section>

      <section className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Details & Quick Edits</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Material</th>
                {phaseOrder.map(k => (
                  <th key={k} className="py-2 px-2">{phaseLabels[k]} (MJ)</th>
                ))}
                <th className="py-2 px-2">Total (MJ)</th>
                <th className="py-2 px-2">Total CO₂ (kg)</th>
                <th className="py-2 px-2">Construction Intensity</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(row => (
                <tr key={row.id} className="border-b">
                  <td className="py-2 pr-4 font-medium">{row.name}</td>
                  {phaseOrder.map(k => (
                    <td key={k} className="py-2 px-2">{row.phases[k].energyMJ}</td>
                  ))}
                  <td className="py-2 px-2 font-semibold">{row.totalEnergyMJ}</td>
                  <td className="py-2 px-2">{row.totalCO2kg}</td>
                  <td className="py-2 px-2">
                    <select
                      value={row.constructionIntensity ?? "medium"}
                      onChange={(e) => onIntensityChange(row.id, e.target.value as any)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="light">Light (1–2 kWh/m²)</option>
                      <option value="medium">Medium (3–5 kWh/m²)</option>
                      <option value="intensive">Intensive (6–10 kWh/m²)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Tip: hover chart legend to isolate a phase; change “Construction Intensity” to see immediate energy updates.
        </p>
      </section>
    </div>
  );
}
