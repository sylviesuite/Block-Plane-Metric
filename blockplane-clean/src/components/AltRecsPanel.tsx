import React from "react";

export type AltRec = {
  id: string;
  name: string;
  score: number; // 0-100
  sustainability: "high" | "medium" | "low";
  reasons?: string[];
};

const AltRecsPanel: React.FC<{
  alternatives: AltRec[];
  selectedMaterial?: string;
}> = ({ alternatives, selectedMaterial }) => {
  if (!alternatives?.length) return null;
  return (
    <div className="p-4 rounded border border-gray-200 dark:border-white/10">
      <div className="font-medium mb-2">
        Alternatives{selectedMaterial ? ` for ${selectedMaterial}` : ""}
      </div>
      <ul className="space-y-1">
        {alternatives.map((a) => (
          <li key={a.id} className="text-sm flex items-center justify-between">
            <span>{a.name}</span>
            <span className="text-gray-500 dark:text-gray-400">
              {a.score}/100
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AltRecsPanel;
