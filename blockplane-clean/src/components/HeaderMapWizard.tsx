import React, { useMemo, useState } from "react";

const REQUIRED = ["category", "subtype", "name", "unit", "quantity"] as const;

export default function HeaderMapWizard({
  sampleHeaders,
  sampleRows = [],
  onApply,
  onCancel,
}: {
  sampleHeaders: string[];
  sampleRows?: string[][];
  onApply: (map: Record<string, string>) => void; // {need -> have}
  onCancel: () => void;
}) {
  const [map, setMap] = useState<Record<string, string>>({});
  const missing = REQUIRED.filter((k) => !map[k]);
  const set = (need: string, have: string) =>
    setMap((m) => ({ ...m, [need]: have }));

  const preview = useMemo(() => {
    if (!sampleRows?.length) return [];
    const idx = (h: string) => sampleHeaders.indexOf(h);
    return sampleRows.slice(0, 5).map((row) => {
      const obj: Record<string, string> = {};
      for (const need of REQUIRED) {
        const have = map[need];
        obj[need] = have ? String(row[idx(have)] ?? "") : "";
      }
      return obj;
    });
  }, [sampleRows, sampleHeaders, map]);

  return (
    <div className="rounded-lg border p-4 bg-white space-y-4">
      <div className="text-sm font-medium">Map your CSV headers</div>

      <div className="grid md:grid-cols-3 gap-3">
        {REQUIRED.map((need) => (
          <label key={need} className="text-sm">
            <div className="mb-1 text-xs opacity-70">{need}</div>
            <select
              className="w-full border rounded px-2 py-1"
              value={map[need] ?? ""}
              onChange={(e) => set(need, e.target.value)}
            >
              <option value="">(choose)</option>
              {sampleHeaders.map((h) => (
                <option key={`${need}-${h}`} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {preview.length > 0 && (
        <div className="rounded-lg border">
          <div className="px-3 py-2 text-xs bg-gray-50">
            Preview (first 5 rows)
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr>
                {REQUIRED.map((h) => (
                  <th key={h} className="px-2 py-1 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((r, i) => (
                <tr key={i} className="border-t">
                  {REQUIRED.map((h) => (
                    <td key={h} className="px-2 py-1">
                      {r[h] || <span className="opacity-50">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() => onApply(map)}
          disabled={missing.length > 0}
        >
          Apply & reparse
        </button>
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        {missing.length > 0 && (
          <div className="text-xs opacity-70 self-center">
            Missing: {missing.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
