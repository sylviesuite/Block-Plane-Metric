import React from 'react';

export default function ShareBanner({
  onShare, onExport, onPrint,
}: { onShare?: () => void; onExport?: () => void; onPrint?: () => void; }) {
  return (
    <div className="print:hidden border rounded p-3 mb-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="font-medium">Share Your Analysis</div>
          <div className="text-sm text-gray-500">Export your material analysis or share findings</div>
        </div>
        <div className="flex gap-2">
          {onShare && <button className="px-3 py-1 border rounded" onClick={onShare} aria-label="Share via link">Share</button>}
          {onExport && <button className="px-3 py-1 border rounded" onClick={onExport} aria-label="Export CSV">Export CSV</button>}
          {onPrint && <button className="px-3 py-1 border rounded" onClick={onPrint} aria-label="Print / Save PDF">Print Report</button>}
        </div>
      </div>
    </div>
  );
}
