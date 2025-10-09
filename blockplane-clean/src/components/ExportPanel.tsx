// src/components/ExportPanel.tsx
import React from "react";
import type { Row, AltRec } from "../types";

export interface ExportPanelProps {
  rows: Row[];
  baselineName: string;
  version: string;
  altRecs?: AltRec[];
  chartSvg?: SVGSVGElement | null;
  className?: string;
}

const ORDERED_KEYS = [
  "category",
  "subtype",
  "name",
  "unit",
  "quantity",
  "origin",
  "factory",
  "transport",
  "construction",
  "disposal",
  "lis",
  "ris",
  "price",
  "cpi",
] as const;

function rowsToCSV(rows: Row[]): string {
  if (!rows.length) return "";
  const present = new Set<string>();
  rows.forEach((r) => Object.keys(r).forEach((k) => present.add(k)));
  const headers = ORDERED_KEYS.filter((k) =>
    present.has(k as string),
  ) as string[];
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc((r as any)[h])).join(",")),
  ].join("\n");
}

function download(filename: string, mime: string, data: string | Blob) {
  const blob =
    typeof data === "string" ? new Blob([data], { type: mime }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  rows,
  baselineName,
  version,
  altRecs = [],
  chartSvg,
  className,
}) => {
  const onDownloadCSV = () =>
    download(
      `blockplane-${baselineName}-data.csv`,
      "text/csv;charset=utf-8",
      rowsToCSV(rows),
    );

  const onDownloadJSON = () => {
    const payload = {
      baseline: baselineName,
      version,
      generatedAt: new Date().toISOString(),
      counts: { materials: rows.length, altRecs: altRecs.length },
      rows,
      altRecs,
    };
    download(
      `blockplane-${baselineName}-snapshot.json`,
      "application/json",
      JSON.stringify(payload, null, 2),
    );
  };

  const onPrintReport = () => {
    const win = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=1024,height=768",
    );
    if (!win) return;
    const chartHTML = chartSvg
      ? chartSvg.outerHTML
      : "<!-- no chart available -->";
    const date = new Date().toLocaleString();
    win.document.write(`
<!doctype html><html><head><meta charset="utf-8" />
<title>BlockPlane Report – ${baselineName}</title>
<style>
 body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;margin:24px;color:#111}
 h1{font-size:22px;margin:0 0 8px} h2{font-size:16px;margin:16px 0 8px}
 .muted{opacity:.7;font-size:12px} .box{border:1px solid #ddd;border-radius:10px;padding:12px;margin:12px 0}
 svg{max-width:100%} table{width:100%;border-collapse:collapse;font-size:12px}
 th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}
</style></head><body>
  <h1>BlockPlane Report</h1>
  <div class="muted">Baseline: <b>${baselineName}</b> • Version ${version} • Generated ${date}</div>
  <div class="box"><h2>Lifecycle Chart</h2>${chartHTML}</div>
  <div class="box">
    <h2>Suggested Alternatives (${altRecs.length})</h2>
    ${
      altRecs.length
        ? `<table><thead><tr>
             <th>From</th><th>To</th><th>ΔLIS</th><th>ΔCPI</th><th>ΔRIS</th><th>Notes</th>
           </tr></thead><tbody>
           ${altRecs
             .map(
               (r) => `<tr>
             <td>${r.baseName}</td><td>${r.altName}</td>
             <td>${Math.round(r.deltaLIS)}</td>
             <td>${r.deltaCPI != null ? r.deltaCPI.toFixed(1) : "—"}</td>
             <td>${r.deltaRIS != null ? r.deltaRIS.toFixed(1) : "—"}</td>
             <td>${(r.notes ?? []).join(", ")}</td>
           </tr>`,
             )
             .join("")}
           </tbody></table>`
        : `<div class="muted">No strong alternatives identified with current thresholds.</div>`
    }
  </div>
  <div class="box">
    <h2>Materials (${rows.length})</h2>
    <table><thead><tr>
      <th>Name</th><th>Category</th><th>Subtype</th><th>Unit</th><th>Qty</th>
      <th>LIS</th><th>RIS</th><th>Price</th><th>CPI</th>
    </tr></thead><tbody>
      ${rows
        .map(
          (r) => `<tr>
        <td>${r.name ?? ""}</td><td>${r.category ?? ""}</td><td>${r.subtype ?? ""}</td>
        <td>${r.unit ?? ""}</td><td>${r.quantity ?? ""}</td>
        <td>${r.lis ?? ""}</td><td>${r.ris ?? ""}</td><td>${r.price ?? ""}</td><td>${r.cpi ?? ""}</td>
      </tr>`,
        )
        .join("")}
    </tbody></table>
  </div>
  <div class="muted">© BlockPlane • ${new Date().getFullYear()}</div>
  <script>window.print();</script>
</body></html>`);
    win.document.close();
  };

  return (
    <div className={className}>
      <div className="inline-flex gap-2">
        <button
          type="button"
          onClick={onDownloadCSV}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Download CSV
        </button>
        <button
          type="button"
          onClick={onDownloadJSON}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Download JSON
        </button>
        <button
          type="button"
          onClick={onPrintReport}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Print Report
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;
