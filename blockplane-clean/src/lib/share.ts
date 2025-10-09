// src/lib/share.ts
import type { Filters } from "../types";
import type { GroupMode } from "../components/RollupToggle";
import type { ReplacementMap } from "./scenario";

export type ShareState = {
  f?: Filters; // filters
  v?: "LIS" | "RIS"; // view
  g?: GroupMode; // group mode
  r?: ReplacementMap; // replacements (scenario swaps)
};

export function makeShareHash(state: ShareState): string {
  const json = JSON.stringify(state);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return "#s=" + b64;
}

export function parseShareHash(hash: string): ShareState | null {
  if (!hash || !hash.startsWith("#s=")) return null;
  try {
    const json = decodeURIComponent(escape(atob(hash.slice(3))));
    return JSON.parse(json) as ShareState;
  } catch {
    return null;
  }
}
