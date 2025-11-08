import type { BPItem } from "./blockplane";
const materials: BPItem[] = [
  { name: "Douglas Fir Framing", phases: { origin: 260, production: 540, transport: 210, construction: 120, disposal: 80 } },
  { name: "Concrete Foundation", phases: { origin: 520, production: 3200, transport: 380, construction: 700, disposal: 420 } },
  { name: "Steel Rebar", phases: { origin: 980, production: 4800, transport: 420, construction: 650, disposal: 520 } },
  { name: "Fiberglass Insulation", phases: { origin: 320, production: 980, transport: 140, construction: 220, disposal: 110 } },
  { name: "Asphalt Shingles", phases: { origin: 860, production: 2200, transport: 360, construction: 540, disposal: 620 } },
  { name: "Vinyl Siding", phases: { origin: 900, production: 1800, transport: 300, construction: 480, disposal: 520 } },
];
export default materials;
