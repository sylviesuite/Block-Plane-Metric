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

export type Sort = { field: keyof Material; dir: 'asc' | 'desc' };
