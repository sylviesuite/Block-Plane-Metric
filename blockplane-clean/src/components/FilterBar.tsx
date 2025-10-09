import React from 'react';

type Props = {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  subtype: string;
  onSubtypeChange: (v: string) => void;
  categories: string[];
  subtypes: string[];
  filteredCount: number;
  totalCount: number;
  isLoading?: boolean;
};

export default function FilterBar({
  searchTerm, onSearchChange,
  category, onCategoryChange,
  subtype, onSubtypeChange,
  categories, subtypes,
  filteredCount, totalCount, isLoading
}: Props) {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm mb-1">Search</label>
        <input
          className="w-full rounded-md border px-3 py-2 bg-white dark:bg-zinc-900 dark:border-white/10"
          placeholder="Name, category, subtype…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select
            className="w-full rounded-md border px-3 py-2 bg-white dark:bg-zinc-900 dark:border-white/10"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Subtype</label>
          <select
            className="w-full rounded-md border px-3 py-2 bg-white dark:bg-zinc-900 dark:border-white/10"
            value={subtype}
            onChange={(e) => onSubtypeChange(e.target.value)}
          >
            <option value="">All</option>
            {subtypes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        {isLoading ? 'Loading…' : `Showing ${filteredCount.toLocaleString()} of ${totalCount.toLocaleString()}`}
      </div>
    </div>
  );
}
