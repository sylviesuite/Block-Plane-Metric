import { useState } from "react";

const page = {
  bg: "#0b1020",
  fg: "#e8ecf1",
  accent: "#7dd3fc"
};

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: page.bg,
        color: page.fg,
        display: "grid",
        placeItems: "center",
        padding: "5rem 1.25rem",
      }}
    >
      <section
        style={{
          width: "min(960px, 92vw)",
          display: "grid",
          gap: "1.25rem",
          alignItems: "start"
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: 0,
            background: `linear-gradient(90deg, ${page.fg} 0%, ${page.accent} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Blockplane Integrated
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
            opacity: 0.9,
            maxWidth: "60ch"
          }}
        >
          Vite + React scaffold is live. Edit <code>src/App.tsx</code> and the page updates instantly.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
          <button
            onClick={() => setCount((c) => c + 1)}
            style={{
              appearance: "none",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              color: page.fg,
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 120ms ease, background 120ms ease, border-color 120ms ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Count is {count}
          </button>

          <a
            href="https://github.com/sylviesuite/blockplane-integrated"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              textDecoration: "none",
              color: page.bg,
              background: page.fg,
              fontWeight: 700,
            }}
          >
            View repo →
          </a>
        </div>
      </section>

      <footer
        style={{
          position: "fixed",
          insetInline: 0,
          bottom: 16,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
        }}
      >
        <small style={{ opacity: 0.6, pointerEvents: "auto" }}>
          Built with Vite + React
        </small>
      </footer>
    </main>
  );
}
