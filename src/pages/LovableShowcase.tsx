import React from "react";
import rows from "../data/lovable.demo";
import LifecycleBar from "../lovable/components/charts/LifecycleBar";

export default function LovableShowcase(): JSX.Element {
  const maxTotal = Math.max(...rows.map(r => r.total ?? 0), 1);
  return (
    <main className="container mx-auto max-w-6xl px-4 my-10">
      <h1 className="text-4xl font-bold mb-6">Lovable Chart Showcase</h1>
      <div className="grid gap-6">
        {rows.map((m) => (
          <div key={m.name} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <LifecycleBar datum={{ name: m.name, phases: m.phases, total: m.total }} xDomain={[0, maxTotal]} />
          </div>
        ))}
      </div>
    </main>
  );
}
