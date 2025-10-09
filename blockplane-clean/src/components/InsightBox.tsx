import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Insight } from "../aiAgent";

interface InsightBoxProps {
  insight: Insight;
}

const InsightBox: React.FC<InsightBoxProps> = ({ insight }) => {
  if (!insight) return null;

  const chartData = [
    { name: "LIS", value: insight.LIS },
    { name: "RIS", value: insight.RIS },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">AI Summary</h3>

      <p className="mb-2 text-gray-700">
        <strong>Summary:</strong> {insight.summary}
      </p>

      <p className="mb-2 text-gray-700">
        <strong>Takeaway:</strong> {insight.takeaway}
      </p>

      <p className="mb-2 text-gray-700">
        <strong>Compliance:</strong> {insight.compliance}
      </p>

      <BarChart data={chartData} />

      <div className="mt-3 text-sm text-gray-600">
        <p>
          <strong>Model:</strong> {insight.model}
        </p>
        {Array.isArray(insight.flags) && insight.flags.length > 0 && (
          <p>
            <strong>Flags:</strong> {insight.flags.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default InsightBox;

// ---- Shared Reusable BarChart Component ----
type BarChartData = {
  name: string;
  value: number;
};

interface BarChartProps {
  data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <ReBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#4caf50" />
    </ReBarChart>
  </ResponsiveContainer>
);
