import React from "react";

export type GroupMode = "items" | "category" | "subtype";

export default function RollupToggle({
  value,
  onChange,
}: {
  value: GroupMode;
  onChange: (m: GroupMode) => void;
}) {
  const modes: GroupMode[] = ["items", "category", "subtype"];

  return (
    <div className="inline-flex rounded-md border overflow-hidden">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`px-3 py-1 text-sm ${
            value === m ? "bg-black text-white" : "bg-white"
          }`}
          aria-pressed={value === m}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
