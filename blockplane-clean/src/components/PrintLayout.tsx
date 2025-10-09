// @ts-nocheck  // keep it simple for now; we can add types later
import React from "react";
import StatsHeader from "./StatsHeader";
import MaterialsTable from "./MaterialsTable";
import AltRecsPanel from "./AltRecsPanel";

const PrintLayout = ({
  stats,
  materials,
  alternatives,
  selectedMaterial,
}: {
  stats: any;
  materials: any[];
  alternatives: any[];
  selectedMaterial: string;
}) => {
  if (!stats || !Array.isArray(materials)) return null;

  return (
    <div className="print:block hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">
          BlockPlane Material Analysis Report
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      <section className="mb-6">
        <StatsHeader stats={stats} />
      </section>

      <section className="mb-6">
        <AltRecsPanel
          alternatives={alternatives ?? []}
          selectedMaterial={selectedMaterial}
        />
      </section>

      <section>
        <MaterialsTable
          materials={materials ?? []}
          sortField="name"
          sortDirection="asc"
          onSort={() => {}}
        />
      </section>
    </div>
  );
};

export default PrintLayout;
