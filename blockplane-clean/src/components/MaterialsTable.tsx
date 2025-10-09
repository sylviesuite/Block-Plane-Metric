import React from 'react';
import { Material, Sort } from '../lib/types';

export default function MaterialsTable({
  rows,
  sort,
  onSort,
}: {
  rows: Material[];
  sort: Sort | null;
  onSort: (s: Sort) => void;
}) {
  const th = (key: Sort['field'], label: string) => {
    const active = sort?.field === key;
    const dir = active ? (sort!.dir === 'asc' ? '▲' : '▼') : '↕';
    return (
      <th
        scope="col"
        className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer"
        onClick={() => onSort({ field: key, dir: active && sort!.dir === 'asc' ? 'desc' : 'asc' })}
        title="Sort"
      >
        <span className="inline-flex items-center gap-1">{label}<span className="text-[10px]">{dir}</span></span>
      </th>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
      <table className="min-w-full text-sm bg-white dark:bg-zinc-900">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr>
            {th('name','Name')}
            {th('category','Category')}
            {th('subtype','Subtype')}
            {th('lifespan','Lifespan (yrs)')}
            {th('carbonFootprint','Carbon (kg CO₂)')}
            {th('recyclability','Recyclability')}
            {th('cost','Cost ($/unit)')}
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id} className="border-t border-gray-100 dark:border-white/10">
              <td className="px-3 py-2">{m.name}</td>
              <td className="px-3 py-2">{m.category}</td>
              <td className="px-3 py-2">{m.subtype}</td>
              <td className="px-3 py-2">{m.lifespan}</td>
              <td className="px-3 py-2">{m.carbonFootprint.toFixed(2)}</td>
              <td className="px-3 py-2">{m.recyclability}</td>
              <td className="px-3 py-2">${m.cost.toFixed(2)}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-6 text-center text-gray-500">No results</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
