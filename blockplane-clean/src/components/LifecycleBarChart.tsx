import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  LabelList,
} from "recharts";

export type MaterialPhaseData = {
  name: string;
  lis?: number;
  ris?: number;
  origin?: number;
  factory?: number;
  transport?: number;
  construction?: number;
  disposal?: number;
};

type RefLine = { value: number; label?: string };

export default function LifecycleBarChart({
  data,
  baselineData,
  showBaseline = true,
  viewMode,
  referenceLine,
  onSvgMount,
}: {
  data: MaterialPhaseData[];
  baselineData?: MaterialPhaseData[];
  showBaseline?: boolean;
  viewMode: "LIS" | "RIS";
  referenceLine?: RefLine | null;
  onSvgMount?: (svg: SVGSVGElement | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const sumPhases = (d?: MaterialPhaseData) =>
    (d?.origin ?? 0) +
    (d?.factory ?? 0) +
    (d?.transport ?? 0) +
    (d?.construction ?? 0) +
    (d?.disposal ?? 0);

  // Merge scenario + baseline by name
  const merged = useMemo(() => {
    const baseByName = new Map<string, MaterialPhaseData>();
    (baselineData ?? []).forEach((b) => baseByName.set(b.name, b));

    return (data ?? []).map((d) => {
      const b = baseByName.get(d.name);
      const scenarioLis = d.lis ?? sumPhases(d);
      const baselineLis = b ? (b.lis ?? sumPhases(b)) : undefined;
      const scenarioRis = d.ris ?? 0;
      const baselineRis = b?.ris;
      return {
        ...d,
        __scenarioTotal: viewMode === "LIS" ? scenarioLis : scenarioRis,
        __baselineTotal: viewMode === "LIS" ? baselineLis : baselineRis,
      };
    });
  }, [data, baselineData, viewMode]);

  // Expose the inner <svg> for export
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!onSvgMount) return;
    const el = containerRef.current?.querySelector(
      "svg",
    ) as SVGSVGElement | null;
    onSvgMount(el || null);
    // cleanup: null out when unmount
    return () => onSvgMount(null);
  }, [mounted, data, baselineData, viewMode, onSvgMount]);

  const phases = [
    "origin",
    "factory",
    "transport",
    "construction",
    "disposal",
  ] as const;
  const hasPhases = merged.some(
    (d) => phases.some((p) => (d as any)[p] != null) && d.lis == null, // prefer stacked when LIS not explicitly given
  );

  return (
    <div ref={containerRef} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={merged}
          margin={{ top: 8, right: 12, left: 8, bottom: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            interval={0}
            height={48}
            angle={-20}
            textAnchor="end"
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v: any) =>
              typeof v === "number"
                ? new Intl.NumberFormat(undefined, {
                    maximumFractionDigits: 1,
                  }).format(v)
                : v
            }
          />
          <Legend />

          {/* Reference line (e.g., Paris target) */}
          {referenceLine && viewMode === "LIS" && (
            <ReferenceLine
              y={referenceLine.value}
              stroke="#111"
              strokeDasharray="3 3"
              label={referenceLine.label ?? ""}
            />
          )}

          {/* Baseline ghost bar (behind scenario) */}
          {showBaseline && (
            <Bar
              dataKey="__baselineTotal"
              name="Baseline"
              barSize={hasPhases ? 22 : 32}
              fill="#000000"
              fillOpacity={0.15}
              isAnimationActive={false}
            />
          )}

          {/* Scenario: stacked LIS phases if present; otherwise single total */}
          {viewMode === "LIS" ? (
            hasPhases ? (
              <>
                <Bar
                  dataKey="origin"
                  name="Origin"
                  stackId="s"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="factory"
                  name="Factory"
                  stackId="s"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="transport"
                  name="Transport"
                  stackId="s"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="construction"
                  name="Construction"
                  stackId="s"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="disposal"
                  name="Disposal"
                  stackId="s"
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="__scenarioTotal"
                    position="top"
                    className="text-[10px]"
                    formatter={(v: any) =>
                      typeof v === "number"
                        ? new Intl.NumberFormat(undefined, {
                            maximumFractionDigits: 0,
                          }).format(v)
                        : v
                    }
                  />
                </Bar>
              </>
            ) : (
              <Bar
                dataKey="__scenarioTotal"
                name="Scenario LIS"
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="__scenarioTotal"
                  position="top"
                  className="text-[10px]"
                  formatter={(v: any) =>
                    typeof v === "number"
                      ? new Intl.NumberFormat(undefined, {
                          maximumFractionDigits: 0,
                        }).format(v)
                      : v
                  }
                />
              </Bar>
            )
          ) : (
            <Bar
              dataKey="__scenarioTotal"
              name="Scenario RIS"
              isAnimationActive={false}
            >
              <LabelList
                dataKey="__scenarioTotal"
                position="top"
                className="text-[10px]"
                formatter={(v: any) =>
                  typeof v === "number"
                    ? new Intl.NumberFormat(undefined, {
                        maximumFractionDigits: 1,
                      }).format(v)
                    : v
                }
              />
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
