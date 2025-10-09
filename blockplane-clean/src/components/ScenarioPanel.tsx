import React, { useMemo, useState } from "react";
import type { ReplacementMap } from "../lib/scenario";

export default function ScenarioPanel({
  replacements,
  onChange,
}: {
  replacements: ReplacementMap;
  onChange: (next: ReplacementMap) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const pairs = useMemo(
    () => Object.entries(replacements).sort(([a], [b]) => a.localeCompare(b)),
    [replacements],
  );

  const add = () => {
    const f = from.trim();
    const t = to.trim();
    if (!f || !t) return;
    onChange({ ...replacements, [f]: t });
    setFrom("");
    setTo("");
  };

  const remove = (key: string) => {
    const next = { ...replacements };
    delete next[key];
    onChange(next);
  };

  const clearAll = () => onChange({});

  return (
    <div className="rounded-lg border p-3 bg-white space-y-3">
      <div className="flex items-end gap-2">
        <div className="grow">
          <label className="block text-xs mb-1">Replace name</label>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="e.g., Portland cement"
            className="w-full rounded-md border px-2 py-1 text-sm"
          />
        </div>
        <div className="grow">
          <label className="block text-xs mb-1">With</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="e.g., Slag cement (50%)"
            className="w-full rounded-md border px-2 py-1 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Add
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-md border px-3 py-2 text-sm"
          title="Clear all scenario swaps"
        >
          Clear
        </button>
      </div>

      {pairs.length > 0 ? (
        <div className="text-sm">
          <div className="opacity-70 mb-1">Active replacements</div>
          <ul className="divide-y border rounded-md">
            {pairs.map(([f, t]) => (
              <li
                key={f}
                className="flex items-center justify-between gap-2 px-3 py-2"
              >
                <div className="font-mono">
                  <span className="opacity-70">{f}</span>{" "}
                  <span className="opacity-50">→</span> <b>{t}</b>
                </div>
                <button
                  type="button"
                  onClick={() => remove(f)}
                  className="rounded-md border px-2 py-1 text-xs"
                  aria-label={`Remove replacement ${f} to ${t}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-xs opacity-70">
          No replacements yet. Add one above.
        </div>
      )}
    </div>
  );
}
