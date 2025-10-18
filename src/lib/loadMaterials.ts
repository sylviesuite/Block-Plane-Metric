// src/lib/loadMaterials.ts
export async function loadMaterials() {
  const v = import.meta.env.VITE_BUILD_VERSION ?? Date.now();
  const res = await fetch(`/data/materials.v2.json?v=${v}`, { cache: "no-store" });
  const text = await res.text();

  // Replace control chars only when inside a JSON string (handles newlines too)
  const CTRL_MIN = 0x00, CTRL_MAX = 0x1f;
  let out = "";
  let inStr = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (!inStr) {
      out += ch;
      if (ch === '"') inStr = true;
      continue;
    }

    // inside string
    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      out += ch;
      escaped = true;
      continue;
    }

    if (ch === '"') {
      out += ch;
      inStr = false;
      continue;
    }

    const code = ch.charCodeAt(0);
    if (code >= CTRL_MIN && code <= CTRL_MAX) {
      out += `\\u${code.toString(16).padStart(4, "0")}`;
    } else {
      out += ch;
    }
  }

  return JSON.parse(out);
}
