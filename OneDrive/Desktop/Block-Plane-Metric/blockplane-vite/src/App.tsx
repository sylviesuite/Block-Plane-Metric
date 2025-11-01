import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import LifecycleBreakdown from "@/pages/LifecycleBreakdown";

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-4 flex gap-4 border-b">
        <Link to="/lifecycle" className="underline">Lifecycle Breakdown</Link>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/lifecycle" replace />} />
        <Route path="/lifecycle" element={<LifecycleBreakdown />} />
      </Routes>
    </BrowserRouter>
  );
}
