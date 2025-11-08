import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import LovableChartPage from "./pages/LovableShowcase";
import LifecycleBreakdown from "./pages/LifecycleBreakdown";
import LovableShowcase from "./pages/LovableShowcase";
import Visuals from "./pages/Visuals";

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Home() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">BlockPlane</h1>
      <p className="mt-2">
        <Link className="underline text-emerald-700" to="/lifecycle">Open Lifecycle</Link>
      </p>
    </main>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen p-6 text-center">
      <h1 className="text-lg font-semibold">404 – Not Found</h1>
      <p className="mt-2"><Link className="underline text-emerald-700" to="/">Go Home</Link></p>
    </main>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/lifecycle" element={<LovableShowcase />} />
  <Route path="/visuals" element={<Visuals />} />
  <Route path="*" element={<NotFound />} />
</Routes>
    </>
  );
}
