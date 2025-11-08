export default function FiltersSetup() {
  return <div className="p-6">Filters Setup Page</div>;
}
import { useNavigate } from "react-router-dom";

export default function FiltersSetup() {
  const nav = useNavigate();
  return (
    <section className="p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Filters & Project Setup</h1>
        <p className="mt-2 text-slate-600">Configure your analysis parameters before selecting materials.</p>
      </header>

      <div className="grid gap-4 max-w-2xl">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select className="mt-1 w-full rounded-md border p-2">
            <option>Wall Systems</option>
            <option>Roof Systems</option>
            <option>Floor Systems</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Lifecycle Scope</span>
          <select className="mt-1 w-full rounded-md border p-2">
            <option>A1–A5 (Production to Construction)</option>
            <option>A1–A3 (Production only)</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Units</span>
          <select className="mt-1 w-full rounded-md border p-2">
            <option>kg CO₂e per m²</option>
            <option>kg CO₂e</option>
          </select>
        </label>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => nav("/select")}
          className="rounded-md bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
        >
          Next: Select Materials
        </button>
      </div>
    </section>
  );
}
