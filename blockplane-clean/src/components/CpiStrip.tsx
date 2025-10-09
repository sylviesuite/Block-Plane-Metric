// src/components/CpiStrip.tsx
import React from "react";

export interface CpiItem {
  name: string;
  unit?: string;
  price?: number;
  cpi?: number;
}

export interface CpiStripProps {
  items: CpiItem[];
  title?: string;
}

const fmtCurrency = (v?: number) =>
  v == null || !Number.isFinite(v)
    ? "—"
    : new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(v);

const fmtNumber = (v?: number) =>
  v == null || !Number.isFinite(v) ? "—" : new Intl.NumberFormat().format(v);

const CpiStrip: React.FC<CpiStripProps> = ({
  items,
  title = "Price & CPI",
}) => {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((it, idx) => (
          <div
            key={it.name}
            className="flex items-center justify-between rounded-md border p-2"
          >
            <div className="min-w-0">
              <div className="truncate font-medium">{it.name}</div>
              {it.unit && <div className="text-xs opacity-70">{it.unit}</div>}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full border px-2 py-0.5">
                Price: {fmtCurrency(it.price)}
              </span>
              <span className="rounded-full border px-2 py-0.5">
                CPI: {fmtNumber(it.cpi)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CpiStrip;
