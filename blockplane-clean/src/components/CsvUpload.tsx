// src/components/CsvUpload.tsx
import React, { useRef } from "react";

export interface CsvUploadProps {
  /** Preferred callback: full CSV text */
  onText?: (text: string) => void;
  /** Aliases (kept for compatibility with older code) */
  onLoad?: (text: string) => void;
  onCSVLoaded?: (text: string) => void;

  className?: string;
  buttonLabel?: string;
}

const CsvUpload: React.FC<CsvUploadProps> = ({
  onText,
  onLoad,
  onCSVLoaded,
  className,
  buttonLabel = "Upload CSV",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const emit = (text: string) => {
    onText?.(text);
    onLoad?.(text);
    onCSVLoaded?.(text);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => emit(String(reader.result ?? ""));
    reader.readAsText(file);
    // reset so selecting the same file again still fires change
    e.currentTarget.value = "";
  };

  const handleClick = () => inputRef.current?.click();

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        className="rounded-md border px-3 py-2 text-sm"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default CsvUpload;
