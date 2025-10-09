import React, { useMemo } from "react";

export type Row = {
  category: string;
  subtype: string;
  name: string;
  unit: string;
  quantity: number | string;
  notes?: string;
};

type Props = {
  insights: Row[];
};

const InsightWrapper: React.FC<Props> = ({ insights }) => {
  // Basic derived stats (safe even if quantity is a string)
  const { totalItems, totalQuantity } = useMemo(() => {
    let items = insights.length;
    let qty = 0;
    for (const r of insights) {
      const n =
        typeof r.quantity === "string"
          ? Number((r.quantity as string).trim())
          : (r.quantity as number);
      if (!Number.isNaN(n)) qty += n;
    }
    return { totalItems: items, totalQuantity: qty };
  }, [insights]);

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">BlockPlane Baseline</h2>
        <div className="text-sm opacity-70">
          Items: <b>{totalItems}</b> • Total Qty: <b>{totalQuantity}</b>
        </div>
      </header>

      {/* Quick visible table so you know data is flowing */}
      <div className="overflow-auto rounded border">
        <table className="min-w-[640px] text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left px-3 py-2 border-r">Category</th>
              <th className="text-left px-3 py-2 border-r">Subtype</th>
              <th className="text-left px-3 py-2 border-r">Name</th>
              <th className="text-left px-3 py-2 border-r">Unit</th>
              <th className="text-right px-3 py-2 border-r">Qty</th>
              <th className="text-left px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((r, i) => (
              <tr key={i} className="odd:bg-black/0 even:bg-black/2">
                <td className="px-3 py-2 border-t">{r.category}</td>
                <td className="px-3 py-2 border-t">{r.subtype}</td>
                <td className="px-3 py-2 border-t">{r.name}</td>
                <td className="px-3 py-2 border-t">{r.unit}</td>
                <td className="px-3 py-2 border-t text-right">
                  {typeof r.quantity === "string"
                    ? Number((r.quantity as string).trim()) || r.quantity
                    : r.quantity}
                </td>
                <td className="px-3 py-2 border-t">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hook your charts here later, e.g.:
          <LifecycleBarChart data={insights} />
      */}
    </section>
  );
};

export default InsightWrapper;
