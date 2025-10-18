// src/lib/loadMaterials.ts
export async function loadMaterials() {
  const res = await fetch('/data/materials.json'); // expects public/data/materials.json
  const text = await res.text();

  // Replace illegal control chars U+0000–U001F except \t \n \r
  const sanitized = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, (c) =>
    `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`
  );

  return JSON.parse(sanitized);
}
