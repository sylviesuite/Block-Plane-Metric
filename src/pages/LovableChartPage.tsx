import React from "react";
import rows from "../data/lifecycle.demo"; // if alias fails, switch to: ../data/lifecycle.demo
import LifecycleBar from "../components/lifecycle/LovableLifecycleBar";

export default function LovableChartPage() {
  return (
    <div className="p-6 min-h-screen" style={{ background: "#F5F5F4" }}>
      <h1 className="text-3xl font-semibold mb-6">Lovable Comparative Energy Breakdown</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {rows.map((m) => (
          <div key={m.name} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4">
            {/* LifecycleBar expects a single material "datum" */}
            <LifecycleBar datum={{ name: m.name, phases: m.phases, total: m.total! }} xDomain={[0, 8000]} />
          </div>
        ))}
      </div>
    </div>
  );
}
