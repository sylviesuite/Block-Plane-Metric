import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { phaseOrder, phaseLabels } from "@/utils/lifecycle";
import { Material } from "@/types/material";

type Datum = {
  name: string;
  pointOfOrigin: number;
  production: number;
  transport: number;
  construction: number;
  disposal: number;
  total: number;
};

function toEnergyDataset(materials: Material[]): Datum[] {
  return materials.map(m => ({
    name: m.name,
    pointOfOrigin: m.phases.pointOfOrigin.energyMJ,
    production:    m.phases.production.energyMJ,
    transport:     m.phases.transport.energyMJ,
    construction:  m.phases.construction.energyMJ,
    disposal:      m.phases.disposal.energyMJ,
    total:         Object.values(m.phases).reduce((s, p) => s + p.energyMJ, 0),
  }));
}

const tooltipFmt = (value: any) => `${value} MJ`;
const xAxisFmt = (v: any) => `${v} MJ`;

const PHASE_COLORS: Record<string,string> = {
  pointOfOrigin: "#6baed6",
  production:    "#31a354",
  transport:     "#fd8d3c",
  construction:  "#756bb1",
  disposal:      "#cb181d"
};

export default function LifecycleBarChart({ materials }: { materials: Material[] }) {
  const data = toEnergyDataset(materials);
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 24, top: 8, bottom: 8 }}>
          <XAxis type="number" tickFormatter={xAxisFmt} />
          <YAxis type="category" dataKey="name" width={220} />
          <Tooltip cursor={false} formatter={tooltipFmt} />
          <Legend />
          {phaseOrder.map((k) => (
            <Bar key={k} dataKey={k} stackId="a" fill={PHASE_COLORS[k]} name={phaseLabels[k]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
