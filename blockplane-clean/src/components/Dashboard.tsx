import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
  Legend,
} from "recharts";

export interface MaterialPhaseData {
  name: string;
  lis?: number; // optional; we can compute from phases if missing
  ris: number;
  origin: number;
  factory: number;
  transport: number;
  construction: number;
  disposal: number;
}

interface Props {
  data: MaterialPhaseData[];
  viewMode: "LIS" | "RIS";
  /** Optional reference line for LIS (e.g., Paris alignment) */
  referenceLine?: { value: number; label?: string; color?: string } | null;
}

const colors = {
  origin: "#A8E6CF",
  factory: "#FFD3B6",
  transport: "#66A3D2",
  construction: "#305F72",
  disposal: "#6B0F1A",
  reference: "#DC2626",
  risBar: "#305F72",
};

function computeLis(row: MaterialPhaseData) {
  const phases =
    (row.origin ?? 0) +
    (row.factory ?? 0) +
    (row.transport ?? 0) +
    (row.construction ?? 0) +
    (row.disposal ?? 0);
  return typeof row.lis === "number" ? row.lis : phases;
}

const trim = (s: string, max = 28) =>
  s.length > max ? s.slice(0, max - 1) + "…" : s;

const formatLis = (v: number) => `${v.toFixed(1)} kg CO₂`;
const formatRis = (v: number) => `${v.toFixed(1)} RIS`;

const tooltipFormatter = (
  value: number,
  name: string,
  _props: any,
  mode: "LIS" | "RIS",
) => {
  return [mode === "LIS" ? formatLis(value) : formatRis(value), name];
};

export default function LifecycleBarChart({
  data,
  viewMode,
  referenceLine = { value: 6, label: "Paris Target", color: colors.reference },
}: Props) {
  const prepared = useMemo(() => {
    const withTotals = data.map((d) => ({
      ...d,
      _lisTotal: computeLis(d),
    }));

    const sorted = [...withTotals].sort((a, b) =>
      viewMode === "LIS" ? b._lisTotal - a._lisTotal : b.ris - a.ris,
    );

    return sorted;
  }, [data, viewMode]);

  const xLabel =
    viewMode === "LIS" ? "Total CO₂ (kg)" : "Regenerative Impact Score (RIS)";

  return (
    <div
      className="p-6 bg-white rounded-xl shadow-md"
      role="region"
      aria-label={`Lifecycle Impact (${viewMode})`}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Lifecycle Impact of Materials (
        {viewMode === "LIS" ? "CO₂ Emissions" : "Regenerative Impact Score"})
      </h2>

      <ResponsiveContainer width="100%" height={520}>
        <BarChart
          layout="vertical"
          data={prepared}
          margin={{ top: 20, right: 60, left: 220, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(v) =>
              viewMode === "LIS" ? formatLis(v) : formatRis(v)
            }
            label={{ value: xLabel, position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tickFormatter={(s: string) => trim(s)}
            width={200}
          />
          <Tooltip
            formatter={(value: any, name: any, props: any) =>
              tooltipFormatter(Number(value), name, props, viewMode)
            }
            labelFormatter={(label) => `${label}`}
          />
          <Legend />

          {/* Reference line only for LIS */}
          {viewMode === "LIS" &&
            referenceLine &&
            typeof referenceLine.value === "number" && (
              <ReferenceLine
                x={referenceLine.value}
                stroke={referenceLine.color || colors.reference}
                strokeDasharray="3 3"
                label={{
                  position: "top",
                  value: referenceLine.label || "",
                  fill: referenceLine.color || colors.reference,
                  fontSize: 12,
                }}
              />
            )}

          {viewMode === "LIS" ? (
            <>
              <Bar
                dataKey="origin"
                stackId="a"
                fill={colors.origin}
                name="Origin"
                barSize={30}
              />
              <Bar
                dataKey="factory"
                stackId="a"
                fill={colors.factory}
                name="Factory"
              />
              <Bar
                dataKey="transport"
                stackId="a"
                fill={colors.transport}
                name="Transport"
              />
              <Bar
                dataKey="construction"
                stackId="a"
                fill={colors.construction}
                name="Construction"
              />
              <Bar
                dataKey="disposal"
                stackId="a"
                fill={colors.disposal}
                name="Disposal"
              >
                <LabelList
                  dataKey="_lisTotal"
                  position="right"
                  formatter={(v: number) => formatLis(v)}
                  className="text-xs font-medium text-gray-700"
                />
              </Bar>
            </>
          ) : (
            // RIS: single solid bar per material
            <Bar dataKey="ris" fill={colors.risBar} name="RIS" barSize={30}>
              <LabelList
                dataKey="ris"
                position="right"
                formatter={(v: number) => formatRis(v)}
                className="text-xs font-medium text-gray-700"
              />
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
