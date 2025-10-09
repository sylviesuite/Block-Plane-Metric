// src/components/AltRecs.tsx
import React from "react";
import type { AltRec } from "../types";

export interface AltRecsProps {
  items: AltRec[];
  title?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n);

const pct = (x: number) =>
  new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(x);

const AltRecs: React.FC<AltRecsProps> = ({
  items,
  title = "Suggested Alternatives",
}) => {
  if (!items.length) return null;

  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm font-medium mb-2">{title}</div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li
            key={`${it.baseName}->${it.altName}-${i}`}
            className="rounded-md border p-3"
          >
            <div className="text-sm">
              <span className="font-medium">{it.baseName}</span>
              {" → "}
              <span className="font-medium">{it.altName}</span>
              {typeof it.score === "number" && (
                <span className="ml-2 text-xs opacity-70">
                  score {pct(it.score)}
                </span>
              )}
              {typeof it.confidence === "number" && (
                <span className="ml-2 text-xs opacity-70">
                  conf {pct(it.confidence)}
                </span>
              )}
            </div>
            <div className="text-xs opacity-80 mt-1 flex flex-wrap gap-2">
              <span className="rounded-full border px-2 py-0.5">
                −{fmt(it.deltaLIS)} LIS
              </span>
              {it.deltaCPI != null && it.deltaCPI > 0 && (
                <span className="rounded-full border px-2 py-0.5">
                  −{fmt(it.deltaCPI)} CPI
                </span>
              )}
              {it.deltaRIS != null && it.deltaRIS > 0 && (
                <span className="rounded-full border px-2 py-0.5">
                  +{fmt(it.deltaRIS)} RIS
                </span>
              )}
              {it.category && (
                <span className="rounded-full border px-2 py-0.5">
                  {it.category}
                  {it.subtype ? ` / ${it.subtype}` : ""}
                </span>
              )}
              {it.notes?.map((n, j) => (
                <span key={j} className="rounded-full border px-2 py-0.5">
                  {n}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AltRecs;
