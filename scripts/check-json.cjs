const fs = require('fs');

function check(file) {
  const s = fs.readFileSync(file, 'utf8');
  try {
    JSON.parse(s);
    console.log(`OK  ${file}`);
  } catch (e) {
    const m = String(e.message).match(/position (\d+)/);
    if (!m) throw e;
    const pos  = +m[1];
    const pre  = s.slice(0, pos);
    const line = pre.split('\n').length;
    const col  = pre.length - pre.lastIndexOf('\n');
    console.error(`BAD ${file}  →  ${e.message}  (line ${line}, col ${col})`);
    const lines = s.split('\n');
    const a = Math.max(0, line - 3), b = Math.min(lines.length, line + 2);
    for (let i = a; i < b; i++) console.error(String(i+1).padStart(5)+': '+lines[i]);
    process.exitCode = 1;
  }
}

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/check-json.js <path.json>'); process.exit(2); }
check(file);
