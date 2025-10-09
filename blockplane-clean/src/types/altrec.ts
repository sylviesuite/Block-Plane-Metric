export type AltRec = {
  baseName: string;      // original material
  altName: string;       // suggested alternative

  // Preferred fields used by the UI
  deltaCPI?: number;     // change in CPI
  deltaRIS?: number;     // change in RIS
  deltaLIS?: number;     // change in LIS

  // Legacy synonyms (back-compat)
  lisDelta?: number;
  risDelta?: number;
  costDelta?: number;

  // Optional metadata some UIs read
  score?: number;
  confidence?: number;
  subtype?: string;
  reason?: string;
  notes?: string | string[];
};
