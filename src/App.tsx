import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    }}>
      <section style={{ textAlign: "center", maxWidth: 720, padding: 24 }}>
        <h1 style={{ fontSize: "3rem", margin: 0 }}>Blockplane Integrated</h1>
        <p style={{ fontSize: "1.125rem", opacity: 0.8, marginTop: 12 }}>
          Vite + React scaffold is live. Edit <code>src/App.tsx</code> and the page updates instantly.
        </p>

        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => setCount((c) => c + 1)}
            style={{
              fontSize: "1rem",
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer"
            }}
          >
            Count is {count}
          </button>
        </div>
      </section>
    </main>
  );
}
