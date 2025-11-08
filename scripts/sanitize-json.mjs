// src/lib/loadMaterials.ts
export async function loadMaterials() {
const v = import.meta.env.VITE_BUILD_VERSION ?? Date.now();
const res = await fetch(`/data/materials.v2.json?v=${v}`, { cache: "no-store" });

  const text = await res.text();

  // Sanitize ONLY inside JSON string tokens
  const STRING_RE = /"([^"\\]|\\.)*"/g;
  const CTRL_RE = /[\u0000-\u001F]/g;

  const sanitized = text.replace(STRING_RE, (str) => {
    const inner = str.slice(1, -1);
    const cleanedInner = inner.replace(CTRL_RE, (c) =>
      `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`
    );
    return `"${cleanedInner}"`;
  });

  return JSON.parse(sanitized);
}

