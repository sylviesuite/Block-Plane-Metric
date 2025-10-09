import React from 'react';

function setDark(on: boolean) {
  const el = document.documentElement;
  on ? el.classList.add('dark') : el.classList.remove('dark');
  try { localStorage.setItem('bp:dark', on ? '1' : '0'); } catch {}
}

export default function DarkModeToggle() {
  const [dark, set] = React.useState<boolean>(() => {
    try { return localStorage.getItem('bp:dark') === '1'; } catch { return false; }
  });
  React.useEffect(() => { setDark(dark); }, [dark]);
  return (
    <button
      className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10"
      onClick={() => set(d => !d)}
      aria-pressed={dark}
      title={dark ? 'Switch to light' : 'Switch to dark'}
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
