import "./index.css";
// CLEAN REGEN VERSION
// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ your real App component
import "./index.css"; // global styles

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
