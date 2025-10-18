// scripts/sanitize-json.mjs
import fs from "node:fs";
import path from "node:path";

const roots = ["public/data"]; // add more dirs if needed
const BAD = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

let changed = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const f of fs.readdirSync(root)) {
    if (!f.endsWith(".json")) continue;
    const p = path.join(root, f);
    const txt = fs.readFileSync(p, "utf8");
    if (!BAD.test(txt)) continue;
    const cleaned = txt.replace(BAD, (c) =>
      `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`
    );
    fs.writeFileSync(p, cleaned, "utf8");
    console.log(`sanitized: ${p}`);
    changed++;
  }
}
console.log(changed ? `✅ sanitized ${changed} file(s)` : "✅ no bad control chars found");
