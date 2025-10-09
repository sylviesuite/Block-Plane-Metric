cat > src/types/index.ts
export type Material = {
  id: string;
  name: string;
  category: string;
  subtype: string;
  lifespan: number;
  carbonFootprint: number;
  recyclability: string;
  cost: number;
};

export type Sort = {
  field: keyof Material;
  dir: 'asc' | 'desc';
};

export type Row = Material; // For legacy compatibility

export type AltRec = {
  name: string;
  description: string;
  benefit: string;
};

export type Insight = {
  label: string;
  value: string | number;
  impact?: 'high' | 'medium' | 'low';
  suggestion?: string;
};
