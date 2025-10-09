import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = {
  // Legacy usage: <StatsHeader stats={{ ... }} />
  stats?: LegacyStats;
} & ExtendedProps;

function fmtNum(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString();
}
function fmtFloat(n?: number, digits = 2) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toFixed(digits);
}
function fmtCurrency(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const StatsHeader: React.FC<Props> = (props) => {
  const totalMaterials =
    typeof props.totalMaterials === "number"
      ? props.totalMaterials
      : props.stats?.totalMaterials ?? 0;

  const avgLifespan =
    typeof props.stats?.avgLifespan === "number" ? props.stats!.avgLifespan : undefined;

  const topCategory = props.stats?.topCategory;
  const sustainabilityScore =
    typeof props.stats?.sustainabilityScore === "number" ? props.stats!.sustainabilityScore : undefined;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];

  items.push({ label: "Total Materials", value: fmtNum(totalMaterials), hint: "In dataset" });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value:
        percentFiltered !== undefined
          ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
          : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({
      label: "Avg Lifespan",
      value: `${fmtFloat(avgLifespan)} years`,
      hint: "Across visible rows",
    });
  }

  if (topCategory) {
    items.push({ label: "Top Category", value: topCategory, hint: "Most represented" });
  }

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") {
    items.push({ label: "Avg LIS", value: fmtFloat(averageLIS, 1), hint: "Lower is better" });
  }
  if (typeof averageRIS === "number") {
    items.push({ label: "Avg RIS", value: fmtFloat(averageRIS, 1), hint: "Higher is better" });
  }
  if (typeof totalCost === "number") {
    items.push({ label: "Total Cost", value: fmtCurrency(totalCost), hint: "Sum of visible" });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{it.label}</div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
