import React, { useState } from "react";

type Material = {
  id: number;
  name: string;
  lis: number;
  ris: number;
  cost: number;
  category: string;
  ris_sub_scores: {
    carbon: number;
    energy: number;
    durability: number;
    circularity: number;
    health: number;
    biodiversity: number;
  };
};

const BlockPlaneMVP: React.FC = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([
    {
      id: 1,
      name: "Concrete (Standard)",
      lis: 2.8,
      ris: 1.2,
      cost: 45,
      category: "structural",
      ris_sub_scores: {
        carbon: 65,
        energy: 70,
        durability: 85,
        circularity: 20,
        health: 60,
        biodiversity: 25,
      },
    },
    // Add more materials here as needed
  ]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">BlockPlane MVP</h1>
      <ul className="space-y-2">
        {selectedMaterials.map((material) => (
          <li key={material.id} className="border rounded p-3 shadow">
            <strong>{material.name}</strong> — LIS: {material.lis}, RIS:{" "}
            {material.ris}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockPlaneMVP;
