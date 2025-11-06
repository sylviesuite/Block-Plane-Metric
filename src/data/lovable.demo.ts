/**
 * Minimal demo data for the Lovable showcase.
 * Matches <LifecycleBar datum={{ name, phases, total }} />
 */
export type PhaseMap = Record<string, number>;
export type Row = { name: string; phases: PhaseMap; total: number };

const rows: Row[] = [
  {
    name: "Rammed Earth",
    phases: { production: 320, transport: 180, construction: 220, maintenance: 60, endOfLife: 40 },
    get total() { return Object.values(this.phases).reduce((a,b)=>a+b,0); }
  } as unknown as Row, // keep it simple for now
  {
    name: "2x6 Wall",
    phases: { production: 620, transport: 260, construction: 280, maintenance: 70, endOfLife: 20 },
    get total() { return Object.values(this.phases).reduce((a,b)=>a+b,0); }
  } as unknown as Row,
  {
    name: "Hempcrete (6\" infill)",
    phases: { production: 260, transport: 120, construction: 120, maintenance: 30, endOfLife: 10 },
    get total() { return Object.values(this.phases).reduce((a,b)=>a+b,0); }
  } as unknown as Row,
  {
    name: "Drywall 4x8 (1/2\")",
    phases: { production: 340, transport: 120, construction: 60, maintenance: 20, endOfLife: 10 },
    get total() { return Object.values(this.phases).reduce((a,b)=>a+b,0); }
  } as unknown as Row,
];

export default rows;
