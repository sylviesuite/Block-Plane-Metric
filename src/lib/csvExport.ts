export type CSVRow = {
  id: string;
  name: string;
  category: string;
  region: string;
  total: number;
  unit: string;
  phases: { label: string; value: number }[];
};
export function exportLifecycleCSV(rows:CSVRow[], filename="lifecycle_export.csv"){
  const headers = ["id","name","category","region","total","unit","phase","phase_value"];
  const out = [headers.join(",")];
  for(const r of rows){
    for(const p of r.phases){
      out.push([
        r.id, q(r.name), q(r.category), q(r.region),
        r.total, q(r.unit), q(p.label), p.value
      ].join(","));
    }
  }
  const blob = new Blob([out.join("\n")], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  URL.revokeObjectURL(a.href);
}
function q(s:string){ return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s }
