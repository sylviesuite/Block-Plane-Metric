import React from 'react';

type Row = Record<string, unknown>;

function toCSV(rows: Row[]) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(','), ...rows.map(r => headers.map(h => esc((r as any)[h])).join(','))];
  return lines.join('\n');
}

export default function ShareBar({
  rows,
  total,
  title = 'Share Your Analysis',
}: {
  rows: Row[];
  total: number;
  title?: string;
}) {
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    } catch {
      prompt('Copy this link:', url);
    }
  };

  const handleExport = () => {
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: 'materials.csv',
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="print:hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-3 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Showing {rows.length} of {total}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-white/10"
          >
            Share
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-white/10"
          >
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-md border text-sm bg-black text-white dark:bg-white dark:text-black"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
