// src/lib/shortcuts.ts
export type KeyHandler = () => void;

/** Bind simple, app-wide keyboard shortcuts. Returns an unbind cleanup fn. */
export default function shortcuts(bind: Record<string, KeyHandler>) {
  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    const fn = bind[k];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}
