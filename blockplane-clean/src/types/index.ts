chmod +x export-type.sh

./export-type.sh AltRec

./export-type.sh AltRec
./export-type.sh CPI
./export-type.sh InsightData
./export-type.sh InsightType
./export-type.sh Material
./export-type.sh MaterialPhaseData
./export-type.sh MaterialTableColumn
./export-type.sh PhaseTotals
./export-type.sh Row
./export-type.sh RIS

cat << 'EOF' > src/components/StatsHeader.tsx
import React from "react";

interface StatsHeaderProps {
  totalMaterials: number;
  filteredMaterials: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({
  totalMaterials,
  filteredMaterials,
  averageLIS,
  averageRIS,
  totalCost,
}) => {
  const percentFiltered = Math.round(
    (filteredMaterials / totalMaterials) * 100
  );

  const formatScore = (score?: number): string =>
    score !== undefined ? score.toFixed(1) : "--";

  const formatCost = (cost?: number): string =>
    cost !== undefined ? \`$\${cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}\` : "--";

  return (
    <div className="w-full rounded-xl bg-white px-6 py-4 shadow-sm dark:bg-zinc-900 print:hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
        <div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {totalMaterials}
          </div>
          <div>Total Materials</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {filteredMaterials}
          </div>
          <div>
            Filtered ({percentFiltered}
            %)
          </div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatScore(averageLIS)}
          </div>
          <div>Avg. LIS</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatScore(averageRIS)}
          </div>
          <div>Avg. RIS</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCost(totalCost)}
          </div>
          <div>Total Cost</div>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
EOF
cat << 'EOF' > src/components/Dashboard.tsx
import React from "react";
import LifecycleBarChart from "./LifecycleBarChart";
import StatsHeader from "./StatsHeader";
import InsightWrapper from "./InsightWrapper";
import type { MaterialRow } from "../types";

interface DashboardProps {
  rows: MaterialRow[];
  viewMode: "LIS" | "RIS";
  referenceLine?: { value: number; label?: string; color?: string } | null;
}

const Dashboard: React.FC<DashboardProps> = ({ rows, viewMode, referenceLine }) => {
  const totalMaterials = rows.length;
  const filteredMaterials = rows.filter((row) => row.visible !== false).length;

  const visibleRows = rows.filter((row) => row.visible !== false);
  const averageLIS =
    visibleRows.reduce((sum, row) => sum + (row.lis ?? 0), 0) / visibleRows.length || 0;
  const averageRIS =
    visibleRows.reduce((sum, row) => sum + (row.ris ?? 0), 0) / visibleRows.length || 0;
  const totalCost = visibleRows.reduce((sum, row) => sum + (row.cost ?? 0), 0);

  return (
    <div className="space-y-6 print:space-y-4">
      <StatsHeader
        totalMaterials={totalMaterials}
        filteredMaterials={filteredMaterials}
        averageLIS={averageLIS}
        averageRIS={averageRIS}
        totalCost={totalCost}
      />
      <LifecycleBarChart
        data={visibleRows}
        viewMode={viewMode}
        referenceLine={referenceLine}
      />
      <InsightWrapper rows={visibleRows} />
    </div>
  );
};

export default Dashboard;
EOF
cat << 'EOF' > src/components/UploadCSV.tsx
import React from "react";

interface UploadCSVProps {
  onFileLoad: (text: string) => void;
}

const UploadCSV: React.FC<UploadCSVProps> = ({ onFileLoad }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onFileLoad(reader.result);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mb-4 print:hidden">
      <label
        htmlFor="csvUpload"
        className="inline-block px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700"
      >
        Upload CSV
      </label>
      <input
        id="csvUpload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default UploadCSV;
EOF
cat << 'EOF' > src/config.ts
// Global config values

export const CSV_PATH = "/BlockPlane-clean.csv";
export const BASELINE_NAME = "Benchmark 2000";
EOF

cat << 'EOF' > src/types.ts
// Shared TypeScript types for data structures

export interface Row {
  category: string;
  subtype: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface MaterialPhaseData {
  name: string;
  lis?: number;
  ris: number;
  origin: number;
  factory: number;
  transport: number;
  construction: number;
  disposal: number;
}

export interface Insight {
  title: string;
  staticText?: string;
  aiText?: string;
  category: string;
  subtype?: string;
  material?: string;
}
EOF
cat << 'EOF' > src/config.ts
// Configuration constants for BlockPlane

export const CSV_PATH = '/BlockPlane-clean.csv';
export const BASELINE_NAME = 'Benchmark 2000';

export const DEFAULT_VIEW_MODE = 'LIS'; // Options: 'LIS' | 'RIS'
EOF
cat << 'EOF' > src/constants.ts
// Global app-wide constants

export const STORAGE_KEY = 'blockplane_csv_text_v1';

export const REQUIRED_HEADERS: string[] = [
  'category',
  'subtype',
  'name',
  'unit',
  'quantity'
];

export const VIEW_MODES = ['LIS', 'RIS'] as const;
export type ViewMode = typeof VIEW_MODES[number];
EOF
cat << 'EOF' > src/config.ts
// Environment-based configuration values

// Default CSV path for fetch fallback
export const CSV_PATH = '/BlockPlane-clean.csv';

// Default name for the baseline material (used in comparison logic)
export const BASELINE_NAME = 'Benchmark 2000';
EOF
cat << 'EOF' > src/types.ts
// Reusable TypeScript types across BlockPlane

export interface Row {
  category: string;
  subtype: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface MaterialPhaseData {
  name: string;
  lis?: number;
  ris: number;
  origin: number;
  factory: number;
  transport: number;
  construction: number;
  disposal: number;
}

export type ViewMode = 'LIS' | 'RIS';

export interface ReferenceLine {
  value: number;
  label?: string;
  color?: string;
}
EOF
cat << 'EOF' > src/components/InsightBox.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InsightBoxProps {
  title: string;
  content: string;
  hint?: string;
  darkMode?: boolean;
}

const InsightBox: React.FC<InsightBoxProps> = ({
  title,
  content,
  hint,
  darkMode = false
}) => {
  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const hintColor = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <Card className={`p-4 shadow-md rounded-xl border ${bgColor} ${textColor}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <Separator className="my-2" />
      <p className="text-base whitespace-pre-wrap">{content}</p>
      {hint && (
        <>
          <Separator className="my-2" />
          <p className={`text-sm italic ${hintColor}`}>{hint}</p>
        </>
      )}
    </Card>
  );
};

export default InsightBox;
EOF
cat << 'EOF' > src/components/InsightToggle.tsx
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface InsightToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const InsightToggle: React.FC<InsightToggleProps> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <Switch id="insight-mode" checked={checked} onCheckedChange={onChange} />
      <Label htmlFor="insight-mode" className="text-sm font-medium">
        AI Insight Mode
      </Label>
    </div>
  );
};

export default InsightToggle;
EOF
cat << 'EOF' > src/components/InsightHeader.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface InsightHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const InsightHeader: React.FC<InsightHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <div className={cn("space-y-1", className)}>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
    </div>
  );
};

export default InsightHeader;
EOF
cat << 'EOF' > src/components/InsightTabs.tsx
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InsightTabsProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const InsightTabs: React.FC<InsightTabsProps> = ({ value, onChange, options }) => {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        {options.map((option) => (
          <TabsTrigger key={option} value={option}>
            {option}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default InsightTabs;
EOF
cat << 'EOF' > src/components/InsightWrapper.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MaterialRowWithScores } from '@/types';
import InsightTabs from './InsightTabs';
import StaticInsight from './StaticInsight';
import AIInsight from './AIInsight';

interface InsightWrapperProps {
  row: MaterialRowWithScores;
  viewMode: 'LIS' | 'RIS';
  insightMode: 'static' | 'ai';
  onInsightModeChange: (mode: 'static' | 'ai') => void;
}

const InsightWrapper: React.FC<InsightWrapperProps> = ({
  row,
  viewMode,
  insightMode,
  onInsightModeChange,
}) => {
  return (
    <Card className="col-span-2 print:col-span-1">
      <CardContent className="space-y-2">
        <InsightTabs
          value={insightMode}
          onChange={onInsightModeChange}
          options={['static', 'ai']}
        />
        {insightMode === 'static' ? (
          <StaticInsight row={row} viewMode={viewMode} />
        ) : (
          <AIInsight row={row} viewMode={viewMode} />
        )}
      </CardContent>
    </Card>
  );
};

export default InsightWrapper;
EOF
cat << 'EOF' > src/components/AIInsight.tsx
import React from 'react';
import { MaterialRowWithScores } from '@/types';
import { Badge } from '@/components/ui/badge';

interface AIInsightProps {
  row: MaterialRowWithScores;
  viewMode: 'LIS' | 'RIS';
}

const AIInsight: React.FC<AIInsightProps> = ({ row, viewMode }) => {
  const lis = row.lis ?? 0;
  const ris = row.ris ?? 0;

  return (
    <div className="text-sm space-y-2">
      <p className="leading-snug">
        This material scores a{" "}
        <Badge variant="secondary">{viewMode === 'LIS' ? lis : ris}</Badge>{" "}
        on the {viewMode} scale.
      </p>
      <p className="text-muted-foreground">
        AI-generated insights will appear here, explaining this score and suggesting possible improvements or alternatives.
      </p>
    </div>
  );
};

export default AIInsight;
EOF
cat << 'EOF' > src/components/RowImpactCell.tsx
import React from 'react';
import { MaterialRowWithScores } from '@/types';
import { Badge } from '@/components/ui/badge';

interface RowImpactCellProps {
  row: MaterialRowWithScores;
  viewMode: 'LIS' | 'RIS';
}

const getColor = (value: number, mode: 'LIS' | 'RIS'): string => {
  if (mode === 'LIS') {
    return value > 80 ? 'bg-red-500' : value > 50 ? 'bg-yellow-500' : 'bg-green-500';
  } else {
    return value >= 80 ? 'bg-green-600' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  }
};

const RowImpactCell: React.FC<RowImpactCellProps> = ({ row, viewMode }) => {
  const score = viewMode === 'LIS' ? row.lis ?? 0 : row.ris ?? 0;
  const color = getColor(score, viewMode);

  return (
    <div className="flex items-center justify-center">
      <Badge className={`${color} text-white px-2 py-1 rounded`}>
        {score}
      </Badge>
    </div>
  );
};

export default RowImpactCell;
EOF
cat << 'EOF' > src/components/ScoreLegend.tsx
import React from 'react';

const legendData = [
  { label: 'High Impact', color: 'bg-red-500' },
  { label: 'Moderate Impact', color: 'bg-yellow-500' },
  { label: 'Low Impact', color: 'bg-green-500' },
];

const ScoreLegend: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      {legendData.map(({ label, color }) => (
        <div key={label} className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${color}`} />
          <span className="text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default ScoreLegend;
EOF
cat << 'EOF' > src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-24">
      <svg
        className="animate-spin h-8 w-8 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
EOF
cat << 'EOF' > src/components/InsightToggle.tsx
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface InsightToggleProps {
  aiMode: boolean;
  onToggle: () => void;
}

const InsightToggle: React.FC<InsightToggleProps> = ({ aiMode, onToggle }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">Static</span>
      <Switch checked={aiMode} onCheckedChange={onToggle} />
      <span className="text-sm text-muted-foreground">AI Mode</span>
    </div>
  );
};

export default InsightToggle;
EOF
cat << 'EOF' > src/components/InsightHeader.tsx
import React from 'react';

interface InsightHeaderProps {
  title: string;
  subtitle?: string;
}

const InsightHeader: React.FC<InsightHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
    </div>
  );
};

export default InsightHeader;
EOF
cat << 'EOF' > src/components/ui/DarkModeToggle.tsx
import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
EOF
cat << 'EOF' > src/components/InsightToggle.tsx
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface InsightToggleProps {
  isDynamic: boolean;
  onToggle: () => void;
}

const InsightToggle: React.FC<InsightToggleProps> = ({ isDynamic, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="insight-toggle">AI Insights</Label>
      <Switch id="insight-toggle" checked={isDynamic} onCheckedChange={onToggle} />
    </div>
  );
};

export default InsightToggle;
EOF
cat << 'EOF' > src/components/InsightWrapper.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import InsightToggle from './InsightToggle';
import { useClaudeInsight } from '@/lib/hooks/useClaudeInsight';
import { InsightType } from '@/types';

interface InsightWrapperProps {
  material: string;
  subtype: string;
  impactScore: number;
  insightType?: InsightType;
}

const InsightWrapper: React.FC<InsightWrapperProps> = ({
  material,
  subtype,
  impactScore,
  insightType = 'lis'
}) => {
  const [isDynamic, setIsDynamic] = useState(false);
  const { insight, loading, error } = useClaudeInsight({
    material,
    subtype,
    score: impactScore,
    type: insightType,
    enabled: isDynamic
  });

  return (
    <Card className="my-4 dark:bg-gray-900 bg-white">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Insight Box</h3>
          <InsightToggle isDynamic={isDynamic} onToggle={() => setIsDynamic(!isDynamic)} />
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {isDynamic ? (
            loading ? (
              <span>Loading AI insight...</span>
            ) : error ? (
              <span className="text-red-500">Error: {error}</span>
            ) : (
              <span>{insight}</span>
            )
          ) : (
            <span>This material scores a {impactScore} on the {insightType.toUpperCase()} scale.</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightWrapper;
EOF
cat << 'EOF' > src/components/InsightToggle.tsx
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface InsightToggleProps {
  isDynamic: boolean;
  onToggle: () => void;
}

const InsightToggle: React.FC<InsightToggleProps> = ({ isDynamic, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="insight-toggle" className="text-sm">
        {isDynamic ? 'AI Mode' : 'Static Mode'}
      </Label>
      <Switch id="insight-toggle" checked={isDynamic} onCheckedChange={onToggle} />
    </div>
  );
};

export default InsightToggle;
EOF
cat << 'EOF' > src/components/StatsCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, subtext, className }) => {
  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
        {subtext && <div className="text-sm text-muted-foreground">{subtext}</div>}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
EOF
cat << 'EOF' > src/components/Toggle.tsx
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Toggle = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input shadow-sm transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Toggle.displayName = SwitchPrimitives.Root.displayName;

export { Toggle };
EOF
cat << 'EOF' > src/lib/useInsightPrompt.ts
import { useMemo } from 'react';
import { Row } from '@/types';

export function useInsightPrompt(material: Row | null) {
  return useMemo(() => {
    if (!material) return '';

    const { name, category, subtype, unit, quantity } = material;

    return `
You are a building material sustainability expert. Please write a short, helpful summary for this material from the perspective of lifecycle impact. Use real-world insights and assume the user is choosing this product for a construction project.

Material: ${name}
Category: ${category}
Subtype: ${subtype}
Quantity: ${quantity} ${unit}

The summary should be:
- Friendly, encouraging, and professional
- Honest about concerns and tradeoffs
- Helpful for making sustainable decisions
- Grounded in science and best practices

Use one short paragraph. No bullet points or repetition of labels.
    `.trim();
  }, [material]);
}
EOF
cat << 'EOF' > src/lib/ClaudePromptWrapper.ts
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

/**
 * Wraps a user prompt and system context for Claude.
 * Accepts a material insight prompt and creates a Claude-ready message array.
 */
export function ClaudePromptWrapper(prompt: string): ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are a helpful assistant named Sylvie, specializing in sustainable construction and lifecycle impact. Always respond with clear, concise, and positive insights that help users choose better materials. Use your scientific knowledge to explain tradeoffs. Avoid unnecessary repetition.`,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];
}
EOF
cat << 'EOF' > src/components/InsightToggle.tsx
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface InsightToggleProps {
  isAIMode: boolean;
  onToggle: () => void;
}

const InsightToggle: React.FC<InsightToggleProps> = ({ isAIMode, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="ai-mode-toggle" checked={isAIMode} onCheckedChange={onToggle} />
      <Label htmlFor="ai-mode-toggle">
        {isAIMode ? "AI Mode" : "Static Mode"}
      </Label>
    </div>
  );
};

export default InsightToggle;
EOF
cat << 'EOF' > src/components/InsightWrapper.tsx
import React, { useState } from "react";
import InsightToggle from "./InsightToggle";
import StaticInsights from "./StaticInsights";
import AIGeneratedInsights from "./AIGeneratedInsights";

interface InsightWrapperProps {
  selectedMaterial: string | null;
  contextData?: Record<string, any>;
}

const InsightWrapper: React.FC<InsightWrapperProps> = ({
  selectedMaterial,
  contextData,
}) => {
  const [isAIMode, setIsAIMode] = useState(false);

  const handleToggle = () => {
    setIsAIMode((prev) => !prev);
  };

  return (
    <div className="bg-background p-4 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Insight Box</h2>
        <InsightToggle isAIMode={isAIMode} onToggle={handleToggle} />
      </div>

      {selectedMaterial ? (
        isAIMode ? (
          <AIGeneratedInsights material={selectedMaterial} contextData={contextData} />
        ) : (
          <StaticInsights material={selectedMaterial} />
        )
      ) : (
        <p className="text-muted-foreground">Select a material to view insights.</p>
      )}
    </div>
  );
};

export default InsightWrapper;
EOF
cat << 'EOF' > src/components/InsightToggle.tsx
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface InsightToggleProps {
  isAIMode: boolean;
  onToggle: () => void;
}

const InsightToggle: React.FC<InsightToggleProps> = ({ isAIMode, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="insight-toggle" className="text-sm text-muted-foreground">
        AI Insights
      </Label>
      <Switch id="insight-toggle" checked={isAIMode} onCheckedChange={onToggle} />
    </div>
  );
};

export default InsightToggle;
EOF
cat << 'EOF' > src/config.ts
// Configuration constants

export const CSV_PATH = "/BlockPlane-clean.csv";
export const BASELINE_NAME = "Benchmark 2000";

export const INSIGHT_TABS = {
  static: "Static",
  ai: "AI Generated"
};
EOF
cat << 'EOF' > src/components/InsightToggle.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface InsightToggleProps {
  selected: "static" | "ai";
  onChange: (value: "static" | "ai") => void;
}

const InsightToggle: React.FC<InsightToggleProps> = ({ selected, onChange }) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={selected === "static" ? "default" : "outline"}
        onClick={() => onChange("static")}
      >
        Static
      </Button>
      <Button
        variant={selected === "ai" ? "default" : "outline"}
        onClick={() => onChange("ai")}
      >
        AI Generated
      </Button>
    </div>
  );
};

export default InsightToggle;
EOF
cat << 'EOF' > src/components/MaterialCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import InsightBox from "@/components/InsightBox";
import type { MaterialWithInsights } from "@/types";
import StatsHeader from "@/components/StatsHeader";

interface MaterialCardProps {
  material: MaterialWithInsights;
  viewMode: "LIS" | "RIS";
  insightMode: "static" | "ai";
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, viewMode, insightMode }) => {
  return (
    <Card className="my-4">
      <CardContent className="p-4 space-y-4">
        <StatsHeader material={material} viewMode={viewMode} />
        <InsightBox material={material} mode={insightMode} />
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
EOF
cat << 'EOF' > src/components/MaterialCardList.tsx
import React from "react";
import MaterialCard from "@/components/MaterialCard";
import type { MaterialWithInsights } from "@/types";

interface MaterialCardListProps {
  materials: MaterialWithInsights[];
  viewMode: "LIS" | "RIS";
  insightMode: "static" | "ai";
}

const MaterialCardList: React.FC<MaterialCardListProps> = ({ materials, viewMode, insightMode }) => {
  return (
    <div className="space-y-4">
      {materials.map((material) => (
        <MaterialCard
          key={material.id}
          material={material}
          viewMode={viewMode}
          insightMode={insightMode}
        />
      ))}
    </div>
  );
};

export default MaterialCardList;
EOF
cat << 'EOF' > src/components/MaterialCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InsightBox from "@/components/InsightBox";
import { MaterialWithInsights } from "@/types";
import { formatImpact, formatPrice } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface MaterialCardProps {
  material: MaterialWithInsights;
  viewMode: "LIS" | "RIS";
  insightMode: "static" | "ai";
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, viewMode, insightMode }) => {
  const viewValue = viewMode === "LIS" ? material.lis : material.ris;
  const viewLabel = viewMode === "LIS" ? "Lifecycle Impact Score (LIS)" : "Regenerative Impact Score (RIS)";
  const percent = Math.min(100, Math.max(0, Math.round(viewValue)));

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">{material.name}</div>
          <Badge variant="outline">{material.category} / {material.subtype}</Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          <strong>{viewLabel}:</strong> {formatImpact(viewValue)} / 100
        </div>
        <Progress value={percent} />

        <div className="text-sm text-muted-foreground">
          <strong>Price:</strong> {formatPrice(material.price)} / {material.unit}
        </div>

        <InsightBox
          material={material}
          insightMode={insightMode}
          viewMode={viewMode}
        />
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
EOF
cat << 'EOF' > src/components/InsightBox.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { MaterialWithInsights } from "@/types";
import { Card } from "@/components/ui/card";
import { Bot, BotMessageSquare, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface InsightBoxProps {
  material: MaterialWithInsights;
  insightMode: "static" | "ai";
  viewMode: "LIS" | "RIS";
}

const InsightBox: React.FC<InsightBoxProps> = ({ material, insightMode, viewMode }) => {
  const insight = viewMode === "LIS" ? material.lis_insight : material.ris_insight;
  const isAI = insightMode === "ai";

  return (
    <Card className={cn("p-4 border", isAI && "border-purple-500 shadow-lg")}>
      <div className="flex items-center mb-2">
        {isAI ? <Bot className="w-4 h-4 mr-1 text-purple-500" /> : <BotMessageSquare className="w-4 h-4 mr-1 text-muted-foreground" />}
        <span className={cn("text-sm font-medium", isAI && "text-purple-700")}>
          {isAI ? "AI-Generated Insight" : "Static Insight"}
        </span>
        {isAI && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Sparkles className="w-3 h-3 ml-1 text-purple-400" />
            </TooltipTrigger>
            <TooltipContent>
              This insight is generated by Claude based on material data.
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-line">{insight || "No insight available."}</p>
    </Card>
  );
};

export default InsightBox;
EOF
cat << 'EOF' > src/components/ProjectHeader.tsx
import React from "react";
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";

interface ProjectHeaderProps {
  project: Project | null;
  className?: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, className }) => {
  if (!project) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Building2 className="w-5 h-5 text-muted-foreground" />
      <h2 className="text-lg font-semibold">{project.name}</h2>
      <span className="text-sm text-muted-foreground">({project.region})</span>
    </div>
  );
};

export default ProjectHeader;
EOF
cat << 'EOF' > src/components/RegionSelector.tsx
import React from "react";
import { regions } from "@/config";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onRegionChange }) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="region">Region</Label>
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger id="region">
          <SelectValue placeholder="Select a region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RegionSelector;
EOF
cat << 'EOF' > src/components/RISLegend.tsx
import React from "react";

const legendItems = [
  { label: "Gold (80–100)", color: "#2ECC71" },
  { label: "Silver (60–79)", color: "#F1C40F" },
  { label: "Bronze (40–59)", color: "#E67E22" },
  { label: "Problematic (<40)", color: "#E74C3C" },
  { label: "Emerging", color: "#95A5A6" },
];

const RISLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 print:hidden">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default RISLegend;
EOF
cat << 'EOF' > src/components/RISRadarChart.tsx
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ScoreData {
  metric: string;
  score: number;
}

interface RISRadarChartProps {
  scores: Record<string, number>;
  color?: string;
}

const RISRadarChart: React.FC<RISRadarChartProps> = ({ scores, color = "#4CAF50" }) => {
  const data: ScoreData[] = Object.entries(scores).map(([metric, score]) => ({
    metric,
    score,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis angle={30} doma
cat << 'EOF' > src/components/RISBadge.tsx
import React from "react";

interface RISBadgeProps {
  ris: number;
}

const getRISLabel = (ris: number): string => {
  if (ris >= 80) return "Gold";
  if (ris >= 60) return "Silver";
  if (ris >= 40) return "Bronze";
  if (ris >= 0) return "Problematic";
  return "Unscored";
};

const getRISColor = (ris: number): string => {
  if (ris >= 80) return "bg-yellow-400 text-black";
  if (ris >= 60) return "bg-gray-300 text-black";
  if (ris >= 40) return "bg-amber-800 text-white";
  if (ris >= 0) return "bg-red-600 text-white";
  return "bg-gray-500 text-white";
};

const RISBadge: React.FC<RISBadgeProps> = ({ ris }) => {
  const label = getRISLabel(ris);
  const color = getRISColor(ris);

  return (
    <span
      className={`text-sm font-semibold px-3 py-1 rounded-full ${color}`}
      title={`Regenerative Impact Score: ${ris} (${label})`}
    >
      {label}
    </span>
  );
};

export default RISBadge;
EOF
cat << 'EOF' > src/components/ScoreGauge.tsx
import React from "react";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

interface ScoreGaugeProps {
  score: number;
  max?: number;
  color?: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, max = 100, color = "#00C49F" }) => {
  const data = [
    {
      name: "score",
      value: score,
      fill: color,
    },
  ];

  const angle = 180 * (score / max);

  return (
    <div className="w-32 h-20">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="100%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={10}
          startAngle={180}
          endAngle={180 - angle}
          data={data}
        >
          <RadialBar background clockWise dataKey="value" />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center -mt-8 text-xs font-semibold">{score}</div>
    </div>
  );
};

export default ScoreGauge;
EOF
cat << 'EOF' > src/components/LifecycleLabels.tsx
import React from "react";

const phaseLabels = [
  "Point of Origin →",
  "Factory Processing →",
  "Transport →",
  "Construction →",
  "Disposal",
];

const LifecycleLabels: React.FC = () => {
  return (
    <div className="flex justify-between items-center text-xs text-gray-600 px-4 py-1 mt-1">
      {phaseLabels.map((label, index) => (
        <span key={index} className="whitespace-nowrap">
          {label}
        </span>
      ))}
    </div>
  );
};

export default LifecycleLabels;
EOF
cat << 'EOF' > src/components/RISRadarChart.tsx
import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface RISSubscoreData {
  category: string;
  score: number;
}

interface RISRadarChartProps {
  data: RISSubscoreData[];
  maxScore?: number;
}

const RISRadarChart: React.FC<RISRadarChartProps> = ({ data, maxScore = 100 }) => {
  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, maxScore]} />
          <Radar
            name="RIS"
            dataKey="score"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RISRadarChart;
EOF
cat << 'EOF' > src/components/RISBadge.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface RISBadgeProps {
  score: number;
  className?: string;
}

const getBadgeStyle = (score: number) => {
  if (score >= 80) return { label: "Gold", color: "bg-yellow-500" };
  if (score >= 60) return { label: "Silver", color: "bg-gray-400" };
  if (score >= 40) return { label: "Bronze", color: "bg-amber-700" };
  if (score > 0) return { label: "Problematic", color: "bg-red-500" };
  return { label: "Emerging", color: "bg-blue-500" };
};

const RISBadge: React.FC<RISBadgeProps> = ({ score, className }) => {
  const { label, color } = getBadgeStyle(score);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full",
        color,
        className
      )}
    >
      {label}
    </span>
  );
};

export default RISBadge;
EOF
cat << 'EOF' > src/components/RISLegend.tsx
import React from "react";

const tiers = [
  { label: "Gold (80–100)", color: "bg-yellow-500", description: "High Performance" },
  { label: "Silver (60–79)", color: "bg-gray-400", description: "Resilient" },
  { label: "Bronze (40–59)", color: "bg-amber-700", description: "Low Harm" },
  { label: "Problematic (<40)", color: "bg-red-500", description: "Extractive" },
  { label: "Emerging", color: "bg-blue-500", description: "Unverified / Experimental" }
];

const RISLegend: React.FC = () => {
  return (
    <div className="space-y-1 text-sm">
      {tiers.map(({ label, color, description }) => (
        <div key={label} className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${color}`} />
          <span>{label} – {description}</span>
        </div>
      ))}
    </div>
  );
};

export default RISLegend;
EOF
cat << 'EOF' > src/components/ScoreRangePill.tsx
import React from "react";
import clsx from "clsx";

interface ScoreRangePillProps {
  score: number;
}

const getRangeColor = (score: number): string => {
  if (score >= 80) return "bg-yellow-500 text-black"; // Gold
  if (score >= 60) return "bg-gray-400 text-black"; // Silver
  if (score >= 40) return "bg-amber-700 text-white"; // Bronze
  if (score >= 0) return "bg-red-500 text-white"; // Problematic
  return "bg-blue-500 text-white"; // Emerging or unknown
};

const getRangeLabel = (score: number): string => {
  if (score >= 80) return "Gold";
  if (score >= 60) return "Silver";
  if (score >= 40) return "Bronze";
  if (score >= 0) return "Problematic";
  return "Emerging";
};

const ScoreRangePill: React.FC<ScoreRangePillProps> = ({ score }) => {
  return (
    <span
      className={clsx(
        "px-2 py-1 text-xs rounded-full font-semibold",
        getRangeColor(score)
      )}
    >
      {getRangeLabel(score)}
    </span>
  );
};

export default ScoreRangePill;
EOF
cat << 'EOF' > src/components/ScoreStat.tsx
import React from "react";
import ScoreRangePill from "./ScoreRangePill";

interface ScoreStatProps {
  label: string;
  value: number;
  description?: string;
}

const ScoreStat: React.FC<ScoreStatProps> = ({ label, value, description }) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="flex items-center gap-2">
        <div className="text-2xl font-semibold">{value}</div>
        <ScoreRangePill score={value} />
      </div>
      {description && <div className="text-xs text-gray-400">{description}</div>}
    </div>
  );
};

export default ScoreStat;
EOF
cat << 'EOF' > src/components/ScoreSummary.tsx
import React from "react";
import ScoreStat from "./ScoreStat";
import { getScoreTier } from "@/lib/utils";

interface ScoreSummaryProps {
  lis: number;
  ris: number;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ lis, ris }) => {
  const lisTier = getScoreTier(lis);
  const risTier = getScoreTier(ris);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ScoreStat
        label="Lifecycle Impact Score (LIS)"
        value={lis}
        description={lisTier}
      />
      <ScoreStat
        label="Regenerative Impact Score (RIS)"
        value={ris}
        description={risTier}
      />
    </div>
  );
};

export default ScoreSummary;
EOF
cat << 'EOF' > src/components/ScoreStat.tsx
import React from "react";

interface ScoreStatProps {
  label: string;
  value: number;
  description: string;
}

const ScoreStat: React.FC<ScoreStatProps> = ({ label, value, description }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border dark:border-zinc-800">
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{label}</div>
      <div className="text-3xl font-bold text-zinc-900 dark:text-white">{value}</div>
      <div className="text-sm mt-1 text-zinc-600 dark:text-zinc-300">{description}</div>
    </div>
  );
};

export default ScoreStat;
EOF
cat << 'EOF' > src/components/StatsCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  className,
}) => {
  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
EOF
cat << 'EOF' > src/components/StatsGrid.tsx
import React from "react";
import StatsCard from "./StatsCard";
import { GridStats } from "@/types";

interface StatsGridProps {
  stats: GridStats[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          className={stat.className}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
EOF
cat << 'EOF' > src/components/StatsInsight.tsx
import React from "react";

interface StatsInsightProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

const StatsInsight: React.FC<StatsInsightProps> = ({ label, value, unit, className }) => {
  return (
    <div className={`flex flex-col space-y-1 ${className || ""}`}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">
        {value}
        {unit && <span className="text-base font-normal text-muted-foreground"> {unit}</span>}
      </div>
    </div>
  );
};

export default StatsInsight;
EOF
cat << 'EOF' > src/components/StatsRow.tsx
import React from "react";
import StatsInsight from "./StatsInsight";

interface StatsRowProps {
  stats: {
    label: string;
    value: string | number;
    unit?: string;
    className?: string;
  }[];
  className?: string;
}

const StatsRow: React.FC<StatsRowProps> = ({ stats, className }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className || ""}`}>
      {stats.map((stat, index) => (
        <StatsInsight
          key={index}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          className={stat.className}
        />
      ))}
    </div>
  );
};

export default StatsRow;
EOF
cat << 'EOF' > src/components/StatsInsight.tsx
import React from "react";

interface StatsInsightProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

const StatsInsight: React.FC<StatsInsightProps> = ({
  label,
  value,
  unit,
  className,
}) => {
  return (
    <div className={`rounded-lg p-4 shadow text-center bg-white ${className || ""}`}>
      <div className="text-gray-500 text-sm font-medium">{label}</div>
      <div className="text-xl font-semibold text-gray-900">
        {value}
        {unit && <span className="text-sm text-gray-600 ml-1">{unit}</span>}
      </div>
    </div>
  );
};

export default StatsInsight;
EOF
cat <<'EOF' > src/components/LoadingIndicator.tsx
import React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-2 text-sm text-gray-600">Loading...</span>
    </div>
  );
};

export default LoadingIndicator;
EOF
cat <<'EOF' > src/components/MaterialCard.tsx
import React from "react";
import { Material } from "../types";
import InsightBox from "./InsightBox";

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{material.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {material.category} • {material.subtype}
      </p>

      <div className="mt-2 text-sm space-y-1">
        <p><strong>Unit:</strong> {material.unit}</p>
        <p><strong>Quantity:</strong> {material.quantity}</p>
        {material.lis !== undefined && (
          <p><strong>LIS:</strong> {material.lis.toFixed(2)}</p>
        )}
        {material.ris !== undefined && (
          <p><strong>RIS:</strong> {material.ris.toFixed(2)}</p>
        )}
      </div>

      <div className="mt-4">
        <InsightBox material={material} />
      </div>
    </div>
  );
};

export default MaterialCard;
EOF
cat <<'EOF' > src/components/MaterialGrid.tsx
import React from "react";
import { Material } from "../types";
import MaterialCard from "./MaterialCard";

interface MaterialGridProps {
  materials: Material[];
}

const MaterialGrid: React.FC<MaterialGridProps> = ({ materials }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material, index) => (
        <MaterialCard key={`${material.name}-${index}`} material={material} />
      ))}
    </div>
  );
};

export default MaterialGrid;
EOF
cat <<'EOF' > src/components/MaterialTableHeader.tsx
import React from "react";

const MaterialTableHeader: React.FC = () => {
  return (
    <thead className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wider">
      <tr>
        <th className="p-2 text-left">Name</th>
        <th className="p-2 text-left">Category</th>
        <th className="p-2 text-left">Subtype</th>
        <th className="p-2 text-right">Unit</th>
        <th className="p-2 text-right">Quantity</th>
        <th className="p-2 text-right">LIS</th>
        <th className="p-2 text-right">RIS</th>
        <th className="p-2 text-right">CPI</th>
        <th className="p-2 text-right">Price</th>
      </tr>
    </thead>
  );
};

export default MaterialTableHeader;
EOF
cat <<'EOF' > src/components/MaterialTableFooter.tsx
import React from "react";

interface MaterialTableFooterProps {
  totalRows: number;
  filteredRows: number;
}

const MaterialTableFooter: React.FC<MaterialTableFooterProps> = ({
  totalRows,
  filteredRows,
}) => {
  return (
    <tfoot>
      <tr>
        <td colSpan={9} className="text-sm text-gray-600 p-2 text-right">
          Showing {filteredRows} of {totalRows} materials
        </td>
      </tr>
    </tfoot>
  );
};

export default MaterialTableFooter;
EOF
cat <<'EOF' > src/components/MaterialType.tsx
import React from "react";
import type { Material } from "../types";

interface MaterialTypeProps {
  material: Material;
}

const MaterialType: React.FC<MaterialTypeProps> = ({ material }) => {
  return (
    <div className="text-sm text-gray-500">
      {material.category} → {material.subtype}
    </div>
  );
};

export default MaterialType;
EOF
cat <<'EOF' > src/components/MaterialUnit.tsx
import React from "react";
import type { Material } from "../types";

interface MaterialUnitProps {
  material: Material;
}

const MaterialUnit: React.FC<MaterialUnitProps> = ({ material }) => {
  return (
    <span className="text-xs text-gray-500 ml-1">({material.unit})</span>
  );
};

export default MaterialUnit;
EOF

cat <<'EOF' > src/components/MaterialValue.tsx
import React from "react";

interface MaterialValueProps {
  value: number;
  unit?: string;
  bold?: boolean;
  precision?: number;
  className?: string;
}

const MaterialValue: React.FC<MaterialValueProps> = ({
  value,
  unit,
  bold = false,
  precision = 2,
  className = "",
}) => {
  const formatted = value.toFixed(precision);
  const weight = bold ? "font-bold" : "font-normal";

  return (
    <span className={`${weight} ${className}`}>
      {formatted}
      {unit ? ` ${unit}` : ""}
    </span>
  );
};

export default MaterialValue;
EOF
cat <<'EOF' > src/components/MaterialList.tsx
import React from "react";
import type { MaterialRow } from "../types";
import MaterialValue from "./MaterialValue";

interface MaterialListProps {
  materials: MaterialRow[];
}

const MaterialList: React.FC<MaterialListProps> = ({ materials }) => {
  return (
    <div className="space-y-4">
      {materials.map((material, index) => (
        <div key={index} className="p-4 border rounded shadow">
          <h3 className="text-lg font-semibold">{material.name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm text-gray-700">
            <div>
              <strong>Category:</strong> {material.category}
            </div>
            <div>
              <strong>Subtype:</strong> {material.subtype}
            </div>
            <div>
              <strong>Quantity:</strong>{" "}
              <MaterialValue value={material.quantity} unit={material.unit} />
            </div>
            <div>
              <strong>LIS:</strong>{" "}
              <MaterialValue value={material.lis ?? 0} unit="pts" />
            </div>
            <div>
              <strong>RIS:</strong>{" "}
              <MaterialValue value={material.ris ?? 0} unit="pts" />
            </div>
            <div>
              <strong>CPI:</strong>{" "}
              <MaterialValue value={material.cpi ?? 0} unit="$ / pt" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaterialList;
EOF
cat <<'EOF' > src/components/MaterialValue.tsx
import React from "react";

interface MaterialValueProps {
  value: number;
  unit?: string;
  precision?: number;
}

const MaterialValue: React.FC<MaterialValueProps> = ({ value, unit = "", precision = 2 }) => {
  const formatted = Number.isFinite(value)
    ? value.toFixed(precision)
    : "—";

  return (
    <span>
      {formatted} {unit}
    </span>
  );
};

export default MaterialValue;
EOF
cat <<'EOF' > src/components/MaterialCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import MaterialValue from "./MaterialValue";
import { MaterialWithScores } from "@/types";

interface MaterialCardProps {
  material: MaterialWithScores;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="text-xl font-semibold">{material.name}</div>
        <div className="text-sm text-muted-foreground mb-2">
          {material.category} / {material.subtype}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Unit:</strong> {material.unit}</div>
          <div><strong>Qty:</strong> {material.quantity}</div>
          <div><strong>LIS:</strong> <MaterialValue value={material.lis ?? 0} /></div>
          <div><strong>RIS:</strong> <MaterialValue value={material.ris ?? 0} /></div>
          <div><strong>CPI:</strong> <MaterialValue value={material.cpi ?? 0} /></div>
          <div><strong>Price:</strong> <MaterialValue value={material.price ?? 0} unit="$" /></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
EOF
cat <<'EOF' > src/components/MaterialValue.tsx
import React from "react";

interface MaterialValueProps {
  value: number;
  unit?: string;
}

const MaterialValue: React.FC<MaterialValueProps> = ({ value, unit }) => {
  const formatted =
    value % 1 === 0 ? value.toString() : value.toFixed(2);

  return (
    <span>
      {unit ? `${unit}${formatted}` : formatted}
    </span>
  );
};

export default MaterialValue;
EOF
cat <<'EOF' > src/components/PhaseColor.ts
// Defines consistent colors for lifecycle phases
const phaseColors: Record<string, string> = {
  origin: "#9C27B0",       // Purple
  factory: "#3F51B5",      // Indigo
  transport: "#2196F3",    // Blue
  construction: "#4CAF50", // Green
  disposal: "#F44336",     // Red
};

export default phaseColors;
EOF
cat > src/components/InsightBox.tsx <<'EOF'
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Insight } from "@/types";

interface InsightBoxProps {
  insights: Insight[];
  title?: string;
}

const InsightBox: React.FC<InsightBoxProps> = ({ insights, title = "Insights" }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="font-semibold text-lg">{title}</CardHeader>
      <CardContent className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="text-sm">
            <strong>{insight.type}:</strong> {insight.text}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InsightBox;
EOF
cat > src/components/Loading.tsx <<'EOF'
import React from "react";
import { Loader2 } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
    </div>
  );
};

export default Loading;
EOF
cat > src/components/ui/SectionHeader.tsx <<'EOF'
import React from "react";

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ children, className = "" }) => {
  return (
    <h2 className={`text-xl font-semibold text-primary mb-4 ${className}`}>
      {children}
    </h2>
  );
};

export default SectionHeader;
EOF
cat > src/components/SettingsBar.tsx <<'EOF'
import React from "react";

interface SettingsBarProps {
  children: React.ReactNode;
  className?: string;
}

const SettingsBar: React.FC<SettingsBarProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full flex flex-wrap gap-4 items-center justify-between py-2 px-4 bg-muted rounded-lg border ${className}`}>
      {children}
    </div>
  );
};

export default SettingsBar;
EOF

cat > src/components/StatsCard.tsx <<'EOF'
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-muted p-4 rounded-xl shadow-md border text-center ${className}`}>
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold text-primary">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
};

export default StatsCard;
EOF

cat > src/components/SummaryPanel.tsx <<'EOF'
import React from "react";
import StatsCard from "./StatsCard";

interface SummaryPanelProps {
  totalMaterials: number;
  totalQuantity: number;
  totalLIS: number;
  totalRIS: number;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  totalMaterials,
  totalQuantity,
  totalLIS,
  totalRIS,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
      <StatsCard title="Total Materials" value={totalMaterials} />
      <StatsCard title="Total Quantity" value={totalQuantity} />
      <StatsCard title="Total LIS" value={totalLIS.toFixed(2)} />
      <StatsCard title="Total RIS" value={totalRIS.toFixed(2)} />
    </div>
  );
};

export default SummaryPanel;
EOF
cat > src/components/TableHeader.tsx <<'EOF'
import React from "react";

interface TableHeaderProps {
  headers: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <thead className="bg-gray-100 dark:bg-gray-800">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="text-left px-4 py-2 text-sm font-semibold tracking-wide"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
EOF
cat > src/components/TableRow.tsx <<'EOF'
import React from "react";
import type { Row } from "../types";

interface TableRowProps {
  row: Row;
  headers: string[];
}

const TableRow: React.FC<TableRowProps> = ({ row, headers }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {headers.map((header) => (
        <td key={header} className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">
          {row[header as keyof Row]}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
EOF
cat > src/components/Tooltip.tsx <<'EOF'
import React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
EOF
cat > src/components/Toggle.tsx <<'EOF'
import React from "react";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <span>{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition duration-300 ${
            checked ? "bg-green-500" : ""
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform duration-300 ${
            checked ? "translate-x-4" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

export default Toggle;
EOF
cat > src/components/TooltipInfo.tsx <<'EOF'
import React from "react";

interface TooltipInfoProps {
  text: string;
}

const TooltipInfo: React.FC<TooltipInfoProps> = ({ text }) => {
  return (
    <div className="group relative inline-block">
      <span className="text-blue-500 cursor-help">ℹ️</span>
      <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 w-64 bottom-full left-1/2 transform -translate-x-1/2 mb-2 shadow-lg">
        {text}
      </div>
    </div>
  );
};

export default TooltipInfo;
EOF
cat > src/components/ViewToggle.tsx <<'EOF'
import React from "react";

interface ViewToggleProps {
  viewMode: "LIS" | "RIS";
  onChange: (mode: "LIS" | "RIS") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
  return (
    <div className="inline-flex rounded border border-gray-300 overflow-hidden">
      <button
        onClick={() => onChange("LIS")}
        className={`px-4 py-2 text-sm font-medium ${
          viewMode === "LIS"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        LIS
      </button>
      <button
        onClick={() => onChange("RIS")}
        className={`px-4 py-2 text-sm font-medium ${
          viewMode === "RIS"
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        RIS
      </button>
    </div>
  );
};

export default ViewToggle;
EOF
cat > src/components/WarningBadge.tsx <<'EOF'
import React from "react";
import { AlertTriangle } from "lucide-react";

interface WarningBadgeProps {
  message: string;
}

const WarningBadge: React.FC<WarningBadgeProps> = ({ message }) => {
  return (
    <div className="flex items-center bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm px-3 py-2 rounded">
      <AlertTriangle className="w-4 h-4 mr-2" />
      <span>{message}</span>
    </div>
  );
};

export default WarningBadge;
EOF
cat > src/components/ZoomControls.tsx <<'EOF'
import React from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  className?: string;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, className = "" }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <button
        onClick={onZoomOut}
        className="p-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
        aria-label="Zoom out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={onZoomIn}
        className="p-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
        aria-label="Zoom in"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ZoomControls;
EOF
cat > src/components/ZoomResetButton.tsx <<'EOF'
import React from "react";
import { RefreshCcw } from "lucide-react";

interface ZoomResetButtonProps {
  onReset: () => void;
  className?: string;
}

const ZoomResetButton: React.FC<ZoomResetButtonProps> = ({ onReset, className = "" }) => {
  return (
    <button
      onClick={onReset}
      className={`p-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none ${className}`}
      aria-label="Reset Zoom"
    >
      <RefreshCcw className="w-4 h-4" />
    </button>
  );
};

export default ZoomResetButton;
EOF
cat > src/components/ZoomSlider.tsx <<'EOF'
import React from "react";

interface ZoomSliderProps {
  zoom: number;
  setZoom: (value: number) => void;
  className?: string;
}

const ZoomSlider: React.FC<ZoomSliderProps> = ({ zoom, setZoom, className = "" }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(event.target.value));
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="zoom-slider" className="text-sm text-gray-700">
        Zoom:
      </label>
      <input
        id="zoom-slider"
        type="range"
        min="0.25"
        max="2"
        step="0.05"
        value={zoom}
        onChange={handleChange}
        className="w-full"
      />
      <span className="text-sm text-gray-700">{(zoom * 100).toFixed(0)}%</span>
    </div>
  );
};

export default ZoomSlider;
EOF
cat > src/components/MaterialCard.tsx <<'EOF'
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Row } from "@/types";

interface MaterialCardProps {
  material: Row;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <Card className="mb-4 print:border-gray-300 print:shadow-none">
      <CardContent className="py-4">
        <div className="text-lg font-semibold">{material.name}</div>
        <div className="text-sm text-gray-600">
          {material.category} / {material.subtype}
        </div>
        <div className="mt-2 text-sm">
          Quantity: {material.quantity} {material.unit}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
EOF
cat > src/components/MaterialTable.tsx <<'EOF'
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Row } from "@/types";

interface MaterialTableProps {
  rows: Row[];
}

const MaterialTable: React.FC<MaterialTableProps> = ({ rows }) => {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Subtype</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.category}</TableCell>
            <TableCell>{row.subtype}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.quantity}</TableCell>
            <TableCell>{row.unit}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaterialTable;
EOF
cat > src/components/ImpactVsRecoveryChart.tsx << 'EOF'
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from "recharts";

interface MaterialRecoveryData {
  name: string;
  lis: number;
  ris: number;
}

interface Props {
  data: MaterialRecoveryData[];
}

const ImpactVsRecoveryChart: React.FC<Props> = ({ data }) => {
  const risThreshold = 60; // RIS 60+ is "regenerative"
  const lisThreshold = 200; // LIS ≤ 200 is "low impact"

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="lis"
            name="Lifecycle Impact Score"
            domain={[0, 'dataMax + 50']}
          >
            <Label value="LIS (Lower is Better)" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis
            type="number"
            dataKey="ris"
            name="Regenerative Impact Score"
            domain={[0, 100]}
          >
            <Label value="RIS (Higher is Better)" angle={-90} position="insideLeft" />
          </YAxis>

          <Tooltip cursor={{ strokeDasharray: '3 3' }} />

          {/* Quadrant reference lines */}
          <ReferenceLine x={lisThreshold} stroke="gray" strokeDasharray="3 3" />
          <ReferenceLine y={risThreshold} stroke="gray" strokeDasharray="3 3" />

          {/* Quadrant coloring (optional UI polish) could be added with background layers */}

          <Scatter name="Materials" data={data} fill="#3498db" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactVsRecoveryChart;
EOF
cat > src/components/SubscoreRadarChart.tsx << 'EOF'
import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RISSubscore {
  category: string;
  score: number;
}

interface Props {
  data: RISSubscore[];
  color?: string;
}

const SubscoreRadarChart: React.FC<Props> = ({ data, color = "#2ecc71" }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Tooltip />
          <Radar
            name="RIS Subscores"
            dataKey="score"
            stroke={color}
            fill={color}
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubscoreRadarChart;
EOF
cat > src/components/MaterialDetailDrawer.tsx << 'EOF'
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import LifecycleBarChart from "./LifecycleBarChart";
import SubscoreRadarChart from "./SubscoreRadarChart";
import InsightWrapper from "./InsightWrapper";
import type { MaterialDetail } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  material: MaterialDetail | null;
  viewMode: "LIS" | "RIS";
}

const MaterialDetailDrawer: React.FC<Props> = ({ isOpen, onClose, material, viewMode }) => {
  if (!material) return null;

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="p-4 max-w-3xl mx-auto space-y-4">
        <DrawerHeader>
          <DrawerTitle>{material.name}</DrawerTitle>
        </DrawerHeader>

        <LifecycleBarChart
          data={[material.lifecycle]}
          viewMode={viewMode}
          referenceLine={viewMode === "LIS" ? { value: 50, label: "Paris Target", color: "#e74c3c" } : undefined}
        />

        {viewMode === "RIS" && material.subscores && (
          <SubscoreRadarChart data={material.subscores} />
        )}

        <div className="text-sm text-muted-foreground">
          <p>Unit: {material.unit}</p>
          <p>Quantity: {material.quantity}</p>
          <p>Estimated Price: ${material.price.toFixed(2)}</p>
        </div>

        <InsightWrapper material={material} />
      </DrawerContent>
    </Drawer>
  );
};

export default MaterialDetailDrawer;
EOF
cat > src/components/MaterialRow.tsx << 'EOF'
import React from "react";
import type { MaterialDetail } from "@/types";

interface Props {
  material: MaterialDetail;
  onClick: (material: MaterialDetail) => void;
  viewMode: "LIS" | "RIS";
}

const MaterialRow: React.FC<Props> = ({ material, onClick, viewMode }) => {
  const value = viewMode === "LIS" ? material.lifecycle.lis : material.lifecycle.ris;

  return (
    <tr
      className="cursor-pointer hover:bg-muted transition"
      onClick={() => onClick(material)}
    >
      <td className="p-2">{material.category}</td>
      <td className="p-2">{material.subtype}</td>
      <td className="p-2 font-medium">{material.name}</td>
      <td className="p-2">{material.unit}</td>
      <td className="p-2">{material.quantity}</td>
      <td className="p-2 text-right">{value?.toFixed(1)}</td>
    </tr>
  );
};

export default MaterialRow;
EOF
cat > src/components/MaterialDetailDrawer.tsx << 'EOF'
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MaterialDetail } from "@/types";
import InsightBox from "@/components/InsightBox";
import LifecycleBarChart from "@/components/LifecycleBarChart";

interface Props {
  material: MaterialDetail | null;
  onClose: () => void;
  viewMode: "LIS" | "RIS";
}

const MaterialDetailDrawer: React.FC<Props> = ({ material, onClose, viewMode }) => {
  if (!material) return null;

  const phases = material.lifecycle;

  return (
    <Drawer open={!!material} onClose={onClose}>
      <DrawerContent className="h-[95vh] overflow-y-auto p-4">
        <DrawerHeader>
          <DrawerTitle>{material.name}</DrawerTitle>
          <DrawerDescription>
            {material.category} / {material.subtype}
          </DrawerDescription>
        </DrawerHeader>

        <div className="my-4 space-y-4">
          <InsightBox material={material} viewMode={viewMode} />

          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Lifecycle Breakdown</h4>
            <LifecycleBarChart
              data={[phases]}
              viewMode={viewMode}
              referenceLine={viewMode === "LIS" ? { value: 75, label: "Paris Limit", color: "#f87171" } : undefined}
            />
          </div>
        </div>

        <div className="mt-4 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MaterialDetailDrawer;
EOF
cat > src/components/EmptyState.tsx << 'EOF'
import React from "react";

interface Props {
  title: string;
  message?: string;
  illustration?: React.ReactNode;
}

const EmptyState: React.FC<Props> = ({ title, message, illustration }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      {illustration && <div className="mb-4">{illustration}</div>}
      <h3 className="text-xl font-semibold">{title}</h3>
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
    </div>
  );
};

export default EmptyState;
EOF
cat > src/components/ErrorMessage.tsx << 'EOF'
import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export default ErrorMessage;
EOF
cat > src/components/ErrorMessage.tsx << 'EOF'
import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export default ErrorMessage;
EOF
cat > src/components/SuccessMessage.tsx << 'EOF'
import React from "react";

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
      <strong className="font-bold">Success:</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export default SuccessMessage;
EOF
cat > src/components/WarningMessage.tsx << 'EOF'
import React from "react";

interface WarningMessageProps {
  message: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded" role="alert">
      <strong className="font-bold">Warning:</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export default WarningMessage;
EOF
cat > src/components/ZeroState.tsx << 'EOF'
import React from "react";

interface ZeroStateProps {
  message?: string;
}

const ZeroState: React.FC<ZeroStateProps> = ({ message = "No data available." }) => {
  return (
    <div className="text-center text-gray-500 py-12">
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default ZeroState;
EOF
cat > src/components/LifecycleBarChart.tsx <<'EOF'
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import phaseColors from "./PhaseColor";

type ViewMode = "LIS" | "RIS";

export interface LifecycleDatum {
  /** Optional label for the x-axis (material name, etc.) */
  name?: string;
  /** Lifecycle phase breakdown (typically used for LIS view) */
  origin?: number;
  factory?: number;
  transport?: number;
  construction?: number;
  disposal?: number;
  /** Aggregate scores (RIS 0–100, LIS unbounded) */
  lis?: number;
  ris?: number;
}

interface ReferenceLineDef {
  value: number;
  label?: string;
  color?: string;
}

interface LifecycleBarChartProps {
  data: LifecycleDatum[];
  viewMode: ViewMode;
  referenceLine?: ReferenceLineDef | null;
  height?: number;
}

const PHASE_KEYS: (keyof LifecycleDatum)[] = [
  "origin",
  "factory",
  "transport",
  "construction",
  "disposal",
];

const hasAnyPhaseValues = (rows: LifecycleDatum[]) =>
  rows.some((r) => PHASE_KEYS.some((k) => typeof r[k] === "number"));

const LifecycleBarChart: React.FC<LifecycleBarChartProps> = ({
  data,
  viewMode,
  referenceLine,
  height = 300,
}) => {
  const prepared = useMemo(() => {
    // Ensure each item has a name for XAxis
    return data.map((d, i) => ({
      name: d.name ?? `Item ${i + 1}`,
      ...d,
    }));
  }, [data]);

  const showPhases = viewMode === "LIS" && hasAnyPhaseValues(prepared);

 
cat > src/components/LifecycleBarChart.tsx <<'EOF'
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import phaseColors from "./PhaseColor";

type ViewMode = "LIS" | "RIS";

export interface LifecycleDatum {
  /** Optional label for the x-axis (material name, etc.) */
  name?: string;
  /** Lifecycle phase breakdown (typically used for LIS view) */
  origin?: number;
  factory?: number;
  transport?: number;
  construction?: number;
  disposal?: number;
  /** Aggregate scores (RIS 0–100, LIS any positive number) */
  lis?: number;
  ris?: number;
}

interface ReferenceLineDef {
  value: number;
  label?: string;
  color?: string;
}

interface LifecycleBarChartProps {
  data: LifecycleDatum[];
  viewMode: ViewMode;
  referenceLine?: ReferenceLineDef | null;
  height?: number;
}

const PHASE_KEYS: (keyof LifecycleDatum)[] = [
  "origin",
  "factory",
  "transport",
  "construction",
  "disposal",
];

const hasAnyPhaseValues = (rows: LifecycleDatum[]) =>
  rows.some((r) => PHASE_KEYS.some((k) => typeof r[k] === "number"));

const sumPhases = (d: LifecycleDatum) =>
  PHASE_KEYS.reduce((acc, k) => acc + (typeof d[k] === "number" ? (d[k] as number) : 0), 0);

const LifecycleBarChart: React.FC<LifecycleBarChartProps> = ({
  data,
  viewMode,
  referenceLine,
  height = 300,
}) => {
  const prepared = useMemo(() => {
    // Ensure each item has a name for XAxis
    return (data ?? []).map((d, i) => ({
      name: d.name ?? `Item ${i + 1}`,
      ...d,
    }));
  }, [data]);

  const showPhases = viewMode === "LIS" && hasAnyPhaseValues(prepared);

  const yDomain = useMemo<[number, number]>(() => {
    if (viewMode === "RIS") {
      return [0, 100];
    }
    // LIS domain based on either stacked phases or lis aggregate
    const maxVal = prepared.reduce((max, d) => {
      const candidate = showPhases ? sumPhases(d) : (typeof d.lis === "number" ? d.lis! : 0);
      return Math.max(max, candidate);
    }, 0);
    // add 10% headroom
    return [0, Math.ceil(maxVal * 1.1)];
  }, [prepared, viewMode, showPhases]);

  if (!prepared.length) return null;

  const valueKey: keyof LifecycleDatum = viewMode === "RIS" ? "ris" : "lis";

  const tooltipFormatter = (val: any, name: any) => {
    // Format numbers nicely
    if (typeof val === "number") {
      return [val.toFixed(2), name];
    }
    return [val, name];
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={prepared} margin={{ top: 10, right: 10, bottom: 8, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={yDomain} tick={{ fontSize: 12 }} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />

          {referenceLine && typeof referenceLine.value === "number" && (
            <ReferenceLine
              y={referenceLine.value}
              ifOverflow="extendDomain"
              stroke={referenceLine.color ?? "#ef4444"}
              strokeDasharray="4 4"
              label={{
                value: referenceLine.label ?? `${referenceLine.value}`,
                position: "right",
                fill: referenceLine.color ?? "#ef4444",
                fontSize: 12,
              }}
            />
          )}

          {showPhases ? (
            <>
              <Bar dataKey="origin" stackId="a" fill={phaseColors.origin} name="Origin" />
              <Bar dataKey="factory" stackId="a" fill={phaseColors.factory} name="Factory" />
              <Bar dataKey="transport" stackId="a" fill={phaseColors.transport} name="Transport" />
              <Bar dataKey="construction" stackId="a" fill={phaseColors.construction} name="Construction" />
              <Bar dataKey="disposal" stackId="a" fill={phaseColors.disposal} name="Disposal" />
            </>
          ) : (
            <Bar
              dataKey={valueKey as any}
              name={viewMode === "RIS" ? "RIS" : "LIS"}
              fill={viewMode === "RIS" ? "#22c55e" : "#3b82f6"}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LifecycleBarChart;
EOF
cat > src/components/StatsHeader.tsx <<'EOF'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = {
  /** Legacy shape used by App.tsx: <StatsHeader stats={{ ... }} /> */
  stats?: LegacyStats;
} & ExtendedProps;

function fmtNum(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString();
}
function fmtFloat(n?: number, digits = 2) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toFixed(digits);
}
function fmtCurrency(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const StatsHeader: React.FC<Props> = (props) => {
  // support both prop styles, prefer explicit top-level when provided
  const totalMaterials =
    typeof props.totalMaterials === "number"
      ? props.totalMaterials
      : props.stats?.totalMaterials ?? 0;

  const avgLifespan =
    typeof props.stats?.avgLifespan === "number" ? props.stats!.avgLifespan : undefined;

  const topCategory = props.stats?.topCategory;
  const sustainabilityScore =
    typeof props.stats?.sustainabilityScore === "number" ? props.stats!.sustainabilityScore : undefined;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  // Build cards dynamically based on what we have
  const items: { label: string; value: string; hint?: string }[] = [];

  items.push({
    label: "Total Materials",
    value: fmtNum(totalMaterials),
    hint: "In dataset",
  });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value:
        percentFiltered !== undefined
          ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
          : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({
      label: "Avg Lifespan",
      value: `${fmtFloat(avgLifespan)} years`,
      hint: "Across visible rows",
    });
  }

  if (topCategory) {
    items.push({
      label: "Top Category",
      value: topCategory,
      hint: "Most represented",
    });
  }

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") {
    items.push({
      label: "Avg LIS",
      value: fmtFloat(averageLIS, 1),
      hint: "Lower is better",
    });
  }

  if (typeof averageRIS === "number") {
    items.push({
      label: "Avg RIS",
      value: fmtFloat(averageRIS, 1),
      hint: "Higher is better",
    });
  }

  if (typeof totalCost === "number") {
    items.push({
      label: "Total Cost",
      value: fmtCurrency(totalCost),
      hint: "Sum of visible",
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {it.label}
          </div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
EOF
# 1) Backup the current file (just in case)
mkdir -p backups && cp -f src/components/StatsHeader.tsx "backups/StatsHeader.tsx.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

# 2) Overwrite with a clean, compatibility-safe component
cat > src/components/StatsHeader.tsx <<'TSX'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = {
  /** Legacy shape used by App.tsx: <StatsHeader stats={{ ... }} /> */
  stats?: LegacyStats;
} & ExtendedProps;

function fmtNum(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString();
}
function fmtFloat(n?: number, digits = 2) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toFixed(digits);
}
function fmtCurrency(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const StatsHeader: React.FC<Props> = (props) => {
  // support both prop styles, prefer explicit top-level when provided
  const totalMaterials =
    typeof props.totalMaterials === "number"
      ? props.totalMaterials
      : props.stats?.totalMaterials ?? 0;

  const avgLifespan =
    typeof props.stats?.avgLifespan === "number" ? props.stats!.avgLifespan : undefined;

  const topCategory = props.stats?.topCategory;
  const sustainabilityScore =
    typeof props.stats?.sustainabilityScore === "number" ? props.stats!.sustainabilityScore : undefined;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];

  items.push({
    label: "Total Materials",
    value: fmtNum(totalMaterials),
    hint: "In dataset",
  });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value:
        percentFiltered !== undefined
          ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
          : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({
      label: "Avg Lifespan",
      value: `${fmtFloat(avgLifespan)} years`,
      hint: "Across visible rows",
    });
  }

  if (topCategory) {
    items.push({
      label: "Top Category",
      value: topCategory,
      hint: "Most represented",
    });
  }

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") {
    items.push({
      label: "Avg LIS",
      value: fmtFloat(averageLIS, 1),
      hint: "Lower is better",
    });
  }

  if (typeof averageRIS === "number") {
    items.push({
      label: "Avg RIS",
      value: fmtFloat(averageRIS, 1),
      hint: "Higher is better",
    });
  }

  if (typeof totalCost === "number") {
    items.push({
      label: "Total Cost",
      value: fmtCurrency(totalCost),
      hint: "Sum of visible",
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {it.label}
          </div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
TSX
# Ensure we’re at the project root
pwd
test -d src/components || { echo "❌ Not in project root (no src/components)"; exit 1; }

# Make a backup first (timestamped)
mkdir -p backups && cp -f src/components/StatsHeader.tsx "backups/StatsHeader.tsx.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

# Overwrite the file with a clean version
rm -f src/components/StatsHeader.tsx
cat > src/components/StatsHeader.tsx <<'TSX'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = {
  /** Legacy shape used by App.tsx: <StatsHeader stats={{ ... }} /> */
  stats?: LegacyStats;
} & ExtendedProps;

function fmtNum(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString();
}
function fmtFloat(n?: number, digits = 2) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toFixed(digits);
}
function fmtCurrency(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const StatsHeader: React.FC<Props> = (props) => {
  // Support both prop styles; prefer explicit top-level when provided
  const totalMaterials =
    typeof props.totalMaterials === "number"
      ? props.totalMaterials
      : props.stats?.totalMaterials ?? 0;

  const avgLifespan =
    typeof props.stats?.avgLifespan === "number" ? props.stats!.avgLifespan : undefined;

  const topCategory = props.stats?.topCategory;
  const sustainabilityScore =
    typeof props.stats?.sustainabilityScore === "number" ? props.stats!.sustainabilityScore : undefined;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];

  items.push({
    label: "Total Materials",
    value: fmtNum(totalMaterials),
    hint: "In dataset",
  });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value:
        percentFiltered !== undefined
          ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
          : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({
      label: "Avg Lifespan",
      value: `${fmtFloat(avgLifespan)} years`,
      hint: "Across visible rows",
    });
  }

  if (topCategory) {
    items.push({
      label: "Top Category",
      value: topCategory,
      hint: "Most represented",
    });
  }

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") {
    items.push({
      label: "Avg LIS",
      value: fmtFloat(averageLIS, 1),
      hint: "Lower is better",
    });
  }

  if (typeof averageRIS === "number") {
    items.push({
      label: "Avg RIS",
      value: fmtFloat(averageRIS, 1),
      hint: "Higher is better",
    });
  }

  if (typeof totalCost === "number") {
    items.push({
      label: "Total Cost",
      value: fmtCurrency(totalCost),
      hint: "Sum of visible",
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {it.label}
          </div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
TSX
ls -lh src/components/StatsHeader.tsx
head -n 20 src/components/StatsHeader.tsx
grep -n "export default StatsHeader" src/components/StatsHeader.tsx
npm run dev
# backup the current broken file
mkdir -p backups && cp -f src/types/index.ts "backups/types.index.ts.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

# write a clean types index
cat > src/types/index.ts <<'TS'
/** Core material rows used across tables/cards */
export interface Material {
  id?: string;
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  lis?: number;        // Lifecycle Impact Score (lower better)
  ris?: number;        // Regenerative Impact Score (higher better)
  cpi?: number;        // Cost per Impact, optional
  price?: number;      // Unit or estimated price
}

export type Row = Material;

/** Richer material with scores/pricing */
export interface MaterialWithScores extends Material {
  lis?: number;
  ris?: number;
  cpi?: number;
  price?: number;
}

/** Dashboard card/grid items */
export interface GridStats {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

/** Simple text insight blob */
export interface Insight {
  type: string;
  text: string;
}

/** Lifecycle phases (for LIS stacked bars, etc.) */
export interface LifecyclePhases {
  origin?: number;
  factory?: number;
  transport?: number;
  construction?: number;
  disposal?: number;
  lis?: number;
  ris?: number;
}

/** Detail drawer payload */
export interface MaterialDetail {
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  price: number;
  lifecycle: LifecyclePhases;
  subscores?: { category: string; score: number }[];
}

/** Generic table sort */
export type Sort = {
  field: keyof Material;
  dir: 'asc' | 'desc';
};

/** Re-export any extra types (e.g., AltRec) */
export * from './altrec';
TS
# backup then force-write the clean component
mkdir -p backups && cp -f src/components/StatsHeader.tsx "backups/StatsHeader.tsx.$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

cat > src/components/StatsHeader.tsx <<'TSX'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = {
  /** Legacy shape used by App.tsx: <StatsHeader stats={{ ... }} /> */
  stats?: LegacyStats;
} & ExtendedProps;

function fmtNum(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString();
}
function fmtFloat(n?: number, digits = 2) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toFixed(digits);
}
function fmtCurrency(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const StatsHeader: React.FC<Props> = (props) => {
  const totalMaterials =
    typeof props.totalMaterials === "number"
      ? props.totalMaterials
      : props.stats?.totalMaterials ?? 0;

  const avgLifespan =
    typeof props.stats?.avgLifespan === "number" ? props.stats!.avgLifespan : undefined;

  const topCategory = props.stats?.topCategory;
  const sustainabilityScore =
    typeof props.stats?.sustainabilityScore === "number" ? props.stats!.sustainabilityScore : undefined;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];

  items.push({ label: "Total Materials", value: fmtNum(totalMaterials), hint: "In dataset" });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value: percentFiltered !== undefined
        ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
        : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({ label: "Avg Lifespan", value: `${fmtFloat(avgLifespan)} years`, hint: "Across visible rows" });
  }

  if (topCategory) items.push({ label: "Top Category", value: topCategory, hint: "Most represented" });

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") items.push({ label: "Avg LIS", value: fmtFloat(averageLIS, 1), hint: "Lower is better" });
  if (typeof averageRIS === "number") items.push({ label: "Avg RIS", value: fmtFloat(averageRIS, 1), hint: "Higher is better" });
  if (typeof totalCost === "number") items.push({ label: "Total Cost", value: fmtCurrency(totalCost), hint: "Sum of visible" });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{it.label}</div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
TSX
# confirm files contain the right kind of code
sed -n '1,40p' src/types/index.ts
sed -n '1,40p' src/components/StatsHeader.tsx

# restart dev server if running
npm run dev
# 0) sanity check
pwd
test -d src/components || { echo "❌ run this from your project root (blockplane-clean)"; exit 1; }

# 1) If a colliding file exists (src/types.ts), back it up and move it aside
if [ -f src/types.ts ]; then
  mkdir -p backups
  cp -f src/types.ts "backups/types.ts.$(date +%Y%m%d-%H%M%S)"
  # prefer git mv if in repo
  git mv -f src/types.ts src/legacy-types.ts 2>/dev/null || mv -f src/types.ts src/legacy-types.ts
  echo "✅ Moved src/types.ts -> src/legacy-types.ts"
fi

# 2) Ensure the folder-based types module exists
mkdir -p src/types

# 3) Make sure AltRec is defined
cat > src/types/altrec.ts <<'TS'
export type AltRec = {
  baseName: string;   // original material name
  altName: string;    // suggested alternative
  reason?: string;    // optional explanation
  subtype?: string;   // optional subtype
  lisDelta?: number;  // change in LIS (negative is good)
  risDelta?: number;  // change in RIS (positive is good)
  costDelta?: number; // change in cost (±)
  notes?: string;     // extra description
};
TS

# 4) Clean index for the folder-based module and re-export AltRec (+ any future types)
cat > src/types/index.ts <<'TS'
export * from "./altrec";

export interface Material {
  id?: string;
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  lis?: number;
  ris?: number;
  cpi?: number;
  price?: number;
}
export type Row = Material;

export interface LifecyclePhases {
  origin?: number;
  factory?: number;
  transport?: number;
  construction?: number;
  disposal?: number;
  lis?: number;
  ris?: number;
}

export interface MaterialDetail {
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  price: number;
  lifecycle: LifecyclePhases;
  subscores?: { category: string; score: number }[];
}

export interface Insight { type: string; text: string; }

export type Sort = { field: keyof Material; dir: "asc" | "desc" };
TS

# 5) Update any imports that point to a *file* or relative path to use the folder alias (if you already set baseUrl=src)
# (portable edit: makes a .bak for each touched file)
grep -rlE "from ['\"](\.\.\/types|\.\/types|src\/types)['\"]" src 2>/dev/null \
  | xargs -I{} sed -i.bak -E 's/from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']/from "@\/types"/g' {}

# 6) Quick verify that the AltRec import now resolves
grep -R --line-number "import type { AltRec } from" src/components | sed 's/^/• /'
# 0) Sanity: must be at project root
pwd
test -d src/components || { echo "❌ Run this from your project root (no src/components found)"; exit 1; }

###############################################################################
# 1) Remove the collision: move src/types.ts aside if it still exists
###############################################################################
if [ -f src/types.ts ]; then
  mkdir -p backups
  cp -f src/types.ts "backups/types.ts.$(date +%Y%m%d-%H%M%S)"
  git mv -f src/types.ts src/legacy-types.ts 2>/dev/null || mv -f src/types.ts src/legacy-types.ts
  echo "✅ Moved src/types.ts -> src/legacy-types.ts"
fi

###############################################################################
# 2) Ensure folder-based types exist and export AltRec from index.ts
###############################################################################
mkdir -p src/types

# altrec.ts (canonical AltRec)
cat > src/types/altrec.ts <<'TS'
export type AltRec = {
  baseName: string;
  altName: string;
  reason?: string;
  subtype?: string;
  lisDelta?: number;   // Δ LIS (negative is good)
  risDelta?: number;   // Δ RIS (positive is good)
  costDelta?: number;  // Δ cost (±)
  notes?: string;
};
TS

# index.ts (re-export AltRec + core types)
cat > src/types/index.ts <<'TS'
export * from "./altrec";

export interface Material {
  id?: string;
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  lis?: number;
  ris?: number;
  cpi?: number;
  price?: number;
}
export type Row = Material;

export interface LifecyclePhases {
  origin?: number;
  factory?: number;
  transport?: number;
  construction?: number;
  disposal?: number;
  lis?: number;
  ris?: number;
}

export interface MaterialDetail {
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  price: number;
  lifecycle: LifecyclePhases;
  subscores?: { category: string; score: number }[];
}

export interface Insight { type: string; text: string; }

export type Sort = { field: keyof Material; dir: "asc" | "desc" };
TS

###############################################################################
# 3) Normalize imports to use the alias "@/types" instead of ../types or ./types
###############################################################################
# (creates .bak files for anything touched)
grep -Rl -E "from ['\"](\.\.\/types|\.\/types|src\/types)['\"]" src 2>/dev/null \
  | xargs -I{} sed -i.bak -E 's/from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']/from "@\/types"/g' {}

###############################################################################
# 4) Enforce tsconfig baseUrl + paths so the alias resolves
###############################################################################
if command -v jq >/dev/null 2>&1; then
  jq '.compilerOptions.baseUrl="src" | .compilerOptions.paths={"@/*":["*"]}' tsconfig.json > tsconfig.tmp && mv tsconfig.tmp tsconfig.json
else
  # minimal sed fallback: insert/replace compilerOptions with baseUrl+paths
  sed -i.bak -E '
    /"compilerOptions"\s*:/,/}/{
      s/"baseUrl"\s*:\s*"[^"]*"/"baseUrl": "src"/g;
      s/"paths"\s*:\s*\{[^}]*\}/"paths": { "@\/*": ["*"] }/g
    }
  ' tsconfig.json
  # if baseUrl or paths missing completely, append them (safe even if already present)
  sed -i -E 's/"compilerOptions"\s*:\s*\{/"compilerOptions": { "baseUrl": "src", "paths": { "@\/*": ["*"] }, /' tsconfig.json
fi

###############################################################################
# 5) Quick verification
###############################################################################
echo "---- files in src/types ----"
ls -la src/types
echo "---- grep AltRec export ----"
grep -R --line-number "export type AltRec" src/types || true
echo "---- who still imports ../types or ./types? ----"
grep -R --line-number -E "from ['\"](\.\.\/types|\.\/types)['\"]" src || echo "✅ All imports normalized"

###############################################################################
# 6) Optional: terminal-level typecheck (good signal independent of VS Code)
###############################################################################
npx tsc --noEmit || true

echo "👉 Now in VS Code: Ctrl+Shift+P → “TypeScript: Restart TS server”"
echo "👉 If Vite is running: stop & run: npm run dev"
# --- Pre-flight: ensure the Vite alias matches tsconfig (@ -> ./src) ---
# This overwrites/creates vite.config.ts with a safe, standard config.
cat > vite.config.ts <<'TS'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5180, // keep your previous port; change if you want default 5173
  },
});
TS

# --- Clean caches that sometimes hold onto old paths ---
rm -rf node_modules/.vite dist .vite 2>/dev/null || true

# --- (Optional) ensure deps are installed ---
# npm install

# --- Launch dev server ---
npm run dev
# --- stop dev server first (Ctrl+C in the running terminal) ---

# 0) sanity
pwd
test -d src/components || { echo "❌ Not in project root (no src/components)"; exit 1; }

# 1) remove the colliding/broken file-based module
if [ -f src/types.ts ]; then
  mkdir -p backups
  cp -f src/types.ts "backups/types.ts.$(date +%Y%m%d-%H%M%S)"
  rm -f src/types.ts
  echo "✅ Removed src/types.ts (it had shell lines in it)"
fi

# 2) ensure folder-based types exist and are clean
mkdir -p src/types

cat > src/types/altrec.ts <<'TS'
export type AltRec = {
  baseName: string;
  altName: string;
  reason?: string;
  subtype?: string;
  lisDelta?: number;   // Δ LIS (negative is good)
  risDelta?: number;   // Δ RIS (positive is good)
  costDelta?: number;  // Δ cost (±)
  notes?: string;
};
TS

cat > src/types/index.ts <<'TS'
export * from "./altrec";

export interface Material {
  id?: string;
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  lis?: number;
  ris?: number;
  cpi?: number;
  price?: number;
}
export type Row = Material;

export interface LifecyclePhases {
  origin?: number;
  factory?: number;
  transport?: number;
  construction?: number;
  disposal?: number;
  lis?: number;
  ris?: number;
}

export interface MaterialDetail {
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  price: number;
  lifecycle: LifecyclePhases;
  subscores?: { category: string; score: number }[];
}

export interface Insight { type: string; text: string; }

export type Sort = { field: keyof Material; dir: "asc" | "desc" };
TS

# 3) overwrite StatsHeader.tsx with a clean version
mkdir -p backups
[ -f src/components/StatsHeader.tsx ] && cp -f src/components/StatsHeader.tsx "backups/StatsHeader.tsx.$(date +%Y%m%d-%H%M%S)"
cat > src/components/StatsHeader.tsx <<'TSX'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = {
  stats?: LegacyStats; // legacy shape: <StatsHeader stats={{ ... }} />
} & ExtendedProps;

function fmtNum(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString();
}
function fmtFloat(n?: number, digits = 2) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toFixed(digits);
}
function fmtCurrency(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const StatsHeader: React.FC<Props> = (props) => {
  const totalMaterials =
    typeof props.totalMaterials === "number"
      ? props.totalMaterials
      : props.stats?.totalMaterials ?? 0;

  const avgLifespan =
    typeof props.stats?.avgLifespan === "number" ? props.stats!.avgLifespan : undefined;

  const topCategory = props.stats?.topCategory;
  const sustainabilityScore =
    typeof props.stats?.sustainabilityScore === "number" ? props.stats!.sustainabilityScore : undefined;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];

  items.push({ label: "Total Materials", value: fmtNum(totalMaterials), hint: "In dataset" });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value: percentFiltered !== undefined
        ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
        : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({ label: "Avg Lifespan", value: `${fmtFloat(avgLifespan)} years`, hint: "Across visible rows" });
  }

  if (topCategory) items.push({ label: "Top Category", value: topCategory, hint: "Most represented" });

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") items.push({ label: "Avg LIS", value: fmtFloat(averageLIS, 1), hint: "Lower is better" });
  if (typeof averageRIS === "number") items.push({ label: "Avg RIS", value: fmtFloat(averageRIS, 1), hint: "Higher is better" });
  if (typeof totalCost === "number") items.push({ label: "Total Cost", value: fmtCurrency(totalCost), hint: "Sum of visible" });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{it.label}</div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
TSX

# 4) normalize any lingering imports to the folder module (creates .bak files for touched files)
grep -Rl -E "from ['\"](\.\.\/types|\.\/types|src\/types)['\"]" src 2>/dev/null \
  | xargs -I{} sed -i.bak -E 's/from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']/from "@\/types"/g' {}

# 5) quick diagnostics
echo "---- Should be NO shell text in these files:"
grep -n -E 'sed -i|grep -r|jq |rm -rf' src/components/StatsHeader.tsx || echo "✅ StatsHeader.tsx clean"
test -f src/types.ts && echo "❌ src/types.ts still exists" || echo "✅ src/types.ts removed"
grep -R --line-number "export type AltRec" src/types || echo "❌ AltRec missing"
# --- Stop the dev server (Ctrl+C) before running this ---

# 0) sanity
pwd
test -d src/components || { echo "❌ Run this from project root (no src/components)"; exit 1; }

# 1) Remove the broken file-based module that's shadowing the folder
if [ -f src/types.ts ]; then
  mkdir -p backups
  cp -f src/types.ts "backups/types.ts.$(date +%Y%m%d-%H%M%S)"
  rm -f src/types.ts
  echo "✅ Removed src/types.ts"
fi

# 2) Recreate clean folder-based types
mkdir -p src/types

cat > src/types/altrec.ts <<'TS'
export type AltRec = {
  baseName: string;
  altName: string;
  reason?: string;
  subtype?: string;
  lisDelta?: number;   // Δ LIS (negative is good)
  risDelta?: number;   // Δ RIS (positive is good)
  costDelta?: number;  // Δ cost (±)
  notes?: string;
};
TS

cat > src/types/index.ts <<'TS'
export * from "./altrec";

export interface Material {
  id?: string;
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  lis?: number;
  ris?: number;
  cpi?: number;
  price?: number;
}
export type Row = Material;

export interface LifecyclePhases {
  origin?: number;
  factory?: number;
  transport?: number;
  construction?: number;
  disposal?: number;
  lis?: number;
  ris?: number;
}

export interface MaterialDetail {
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  price: number;
  lifecycle: LifecyclePhases;
  subscores?: { category: string; score: number }[];
}

export interface Insight { type: string; text: string; }

export type Sort = { field: keyof Material; dir: "asc" | "desc" };
TS

# 3) Force-overwrite StatsHeader.tsx with a clean component (no shell text)
mkdir -p backups
[ -f src/components/StatsHeader.tsx ] && cp -f src/components/StatsHeader.tsx "backups/StatsHeader.tsx.$(date +%Y%m%d-%H%M%S)"
cat > src/components/StatsHeader.tsx <<'TSX'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = {
  stats?: LegacyStats; // legacy shape: <StatsHeader stats={{ ... }} />
} & ExtendedProps;

function fmtNum(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString();
}
function fmtFloat(n?: number, digits = 2) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toFixed(digits);
}
function fmtCurrency(n?: number) {
  if (typeof n !== "number" || !isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const StatsHeader: React.FC<Props> = (props) => {
  const totalMaterials =
    typeof props.totalMaterials === "number"
      ? props.totalMaterials
      : props.stats?.totalMaterials ?? 0;

  const avgLifespan =
    typeof props.stats?.avgLifespan === "number" ? props.stats!.avgLifespan : undefined;

  const topCategory = props.stats?.topCategory;
  const sustainabilityScore =
    typeof props.stats?.sustainabilityScore === "number" ? props.stats!.sustainabilityScore : undefined;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];

  items.push({ label: "Total Materials", value: fmtNum(totalMaterials), hint: "In dataset" });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value: percentFiltered !== undefined
        ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
        : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({ label: "Avg Lifespan", value: `${fmtFloat(avgLifespan)} years`, hint: "Across visible rows" });
  }

  if (topCategory) items.push({ label: "Top Category", value: topCategory, hint: "Most represented" });

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") items.push({ label: "Avg LIS", value: fmtFloat(averageLIS, 1), hint: "Lower is better" });
  if (typeof averageRIS === "number") items.push({ label: "Avg RIS", value: fmtFloat(averageRIS, 1), hint: "Higher is better" });
  if (typeof totalCost === "number") items.push({ label: "Total Cost", value: fmtCurrency(totalCost), hint: "Sum of visible" });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{it.label}</div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
TSX

# 4) Normalize any lingering imports of ../types or ./types to the alias "@/types"
grep -Rl -E "from ['\"](\.\.\/types|\.\/types|src\/types)['\"]" src 2>/dev/null \
  | xargs -I{} sed -i.bak -E 's/from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']/from "@\/types"/g' {}

# 5) Quick sanity checks
echo "---- verify no shell text remains in StatsHeader.tsx ----"
grep -n -E 'sed -i|grep -r|jq |rm -rf' src/components/StatsHeader.tsx || echo "✅ StatsHeader.tsx clean"

echo "---- verify src/types.ts is gone ----"
[ -f src/types.ts ] && echo "❌ src/types.ts still exists" || echo "✅ src/types.ts removed"

echo "---- verify AltRec export exists ----"
grep -R --line-number "export type AltRec" src/types || echo "❌ AltRec missing"

# 6) Restart dev server afterwards
echo "Now: VS Code → TypeScript: Restart TS server; then run: npm run dev"
# backup & regenerate src/components/AltRecs.tsx
mkdir -p backups
[ -f src/components/AltRecs.tsx ] && cp -f src/components/AltRecs.tsx "backups/AltRecs.tsx.$(date +%Y%m%d-%H%M%S)"

cat > src/components/AltRecs.tsx <<'TSX'
import React from "react";
import type { AltRec } from "@/types";

// Simple map of baseName -> altName for what's been applied
type ReplacementMap = Record<string, string>;

export interface AltRecsProps {
  items: AltRec[];
  applied: ReplacementMap;
  onApply: (rec: AltRec) => void;
  onClear: () => void;
  className?: string;
}

function fmtDelta(n?: number, digits = 1) {
  if (n == null || !isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}`;
}

function DeltaBadge({ label, value }: { label: string; value?: number }) {
  if (value == null || !isFinite(value)) return null;
  const pos = value > 0;
  const cls = pos
    ? "bg-green-100 text-green-700"
    : value < 0
    ? "bg-red-100 text-red-700"
    : "bg-gray-100 text-gray-700";
  return (
    <span className={`rounded px-2 py-0.5 text-xs ${cls}`}>
      {fmtDelta(value)} {label}
    </span>
  );
}

const AltRecs: React.FC<AltRecsProps> = ({
  items,
  applied,
  onApply,
  onClear,
  className,
}) => {
  const appliedCount = Object.keys(applied || {}).length;

  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suggested Alternatives</h2>
        <div className="flex items-center gap-2">
          <span className="rounded bg-black px-2 py-0.5 text-xs text-white dark:bg-white dark:text-black">
            {appliedCount} applied
          </span>
          <button
            onClick={onClear}
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:border-white/10 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((rec, i) => {
          const isApplied = !!applied?.[rec.baseName];

          // notes may be a string or array; normalize to string[]
          const notes: string[] =
            Array.isArray((rec as any).notes)
              ? ((rec as any).notes as string[])
              : (typeof rec.notes === "string" ? rec.notes.split(/\r?\n/).filter(Boolean) : []);

          return (
            <li
              key={`${rec.baseName}::${rec.altName}::${i}`}
              className="rounded-lg border px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {rec.baseName}
                  </div>
                  <div className="text-base font-semibold">{rec.altName}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onApply(rec)}
                  className={`rounded-md px-3 py-1 text-sm ${
                    isApplied
                      ? "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-200 cursor-default"
                      : "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                  }`}
                  disabled={isApplied}
                  title={isApplied ? "Applied" : "Apply this swap"}
                >
                  {isApplied ? "Applied" : "Apply"}
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <DeltaBadge label="CPI" value={rec.deltaCPI ?? rec.costDelta} />
                <DeltaBadge label="RIS" value={rec.deltaRIS ?? rec.risDelta} />
                <DeltaBadge label="LIS" value={rec.deltaLIS ?? rec.lisDelta} />
              </div>

              {notes.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-sm text-gray-600 dark:text-gray-300">
                  {notes.slice(0, 3).map((n, j) => (
                    <li key={j}>{n}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AltRecs;
TSX
# Backup & regenerate src/components/AltRecsPanel.tsx
mkdir -p backups
[ -f src/components/AltRecsPanel.tsx ] && cp -f src/components/AltRecsPanel.tsx "backups/AltRecsPanel.tsx.$(date +%Y%m%d-%H%M%S)"

cat > src/components/AltRecsPanel.tsx <<'TSX'
import React from "react";
import type { AltRec } from "@/types"; // or: "../../types" if you don't use the alias

// Map of baseName -> altName for which swaps are applied
type ReplacementMap = Record<string, string>;

export interface AltRecsPanelProps {
  items: AltRec[];
  applied: ReplacementMap;
  onApply: (rec: AltRec) => void;
  onClear: () => void;
  className?: string;
}

function isNum(n: unknown): n is number {
  return typeof n === "number" && isFinite(n);
}
function fmtDelta(n?: number, digits = 1) {
  if (!isNum(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}`;
}
function DeltaPill({ label, value }: { label: string; value?: number }) {
  if (!isNum(value)) return null;
  const pos = value > 0;
  const cls = pos
    ? "bg-green-100 text-green-700"
    : value < 0
    ? "bg-red-100 text-red-700"
    : "bg-gray-100 text-gray-700";
  return (
    <span className={`rounded px-2 py-0.5 text-xs ${cls}`}>
      {fmtDelta(value)} {label}
    </span>
  );
}

const AltRecsPanel: React.FC<AltRecsPanelProps> = ({
  items,
  applied,
  onApply,
  onClear,
  className,
}) => {
  const appliedCount = Object.keys(applied || {}).length;

  return (
    <section className={className}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suggested Alternatives</h2>
        <div className="flex items-center gap-2">
          <span className="rounded bg-black px-2 py-0.5 text-xs text-white dark:bg-white dark:text-black">
            {appliedCount} applied
          </span>
          <button
            onClick={onClear}
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:border-white/10 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Cards */}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((rec: AltRec, i: number) => {
          const isApplied = !!applied?.[rec.baseName];

          // Support string or string[] for notes (normalize to array)
          const notes: string[] = Array.isArray((rec as any).notes)
            ? ((rec as any).notes as string[])
            : typeof rec.notes === "string"
            ? rec.notes.split(/\r?\n/).filter(Boolean)
            : [];

          // Prefer new delta fields, fall back to legacy names
          const dCPI = isNum(rec.deltaCPI) ? rec.deltaCPI : rec.costDelta;
          const dRIS = isNum(rec.deltaRIS) ? rec.deltaRIS : rec.risDelta;
          const dLIS = isNum(rec.deltaLIS) ? rec.deltaLIS : rec.lisDelta;

          return (
            <li
              key={`${rec.baseName}::${rec.altName}::${i}`}
              className="rounded-lg border px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {rec.baseName}
                  </div>
                  <div className="text-base font-semibold">{rec.altName}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onApply(rec)}
                  className={`rounded-md px-3 py-1 text-sm ${
                    isApplied
                      ? "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-200 cursor-default"
                      : "bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                  }`}
                  disabled={isApplied}
                  title={isApplied ? "Applied" : "Apply this swap"}
                >
                  {isApplied ? "Applied" : "Apply"}
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <DeltaPill label="CPI" value={dCPI} />
                <DeltaPill label="RIS" value={dRIS} />
                <DeltaPill label="LIS" value={dLIS} />
                {rec.subtype && (
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-zinc-800 dark:text-gray-200">
                    {rec.subtype}
                  </span>
                )}
              </div>

              {(rec.reason || notes.length > 0) && (
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {rec.reason && <div className="mb-1">{rec.reason}</div>}
                  {notes.length > 0 && (
                    <ul className="list-inside list-disc">
                      {notes.slice(0, 3).map((n: string, j: number) => (
                        <li key={j}>{n}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AltRecsPanel;
TSX
# 0) See if there are multiple AltRec definitions (this causes exactly your symptom)
echo "🔎 Searching for AltRec definitions…"
grep -R --line-number -E '(^|\s)(type|interface)\s+AltRec\b' src || true

# 1) Overwrite the single source of truth: src/types/altrec.ts
mkdir -p backups src/types
[ -f src/types/altrec.ts ] && cp -f src/types/altrec.ts "backups/altrec.ts.$(date +%Y%m%d-%H%M%S)"

cat > src/types/altrec.ts <<'TS'
export type AltRec = {
  baseName: string;      // original material
  altName: string;       // suggested alternative

  // Deltas used by UI (preferred names)
  deltaCPI?: number;     // change in CPI
  deltaRIS?: number;     // change in RIS
  deltaLIS?: number;     // change in LIS

  // Legacy synonyms (keep for compat)
  lisDelta?: number;
  risDelta?: number;
  costDelta?: number;

  // Optional metadata some UIs read
  score?: number;
  confidence?: number;
  subtype?: string;
  reason?: string;
  notes?: string | string[];
};
TS

# 2) Ensure src/types/index.ts re-exports AltRec (so `@/types` works)
if [ -f src/types/index.ts ]; then
  grep -q 'export \* from "./altrec"' src/types/index.ts || \
    echo 'export * from "./altrec";' >> src/types/index.ts
else
  cat > src/types/index.ts <<'TS'
export * from "./altrec";

export interface Material {
  id?: string;
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  lis?: number;
  ris?: number;
  cpi?: number;
  price?: number;
}
export type Row = Material;
TS
fi

# 3) Normalize all component imports to use the canonical type
#    (use the alias if you have baseUrl/paths set)
sed -i.bak -E 's#from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']#from "@/types/altrec"#g' \
  src/components/AltRecs.tsx 2>/dev/null || true
sed -i.bak -E 's#from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']#from "@/types/altrec"#g' \
  src/components/AltRecsPanel.tsx 2>/dev/null || true

# 4) Show the import lines so you can verify
echo "🔎 Import lines now:"
grep -n -E 'from .*/types' src/components/AltRecs*.tsx || true

# 5) Quick sanity: list the AltRec fields TS will see
echo "🔎 Canonical AltRec:"
nl -ba src/types/altrec.ts | sed -n '1,120p'
npm run dev
# 0) sanity
pwd
test -d src/components || { echo "❌ Run from project root (no src/components)"; exit 1; }

mkdir -p backups

# 1) Remove any file-based 'types.ts' that can shadow the folder
if [ -f src/types.ts ]; then
  cp -f src/types.ts "backups/types.ts.$(date +%Y%m%d-%H%M%S)"
  rm -f src/types.ts
  echo "✅ removed src/types.ts"
fi

# 2) Restore canonical types folder
mkdir -p src/types

cat > src/types/altrec.ts <<'TS'
export type AltRec = {
  baseName: string;      // original material
  altName: string;       // suggested alternative

  // Preferred UI fields
  deltaCPI?: number;
  deltaRIS?: number;
  deltaLIS?: number;

  // Legacy synonyms (compat)
  lisDelta?: number;
  risDelta?: number;
  costDelta?: number;

  // Optional metadata some UIs read
  score?: number;
  confidence?: number;
  subtype?: string;
  reason?: string;
  notes?: string | string[];
};
TS

# index.ts must NOT contain React or bash—just exports/types
cat > src/types/index.ts <<'TS'
export * from "./altrec";

export interface Material {
  id?: string;
  name: string;
  category: string;
  subtype: string;
  unit: string;
  quantity: number;
  lis?: number;
  ris?: number;
  cpi?: number;
  price?: number;
}
export type Row = Material;
TS

# 3) Recreate a clean StatsHeader component (no heredocs, no bash)
[ -f src/components/StatsHeader.tsx ] && cp -f src/components/StatsHeader.tsx "backups/StatsHeader.tsx.$(date +%Y%m%d-%H%M%S)"
cat > src/components/StatsHeader.tsx <<'TSX'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = { stats?: LegacyStats } & ExtendedProps;

function fmtNum(n?: number) { return typeof n === "number" && isFinite(n) ? n.toLocaleString() : "—"; }
function fmtFloat(n?: number, d = 2) { return typeof n === "number" && isFinite(n) ? n.toFixed(d) : "—"; }
function fmtCurrency(n?: number) {
  return typeof n === "number" && isFinite(n)
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 })
    : "—";
}

const StatsHeader: React.FC<Props> = (props) => {
  const totalMaterials =
    typeof props.totalMaterials === "number" ? props.totalMaterials : props.stats?.totalMaterials ?? 0;

  const avgLifespan = props.stats?.avgLifespan;
  const topCategory = props.stats?.topCategory;
  const sustainabilityScore = props.stats?.sustainabilityScore;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];
  items.push({ label: "Total Materials", value: fmtNum(totalMaterials), hint: "In dataset" });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value: percentFiltered !== undefined
        ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
        : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({ label: "Avg Lifespan", value: `${fmtFloat(avgLifespan)} years`, hint: "Across visible rows" });
  }

  if (topCategory) items.push({ label: "Top Category", value: topCategory, hint: "Most represented" });

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") items.push({ label: "Avg LIS", value: fmtFloat(averageLIS, 1), hint: "Lower is better" });
  if (typeof averageRIS === "number") items.push({ label: "Avg RIS", value: fmtFloat(averageRIS, 1), hint: "Higher is better" });
  if (typeof totalCost === "number") items.push({ label: "Total Cost", value: fmtCurrency(totalCost), hint: "Sum of visible" });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{it.label}</div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
TSX

# 4) Strip stray bash lines from any .ts/.tsx that accidentally got them
# (delete chmod/export-type heredocs and trailing EOF markers inside TS files)
grep -R -l -E 'export-type\.sh|^cat <<|^EOF$' src --include=\*.ts --include=\*.tsx 2>/dev/null | while read -r f; do
  cp -f "$f" "backups/$(basename "$f").$(date +%Y%m%d-%H%M%S).bak"
  sed -i -E '/export-type\.sh/d;/^cat <<.*EOF.*/d;/^EOF$/d' "$f"
  echo "🧹 cleaned bash lines from $f"
done

# 5) Make sure components import the canonical AltRec
sed -i.bak -E 's#from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']#from "@/types/altrec"#g' src/components/AltRecs*.tsx 2>/dev/null || true

echo "✅ Cleanup complete. Now: VS Code → TypeScript: Restart TS server, then: npm run dev"
[ -f src/components/StatsHeader.tsx ] && cp -f src/components/StatsHeader.tsx "backups/StatsHeader.tsx.$(date +%Y%m%d-%H%M%S)"
cat > src/components/StatsHeader.tsx <<'TSX'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = { stats?: LegacyStats } & ExtendedProps;

function fmtNum(n?: number) { return typeof n === "number" && isFinite(n) ? n.toLocaleString() : "—"; }
function fmtFloat(n?: number, d = 2) { return typeof n === "number" && isFinite(n) ? n.toFixed(d) : "—"; }
function fmtCurrency(n?: number) {
  return typeof n === "number" && isFinite(n)
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 })
    : "—";
}

const StatsHeader: React.FC<Props> = (props) => {
  const totalMaterials =
    typeof props.totalMaterials === "number" ? props.totalMaterials : props.stats?.totalMaterials ?? 0;

  const avgLifespan = props.stats?.avgLifespan;
  const topCategory = props.stats?.topCategory;
  const sustainabilityScore = props.stats?.sustainabilityScore;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;
  const totalCost = props.totalCost;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];
  items.push({ label: "Total Materials", value: fmtNum(totalMaterials), hint: "In dataset" });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value: percentFiltered !== undefined
        ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
        : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({ label: "Avg Lifespan", value: `${fmtFloat(avgLifespan)} years`, hint: "Across visible rows" });
  }

  if (topCategory) items.push({ label: "Top Category", value: topCategory, hint: "Most represented" });

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") items.push({ label: "Avg LIS", value: fmtFloat(averageLIS, 1), hint: "Lower is better" });
  if (typeof averageRIS === "number") items.push({ label: "Avg RIS", value: fmtFloat(averageRIS, 1), hint: "Higher is better" });
  if (typeof totalCost === "number") items.push({ label: "Total Cost", value: fmtCurrency(totalCost), hint: "Sum of visible" });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{it.label}</div>
          <div className="mt-1 text-xl font-semibold">{it.value}</div>
          {it.hint && <div className="text-xs text-gray-500 dark:text-gray-400">{it.hint}</div>}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
TSX
# --- 0) prep
set -e
mkdir -p backups scripts

# --- 1) Clean & restore canonical types

# 1a) Clean src/types/index.ts (backup, then overwrite with pure TS)
[ -f src/types/index.ts ] && cp -f src/types/index.ts "backups/index.ts.$(date +%Y%m%d-%H%M%S)"
cat > src/types/index.ts <<'TS'
export * from "./altrec";
// re-export other types here if needed, but keep this file pure TypeScript.
TS

# 1b) Ensure canonical AltRec exists (with deltaCPI/deltaRIS/deltaLIS + legacy keys)
mkdir -p src/types
[ -f src/types/altrec.ts ] || cat > src/types/altrec.ts <<'TS'
export type AltRec = {
  baseName: string;
  altName: string;

  // Preferred fields the UI reads
  deltaCPI?: number;
  deltaRIS?: number;
  deltaLIS?: number;

  // Legacy synonyms (compat)
  lisDelta?: number;
  risDelta?: number;
  costDelta?: number;

  // Optional metadata
  score?: number;
  confidence?: number;
  subtype?: string;
  reason?: string;
  notes?: string | string[];
};
TS

# --- 2) Move the shell script OUT of src (so TS never sees it)
if [ -f src/types/export-type.sh ]; then
  mv -f src/types/export-type.sh scripts/export-type.sh
  echo "✅ moved src/types/export-type.sh -> scripts/export-type.sh"
fi

# --- 3) Scrub any leftover shell lines that may be inside .ts/.tsx files
# (chmod/./export-type.sh/heredoc markers)
grep -R -l -E 'export-type\.sh|chmod \+x|^cat <<|^EOF$' src --include=\*.ts --include=\*.tsx 2>/dev/null | while read -r f; do
  cp -f "$f" "backups/$(basename "$f").$(date +%Y%m%d-%H%M%S).bak"
  sed -i -E '/export-type\.sh/d;/chmod \+x/d;/^cat <<.*/d;/^EOF$/d' "$f"
  echo "🧹 cleaned shell lines in $f"
done

# --- 4) Normalize component imports to the canonical AltRec
# Use your @ alias (tsconfig already maps "@/..." to "src/...").
sed -i.bak -E 's#from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']#from "@/types/altrec"#g' \
  src/components/AltRecs.tsx 2>/dev/null || true
sed -i.bak -E 's#from [\"\'](\.\.\/types|\.\/types|src\/types)[\"\']#from "@/types/altrec"#g' \
  src/components/AltRecsPanel.tsx 2>/dev/null || true

# --- 5) Show what changed (sanity)
echo "------ src/types/index.ts"
sed -n '1,80p' src/types/index.ts
echo "------ any remaining shell in TS files?"
grep -R -n -E 'export-type\.sh|^cat <<|^EOF$' src --include=\*.ts --include=\*.tsx || echo "None ✅"
# 1) Fix the ONLY hard error I still see: default-exporting a type
# (removes 'export default AltRec;' if present)
sed -i.bak -E '/^\s*export default AltRec\s*;?\s*$/d' src/types/altrec.ts

# Also mass-fix any default imports of AltRec -> named type import
grep -Rl -E 'import\s+AltRec\s+from\s+["\'].*altrec["\']' src 2>/dev/null \
  | xargs -I{} sed -i.bak -E 's#import\s+AltRec\s+from\s+([\"\'][^\"\']*altrec[\"\']);#import type { AltRec } from \1;#g' {}

# 2) Make sure everyone imports from the canonical file path
npx ts-node import-codemod.ts --dry-run
npx ts-node import-codemod.ts

# 3) Clear caches that cause flicker
rm -rf node_modules/.vite .tsbuildinfo 2>/dev/null || true

# 4) Quick duplicate/type resolution check
npx ts-node diagnostic-script.ts
npm run dev
# fix-reds.sh (paste straight into your terminal)

set -e

echo "🔧 Stabilizing TS types & imports (AltRec)…"

# 0) sanity
test -d src || { echo "❌ run in project root (no src/)"; exit 1; }
mkdir -p backups

###############################################################################
# 1) SCRUB stray shell/heredoc lines from any .ts/.tsx that accidentally got them
###############################################################################
echo "🧹 Scrubbing embedded shell from TS/TSX…"
grep -R -l -E 'export-type\.sh|chmod \+x|^cat <<|^EOF$' src --include=\*.ts --include=\*.tsx 2>/dev/null \
| while read -r f; do
  cp -f "$f" "backups/$(basename "$f").$(date +%Y%m%d-%H%M%S).bak"
  sed -i -E '/export-type\.sh/d;/chmod \+x/d;/^cat <<.*/d;/^EOF$/d' "$f"
  echo "  • cleaned $f"
done || true

###############################################################################
# 2) ENSURE we only use folder-based types (no src/types.ts overshadow)
###############################################################################
if [ -f src/types.ts ]; then
  cp -f src/types.ts "backups/types.ts.$(date +%Y%m%d-%H%M%S)"
  rm -f src/types.ts
  echo "🗂️  Removed file module src/types.ts (shadowed folder)"
fi

###############################################################################
# 3) WRITE canonical AltRec (no default export) + ensure index re-exports it
###############################################################################
mkdir -p src/types

cat > src/types/altrec.ts <<'TS'
// src/types/altrec.ts
export type AltRec = {
  baseName: string;
  altName: string;

  // Modern fields
  deltaCPI?: number;
  deltaRIS?: number;
  deltaLIS?: number;

  // Legacy compatibility
  costDelta?: number;   // use deltaCPI instead
  risDelta?: number;    // use deltaRIS instead
  lisDelta?: number;    // use deltaLIS instead

  // Optional metadata
  score?: number;
  confidence?: number;
  subtype?: string;
  reason?: string;
  notes?: string | string[];
};

export function isAltRec(obj: unknown): obj is AltRec {
  return typeof obj === 'object' && obj !== null &&
         'baseName' in obj && 'altName' in obj;
}

export const getAltRecDeltas = (record: AltRec) => ({
  deltaCPI: record.deltaCPI ?? record.costDelta,
  deltaRIS: record.deltaRIS ?? record.risDelta,
  deltaLIS: record.deltaLIS ?? record.lisDelta,
});
TS

# ensure index re-exports, without clobbering other content
if [ -f src/types/index.ts ]; then
  grep -q 'export \* from "./altrec"' src/types/index.ts || \
    (printf 'export * from "./altrec";\n' | cat - src/types/index.ts > src/types/.index.new && mv src/types/.index.new src/types/index.ts)
else
  printf 'export * from "./altrec";\n' > src/types/index.ts
fi
# remove any accidental default export of a type
sed -i -E '/^\s*export default AltRec\s*;?\s*$/d' src/types/altrec.ts

###############################################################################
# 4) NORMALIZE imports so every file pulls the SAME AltRec
###############################################################################
echo "🔁 Normalizing AltRec imports to '@/types/altrec'…"
# fix default-imports -> named type import
grep -R -l -E 'import\s+AltRec\s+from\s+.*altrec' src 2>/dev/null \
| while read -r f; do
  cp -f "$f" "backups/$(basename "$f").imports.$(date +%Y%m%d-%H%M%S).bak"
  sed -i -E 's#import\s+AltRec\s+from\s+([\"\'][^\"\']*altrec[\"\']);#import type { AltRec } from \1;#g' "$f"
  echo "  • fixed default import in $f"
done || true

# rewrite non-canonical import paths that mention /types to the canonical file
grep -R -l -E 'import.*AltRec.*from\s*[\"\'](\.\.\/types|\.\/types|src\/types|@\/types)(\/index)?[\"\']' src 2>/dev/null \
| while read -r f; do
  cp -f "$f" "backups/$(basename "$f").paths.$(date +%Y%m%d-%H%M%S).bak"
  sed -i -E 's#from\s*[\"\'](\.\.\/types|\.\/types|src\/types|@\/types)(\/index)?[\"\']#from "@/types/altrec"#g' "$f"
  echo "  • normalized AltRec import in $f"
done || true

###############################################################################
# 5) LINE ENDINGS: convert CRLF -> LF for TS/TSX (prevents re-parse flicker)
###############################################################################
echo "↩️  Normalizing line endings (CRLF→LF) in src/**/*.ts{,x}…"
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 \
| while IFS= read -r -d '' f; do
  # strip trailing \r safely
  perl -i -pe 's/\r$//' "$f"
done

###############################################################################
# 6) CLEAN caches & backups that the watchers might be picking up
###############################################################################
echo "🗑️  Cleaning Vite & TS caches…"
rm -rf node_modules/.vite .tsbuildinfo dist 2>/dev/null || true

echo "🙈 Removing backup artifacts inside src (prevent re-parsing)…"
find src -type f \( -name "*.bak" -o -name "*.tmp" -o -name "*.pre-*" \) -delete 2>/dev/null || true

###############################################################################
# 7) DIAGNOSTICS
###############################################################################
echo "🔎 Duplicate AltRec declarations (should be 1 file only, the altrec.ts above):"
grep -R --line-number -E '(^|\s)(type|interface)\s+AltRec\b' src || echo "  ✓ none other than src/types/altrec.ts"

echo "🔎 Where do we import AltRec from now?"
grep -R --line-number -E 'import.*AltRec.*from' src | sed -E 's/^\.\///' || true

echo "✅ Done. In VS Code: TypeScript: Restart TS server; then: npm run dev"
# === Apply Manus's PR kit safely ===
set -euo pipefail

ZIP="pr-checklist-implementation (1).zip"   # adjust if needed
test -f "$ZIP" || { echo "❌ ZIP not found: $ZIP"; exit 1; }
test -d src || { echo "❌ Run in repo root (no src/ dir)"; exit 1; }

STAMP="$(date +%Y%m%d-%H%M%S)"
TMP=".prkit-$STAMP"
mkdir -p "$TMP" backups

echo "📦 Unpacking kit..."
unzip -q "$ZIP" -d "$TMP"

# 1) Workspace settings (.vscode)
echo "🛠  Updating .vscode settings..."
mkdir -p .vscode
if [ -f .vscode/settings.json ]; then cp -f .vscode/settings.json "backups/settings.json.$STAMP"; fi
if [ -f "$TMP/.vscode/settings.json" ]; then cp -f "$TMP/.vscode/settings.json" .vscode/settings.json; fi
if [ -f "$TMP/.vscode/extensions.json" ]; then cp -f "$TMP/.vscode/extensions.json" .vscode/extensions.json; fi

# 2) Editor hygiene files
for f in .editorconfig .gitattributes; do
  if [ -f "$TMP/$f" ]; then
    [ -f "$f" ] && cp -f "$f" "backups/${f#./}.$STAMP"
    cp -f "$TMP/$f" "$f"
  fi
done

# 3) tsconfig.json (merge if jq present; else backup+replace)
if [ -f "$TMP/tsconfig.json" ]; then
  echo "🧩 Merging tsconfig.json..."
  [ -f tsconfig.json ] && cp -f tsconfig.json "backups/tsconfig.json.$STAMP"
  if command -v jq >/dev/null 2>&1; then
    jq -s '
      def merge(a;b): reduce b[] as $i (a; . * $i);
      (.[0] * .[1])
      | .compilerOptions.moduleResolution = "Bundler"
      | .compilerOptions.baseUrl = "."
      | .compilerOptions.paths = ((.[0].compilerOptions.paths // {}) + {"@/*":["src/*"]})
      | .exclude = ((.[0].exclude // []) + ["node_modules","dist","build","backups","scripts","**/*.bak","**/*.tmp","**/*.pre-*","**/*.sh","backend"]) | .exclude |= unique
      ' tsconfig.json "$TMP/tsconfig.json" > tsconfig.json.tmp && mv tsconfig.json.tmp tsconfig.json
  else
    echo "⚠️ jq not found; replacing tsconfig.json"
    cp -f "$TMP/tsconfig.json" tsconfig.json
  fi
fi

# 4) vite.config.ts (backup + replace with kit’s version)
if [ -f "$TMP/vite.config.ts" ]; then
  echo "⚡ Updating vite.config.ts..."
  [ -f vite.config.ts ] && cp -f vite.config.ts "backups/vite.config.ts.$STAMP"
  cp -f "$TMP/vite.config.ts" vite.config.ts
fi

# 5) package.json (optionally merge; here we keep your deps and add missing tools)
if [ -f package.json ]; then
  echo "📦 Ensuring dev tools exist..."
  npm pkg set "devDependencies.typescript"="^5.5.0" >/dev/null 2>&1 || true
  npm pkg set "devDependencies.ts-node"="^10.9.2" >/dev/null 2>&1 || true
  npm pkg set "devDependencies.rimraf"="^5.0.5" >/dev/null 2>&1 || true
  npm pkg set "scripts.check:types"="tsc --noEmit" >/dev/null 2>&1 || true
fi

# 6) Place codemod/diagnostics scripts if included
for f in import-codemod.ts diagnostic-script.ts; do
  if [ -f "$TMP/$f" ]; then cp -f "$TMP/$f" "./$f"; fi
done

# 7) Canonical AltRec + imports (no default export)
echo "🔤 Normalizing AltRec types & imports..."
mkdir -p src/types
# Remove any stray file that shadows the folder
[ -f src/types.ts ] && mv src/types.ts "backups/types.ts.$STAMP"
# Ensure no `export default AltRec`
sed -i.bak -E '/^\s*export default AltRec\s*;?\s*$/d' src/types/altrec.ts 2>/dev/null || true
# Ensure index re-exports AltRec
if [ -f src/types/index.ts ]; then
  grep -q 'export \* from "./altrec"' src/types/index.ts 2>/dev/null || \
    (printf 'export * from "./altrec";\n' | cat - src/types/index.ts > src/types/.index.new && mv src/types/.index.new src/types/index.ts)
else
  printf 'export * from "./altrec";\n' > src/types/index.ts
fi
# Rewrite any non-canonical AltRec imports -> "@/types/altrec"
grep -R -l -E 'import.*AltRec.*from\s*[\"\'](\.\.\/types|\.\/types|src\/types|@\/types)(\/index)?[\"\']' src 2>/dev/null \
| while read -r f; do
  cp -f "$f" "backups/$(basename "$f").imports.$STAMP"
  sed -i -E 's#from\s*[\"\'](\.\.\/types|\.\/types|src\/types|@\/types)(\/index)?[\"\']#from "@/types/altrec"#g' "$f"
done
# Convert any default-import of AltRec -> named type import
grep -R -l -E 'import\s+AltRec\s+from\s+.*altrec' src 2>/dev/null \
| while read -r f; do
  cp -f "$f" "backups/$(basename "$f").defaultimp.$STAMP"
  sed -i -E 's#import\s+AltRec\s+from\s+([\"\'][^\"\']*altrec[\"\']);#import type { AltRec } from \1;#g' "$f"
done

# 8) Normalize line endings to LF for TS/TSX (prevents watcher churn)
echo "↩️  Normalizing CRLF→LF in TS/TSX…"
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 perl -i -pe 's/\r$//'

# 9) Install tools if needed & run codemod
echo "⬇️  Ensuring dev deps (typescript/ts-node)…"
npm i -D typescript ts-node >/dev/null 2>&1 || true

if [ -f import-codemod.ts ]; then
  echo "🧼 Running AltRec import codemod…"
  npx ts-node import-codemod.ts --dry-run
  npx ts-node import-codemod.ts
fi

# 10) Clean caches that cause flicker
echo "🗑️  Clearing Vite/TS caches…"
rm -rf node_modules/.vite .tsbuildinfo dist 2>/dev/null || true

echo "✅ Kit applied. Next steps:"
echo "  1) In VS Code: TypeScript: Restart TS Server"
echo "  2) In VS Code: Developer: Reload Window (optional)"
echo "  3) npm run dev"
mkdir -p tools && curl -sSLo tools/apply-anti-flicker.sh - <<< 'PASTE_SCRIPT_HERE' && chmod +x tools/apply-anti-flicker.sh && bash tools/apply-anti-flicker.sh

#!/usr/bin/env bash
set -euo pipefail

echo "==> Anti-Flicker Patch v2 (TypeScript + Vite + VS Code)"

# ---- helpers ----
ROOT="$(pwd)"
BACKUP_DIR="$ROOT/backups/anti-flicker-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR" ".vscode" "src/types" "scripts"

backup_if_exists () {
  local f="$1"
  if [[ -f "$f" ]]; then
    mkdir -p "$(dirname "$BACKUP_DIR/$f")"
    cp -f "$f" "$BACKUP_DIR/$f"
    echo "  • backed up $f -> $BACKUP_DIR/$f"
  fi
}

require_cmd () {
  command -v "$1" >/dev/null 2>&1 || { echo "ERROR: missing '$1'"; exit 1; }
}

require_cmd node
require_cmd npm

# ---- 1) VS Code settings ----
echo "==> Writing .vscode/settings.json"
backup_if_exists ".vscode/settings.json"
cat > .vscode/settings.json <<'JSON'
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsserver.useSeparateSyntaxServer": false,

  "typescript.tsserver.watchOptions": {
    "watchFile": "useFsEventsOnParentDirectory",
    "watchDirectory": "useFsEvents"
  },
  "typescript.disableAutomaticTypeAcquisition": true,
  "typescript.preferences.importModuleSpecifier": "non-relative",

  "editor.formatOnSave": true,

  "files.watcherExclude": {
    "**/.git/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.vite/**": true,
    "**/.vercel/**": true,
    "**/.cache/**": true,
    "**/*.bak": true,
    "**/*.tmp": true,
    "**/backups/**": true,
    "**/scripts/**": true
  },
  "search.exclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.vite/**": true,
    "**/.vercel/**": true,
    "**/*.bak": true,
    "**/*.tmp": true,
    "**/backups/**": true,
    "**/scripts/**": true
  }
}
JSON

# ---- 2) tsconfig(s) ----
echo "==> Writing tsconfig.json"
backup_if_exists "tsconfig.json"
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",

    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "resolveJsonModule": true,

    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vite/client", "node"]
  },
  "include": ["src", "vite-env.d.ts"],
  "exclude": [
    "node_modules",
    "dist",
    ".vite",
    ".vercel",
    "backups",
    "scripts",
    "**/*.bak",
    "**/*.tmp",
    "**/*.sh"
  ]
}
JSON

echo "==> Writing tsconfig.node.json"
backup_if_exists "tsconfig.node.json"
cat > tsconfig.node.json <<'JSON'
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
JSON

# vite env d.ts (harmless if already exists)
if [[ ! -f "vite-env.d.ts" ]]; then
  echo "==> Creating vite-env.d.ts"
  cat > vite-env.d.ts <<'TS'
// See: https://vitejs.dev/guide/env-and-mode.html
/// <reference types="vite/client" />
TS
fi

# ---- 3) Vite config ----
echo "==> Writing vite.config.ts"
backup_if_exists "vite.config.ts"
cat > vite.config.ts <<'TS'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  server: {
    watch: {
      ignored: [
        "**/*.bak",
        "**/*.tmp",
        "**/backups/**",
        "**/.vite/**",
        "**/.vercel/**",
        "**/scripts/**"
      ]
    }
  }
});
TS

# ---- 4) Canonical types ----
echo "==> Writing canonical types: src/types/altrec.ts + index.ts"
backup_if_exists "src/types/altrec.ts"
cat > src/types/altrec.ts <<'TS'
export interface AltRec {
  id: string;
  name: string;
  // extend with your real fields
}
TS

backup_if_exists "src/types/index.ts"
cat > src/types/index.ts <<'TS'
export * from "./altrec";
TS

# ---- 5) Import codemod ----
echo "==> Writing scripts/fix-altrec-imports.mjs"
backup_if_exists "scripts/fix-altrec-imports.mjs"
cat > scripts/fix-altrec-imports.mjs <<'JS'
import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "src");
const IGNORE = /(node_modules|dist|\.vite|\.vercel|backups|scripts)(\/|$)/;
const EXTS = new Set([".ts", ".tsx"]);

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE.test(p)) continue;
      walk(p);
    } else if (EXTS.has(path.extname(p))) {
      files.push(p);
    }
  }
}

// Only if src exists:
if (fs.existsSync(ROOT)) walk(ROOT);

const re = /from\s+["']([^"']*types(?:\/index)?\/?altrec|[^"']*types\/index)["'];?/g;

let changed = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const next = src.replace(re, `from "@/types/altrec"`);
  if (next !== src) {
    fs.writeFileSync(f, next, "utf8");
    changed++;
  }
}
console.log(`Updated ${changed} file(s).`);
JS

# ---- 6) Ensure tiny dev deps and npm scripts ----
echo "==> Ensuring dev dependencies & npm scripts"

# Add minimal deps if missing (best-effort, quiet)
has_dep () { node -e "require('./package.json');" >/dev/null 2>&1 && node -e "process.exit(require('./package.json').devDependencies && Object.prototype.hasOwnProperty.call(require('./package.json').devDependencies,'$1') ? 0 : 1)" || return 1; }

if ! has_dep typescript; then npm i -D typescript >/dev/null 2>&1 || true; fi
if ! has_dep "@types/node"; then npm i -D @types/node >/dev/null 2>&1 || true; fi
if ! has_dep rimraf; then npm i -D rimraf >/dev/null 2>&1 || true; fi
if ! has_dep "@vitejs/plugin-react"; then npm i -D @vitejs/plugin-react >/dev/null 2>&1 || true; fi

# Set scripts via npm pkg set (no jq required)
npm pkg set scripts.check:types="tsc --noEmit -p tsconfig.json" >/dev/null
npm pkg set scripts.clean:vite="rimraf node_modules/.vite .tsbuildinfo || true" >/dev/null
npm pkg set scripts.fix:altrec="node scripts/fix-altrec-imports.mjs && npm run clean:vite" >/dev/null

# ---- 7) Run codemod + typecheck ----
echo "==> Running import codemod"
npm run -s fix:altrec || true

echo "==> Type checking"
npm run -s check:types || true

# ---- 8) Grep acceptance checks (best-effort) ----
echo "==> Acceptance checks (best-effort)"
if [ -d src ]; then
  ALTREC_DEFS=$(grep -R -nE '(^|\s)(type|interface)\s+AltRec\b' src | wc -l | tr -d ' ')
  echo "  • AltRec definition sites in src: $ALTREC_DEFS"
  NONSTANDARD=$(grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || true)
  if [[ -z "$NONSTANDARD" ]]; then
    echo "  • AltRec imports standardized."
  else
    echo "  • Found non-standard AltRec imports:"
    echo "$NONSTANDARD"
  fi
else
  echo "  • Skipped grep checks (no src/ directory)."
fi

echo "==> Done."
echo "Next steps:"
echo "  1) In VS Code: Command Palette → 'TypeScript: Restart TS Server'."
echo "  2) Close extra VS Code windows on this repo."
echo "  3) Run your dev server and observe (flicker should stop)."
mkdir -p tools && cat > tools/regen-altrecs.sh <<'BASH' && bash tools/regen-altrecs.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> Regen AltRecs + canonical type (with backups)"

ROOT="$(pwd)"
TS_DIR="$ROOT/src/types"
UI_DIR="$ROOT/src/components/ui"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$ROOT/backups/regen-altrecs-$STAMP"

backup() {
  local f="$1"
  if [[ -f "$f" ]]; then
    mkdir -p "$(dirname "$BACKUP/$f")"
    cp -f "$f" "$BACKUP/$f"
    echo "  • backed up $f -> $BACKUP/$f"
  fi
}

mkdir -p "$TS_DIR" "$UI_DIR" "$BACKUP"

# 1) Disable export script if present (prevents flicker)
if [[ -f "$TS_DIR/export-type.sh" ]]; then
  backup "$TS_DIR/export-type.sh"
  mv -f "$TS_DIR/export-type.sh" "$TS_DIR/export-type.disabled.$STAMP.sh"
  chmod -x "$TS_DIR"/export-type.disabled.*.sh || true
  echo "  • disabled src/types/export-type.sh"
fi

# 2) Write canonical type
ALTREC_TS="$TS_DIR/altrec.ts"
backup "$ALTREC_TS"
cat > "$ALTREC_TS" <<'TS'
export interface AltRec {
  id: string;
  name: string;

  // grouping
  category: string;
  subtype?: string;

  // core metrics
  lis: number;
  ris: number;
  cpi?: number;

  // optional deltas
  deltaLIS?: number | null;
  deltaRIS?: number | null;
  deltaCPI?: number | null;
}
TS
echo "  • wrote $ALTREC_TS"

# 3) Ensure index barrel re-exports altrec
INDEX_TS="$TS_DIR/index.ts"
if [[ -f "$INDEX_TS" ]]; then
  backup "$INDEX_TS"
  if ! grep -q 'export \* from "./altrec";' "$INDEX_TS"; then
    echo 'export * from "./altrec";' >> "$INDEX_TS"
    echo "  • appended export to $INDEX_TS"
  else
    echo "  • $INDEX_TS already re-exports altrec"
  fi
else
  echo 'export * from "./altrec";' > "$INDEX_TS"
  echo "  • created $INDEX_TS"
fi

# 4) Components: AltRecs.tsx
ALTRECS_TSX="$UI_DIR/AltRecs.tsx"
backup "$ALTRECS_TSX"
cat > "$ALTRECS_TSX" <<'TSX'
import type { AltRec } from "@/types/altrec";

export type AltRecsProps = {
  recs: AltRec[];
  showDeltas?: boolean;
};

function fmtDelta(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : "—";
}

export default function AltRecs({ recs, showDeltas = true }: AltRecsProps) {
  // guarantee an array (avoid .map on string)
  const rows: AltRec[] = Array.isArray(recs) ? recs : [];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2 font-semibold text-sm">
        <div>Name</div>
        <div>Category</div>
        <div className="text-right">Δ LIS</div>
        <div className="text-right">Δ RIS</div>
        <div className="text-right">Δ CPI</div>
      </div>

      {rows.map((rec: AltRec, idx: number) => (
        <div key={rec.id ?? idx} className="grid grid-cols-5 gap-2 text-sm">
          <div>{rec.name}</div>
          <div>{rec.category}</div>
          {showDeltas ? (
            <>
              <div className="text-right">{fmtDelta(rec.deltaLIS)}</div>
              <div className="text-right">{fmtDelta(rec.deltaRIS)}</div>
              <div className="text-right">{fmtDelta(rec.deltaCPI)}</div>
            </>
          ) : (
            <>
              <div className="text-right">—</div>
              <div className="text-right">—</div>
              <div className="text-right">—</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
TSX
echo "  • wrote $ALTRECS_TSX"

# 5) Components: AltRecsPanel.tsx
PANEL_TSX="$UI_DIR/AltRecsPanel.tsx"
backup "$PANEL_TSX"
cat > "$PANEL_TSX" <<'TSX'
import type { AltRec } from "@/types/altrec";
import AltRecs from "./AltRecs";

export type AltRecsPanelProps = {
  title?: string;
  recs: AltRec[];
};

export default function AltRecsPanel({ title = "Alternatives", recs }: AltRecsPanelProps) {
  const safe: AltRec[] = Array.isArray(recs) ? recs : [];
  const sorted = [...safe].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <AltRecs recs={sorted} showDeltas />
    </section>
  );
}
TSX
echo "  • wrote $PANEL_TSX"

# 6) Optional: quick typecheck if tsc exists
if command -v npx >/dev/null 2>&1; then
  echo "==> Running typecheck (best-effort)"
  npx -y tsc --noEmit -p tsconfig.json || true
fi

echo "==> Done."
echo "Next:"
echo "  • Restart VS Code TS Server (Cmd/Ctrl-Shift-P → 'TypeScript: Restart TS Server')."
echo "  • Ensure consumers pass an AltRec[] into <AltRecsPanel recs={...} />"
echo "  • If any old code still does 'category.map(...)', change to 'recs.map(...)'."
BASH

grep -R -nE 'category\.map\s*\(' src || true

mkdir -p tools && cat > tools/verify-ts-health.sh <<'BASH' && bash tools/verify-ts-health.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> TS health check"

echo "--- AltRec interface definitions (should be 1: src/types/altrec.ts) ---"
COUNT=$(grep -R -nE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src | wc -l | tr -d ' ')
grep -R -nE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src || true
echo "AltRec definitions found: $COUNT"

echo
echo "--- Non-standard AltRec imports (should be none) ---"
grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || echo "OK"

echo
echo "--- .map being called on likely strings (should be none) ---"
grep -R -nE 'category\.map\s*\(|name\.map\s*\(|subtype\.map\s*\(' src || echo "OK"

echo
echo "--- Any lingering export-type scripts (should be none) ---"
ls -1 src/types 2>/dev/null | grep -E '^export-type(\.sh)?$' && echo "WARNING: remove or disable this" || echo "OK"

echo
echo "--- vite-env.d.ts (should live at repo root or src/, not src/types/) ---"
test -f ./vite-env.d.ts && echo "vite-env.d.ts at repo root: OK" || echo "No root vite-env.d.ts (that’s fi
mkdir -p tools && cat > tools/force-dedupe-altrec.sh <<'BASH' && bash tools/force-dedupe-altrec.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> Force-dedupe AltRec in src/types (keep only src/types/altrec.ts)"

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="backups/force-dedupe-altrec-$STAMP"
mkdir -p "$BACKUP"

mapfile -t FILES < <(grep -R -lE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src/types 2>/dev/null | grep -v 'src/types/altrec.ts' || true)

if (( ${#FILES[@]} == 0 )); then
  echo "No duplicates in src/types — nothing to do."
  exit 0
fi

for f in "${FILES[@]}"; do
  echo "  • backing up and replacing: $f"
  mkdir -p "$BACKUP/$(dirname "$f")"
  cp -f "$f" "$BACKUP/$f"
  cat > "$f" <<'TS'
// Replaced by canonical re-export to avoid AltRec duplication.
// Original file backed up under backups/.
export type { AltRec } from "@/types/altrec";
TS
done

echo "==> Done. Run a typecheck next."
npx -y tsc --noEmit -p tsconfig.json || true
BASH
mkdir -p tools && cat > tools/ts-doctor.sh <<'BASH' && bash tools/ts-doctor.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> TypeScript Doctor (verify + fix AltRecs + cleanups)"
ROOT="$(pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$ROOT/backups/ts-doctor-$STAMP"
mkdir -p "$BACKUP"

say(){ printf "  • %s\n" "$*"; }
bk(){ [[ -f "$1" ]] && { mkdir -p "$BACKUP/$(dirname "$1")"; cp -f "$1" "$BACKUP/$1"; say "backup $1"; } || true; }
mv_out(){ [[ -f "$1" ]] && { mkdir -p "$BACKUP/$(dirname "$1")"; mv -f "$1" "$BACKUP/$1"; say "moved $1 out of src"; } || true; }

if [[ ! -f package.json ]]; then
  echo "ERROR: Run this from the repo root (where package.json lives)."
  exit 1
fi

[[ -d src ]] || { echo "ERROR: No src/ dir found here."; exit 1; }

TS_DIR="src/types"
UI_DIR="src/components/ui"
CMP_DIR="src/components"
mkdir -p "$TS_DIR" "$UI_DIR"

echo "==> Disable flicker script if present"
if [[ -f "$TS_DIR/export-type.sh" ]]; then
  bk "$TS_DIR/export-type.sh"
  mv -f "$TS_DIR/export-type.sh" "$TS_DIR/export-type.disabled.$STAMP.sh"
  chmod -x "$TS_DIR"/export-type.disabled.*.sh || true
  say "disabled src/types/export-type.sh"
fi

echo "==> Canonical AltRec type (adds score/confidence + deltas)"
bk "$TS_DIR/altrec.ts"
cat > "$TS_DIR/altrec.ts" <<'TS'
export interface AltRec {
  id: string;
  name: string;

  // grouping
  category: string;
  subtype?: string;

  // core metrics
  lis: number;
  ris: number;
  cpi?: number;

  // ranking/meta
  score?: number | null;
  confidence?: number | null;

  // deltas
  deltaLIS?: number | null;
  deltaRIS?: number | null;
  deltaCPI?: number | null;
}
TS
say "wrote src/types/altrec.ts"

bk "$TS_DIR/index.ts"
echo 'export * from "./altrec";' > "$TS_DIR/index.ts"
say "ensured src/types/index.ts re-exports altrec"

echo "==> Canonical UI components"
bk "$UI_DIR/AltRecs.tsx"
cat > "$UI_DIR/AltRecs.tsx" <<'TSX'
import type { AltRec } from "@/types/altrec";

export type AltRecsProps = { recs: AltRec[]; showDeltas?: boolean; };

function fmtDelta(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : "—";
}

export default function AltRecs({ recs, showDeltas = true }: AltRecsProps) {
  const rows: AltRec[] = Array.isArray(recs) ? recs : [];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2 font-semibold text-sm">
        <div>Name</div><div>Category</div>
        <div className="text-right">Score</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Δ LIS</div>
        <div className="text-right">Δ RIS</div>
      </div>
      {rows.map((rec: AltRec, idx: number) => (
        <div key={rec.id ?? idx} className="grid grid-cols-6 gap-2 text-sm">
          <div>{rec.name}</div>
          <div>{rec.category}</div>
          <div className="text-right">{rec.score ?? "—"}</div>
          <div className="text-right">{rec.confidence ?? "—"}</div>
          <div className="text-right">{fmtDelta(rec.deltaLIS)}</div>
          <div className="text-right">{fmtDelta(rec.deltaRIS)}</div>
        </div>
      ))}
    </div>
  );
}
TSX

bk "$UI_DIR/AltRecsPanel.tsx"
cat > "$UI_DIR/AltRecsPanel.tsx" <<'TSX'
import type { AltRec } from "@/types/altrec";
import AltRecs from "./AltRecs";

export type AltRecsPanelProps = { title?: string; recs: AltRec[]; };

export default function AltRecsPanel({ title = "Alternatives", recs }: AltRecsPanelProps) {
  const safe: AltRec[] = Array.isArray(recs) ? recs : [];
  const sorted = [...safe].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <AltRecs recs={sorted} showDeltas />
    </section>
  );
}
TSX
say "wrote ui components"

echo "==> Stub any old components to re-export UI versions"
for f in "$CMP_DIR/AltRecs.tsx" "$CMP_DIR/AltRecsPanel.tsx"; do
  if [[ -f "$f" ]]; then
    bk "$f"
    cat > "$f" <<'TSX'
export { default } from "./ui/AltRecs";
export * from "./ui/AltRecs";
TSX
    [[ "$f" == *Panel.tsx ]] && sed -i 's/AltRecs"/AltRecsPanel"/g' "$f" || true
    say "stubbed $(basename "$f")"
  fi
done

echo "==> Move stray vite-env.d.ts and *.bak out of src"
[[ -f src/types/vite-env.d.ts && ! -f ./vite-env.d.ts ]] && { bk src/types/vite-env.d.ts; mv src/types/vite-env.d.ts ./vite-env.d.ts; say "moved vite-env.d.ts to repo root"; } || true
find src -type f \( -name "*.bak" -o -name "*.bak.*" \) -print0 2>/dev/null | while IFS= read -r -d '' f; do mv_out "$f"; done

echo "==> De-duplicate AltRec definitions inside src/types (keep only src/types/altrec.ts)"
mapfile -t DUPS < <(grep -R -lE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src/types 2>/dev/null | grep -v 'src/types/altrec.ts' || true)
for f in "${DUPS[@]}"; do
  bk "$f"
  cat > "$f" <<'TS'
// Replaced to avoid AltRec duplication.
export type { AltRec } from "@/types/altrec";
TS
  say "neutralized duplicate: $f"
done

echo "==> Scan for .map() on strings (should be none)"
grep -R -nE '(^|[^A-Za-z0-9_])category\.map\s*\(|(^|[^A-Za-z0-9_])name\.map\s*\(|(^|[^A-Za-z0-9_])subtype\.map\s*\(' src || echo "  OK"

echo "==> Non-standard AltRec imports (should be none)"
grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || echo "  OK"

echo "==> Quick typecheck (best-effort)"
npx -y tsc --noEmit -p tsconfig.json || true

echo "==> Done. Now in VS Code:"
echo "   - Ctrl/Cmd+Shift+P → TypeScript: Restart TS Server"
echo "   - Ensure you import from '@/components/ui/AltRecsPanel' in the UI"
BASH
grep -R -nE 'category\.map\s*\(|name\.map\s*\(|subtype\.map\s*\(' src

npm run check:types
# 0) safety backup
STAMP=$(date +%Y%m%d-%H%M%S); mkdir -p "backups/hard-fix-$STAMP"

# 1) Disable the flicker script if it still exists
if [ -f src/types/export-type.sh ]; then
  mv -f src/types/export-type.sh "backups/hard-fix-$STAMP/export-type.sh.disabled"
  echo "disabled src/types/export-type.sh"
fi

# 2) Canonical AltRec type (adds score/confidence + deltas)
mkdir -p src/types
cp -f src/types/altrec.ts "backups/hard-fix-$STAMP/altrec.ts" 2>/dev/null || true
cat > src/types/altrec.ts <<'TS'
export interface AltRec {
  id: string;
  name: string;

  // grouping
  category: string;
  subtype?: string;

  // core metrics
  lis: number;
  ris: number;
  cpi?: number;

  // ranking/meta
  score?: number | null;
  confidence?: number | null;

  // deltas
  deltaLIS?: number | null;
  deltaRIS?: number | null;
  deltaCPI?: number | null;
}
TS
echo 'export * from "./altrec";' > src/types/index.ts

# 3) Force stub any OLD components that conflict
mkdir -p src/components/ui
# ui versions (authoritative)
cat > src/components/ui/AltRecs.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";

export type AltRecsProps = { recs: AltRec[]; showDeltas?: boolean; };

function fmtDelta(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : "—";
}

export default function AltRecs({ recs, showDeltas = true }: AltRecsProps) {
  const rows: AltRec[] = Array.isArray(recs) ? recs : [];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2 font-semibold text-sm">
        <div>Name</div><div>Category</div>
        <div className="text-right">Score</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Δ LIS</div>
        <div className="text-right">Δ RIS</div>
      </div>
      {rows.map((rec: AltRec, idx: number) => (
        <div key={rec.id ?? idx} className="grid grid-cols-6 gap-2 text-sm">
          <div>{rec.name}</div>
          <div>{rec.category}</div>
          <div className="text-right">{rec.score ?? "—"}</div>
          <div className="text-right">{rec.confidence ?? "—"}</div>
          <div className="text-right">{fmtDelta(rec.deltaLIS)}</div>
          <div className="text-right">{fmtDelta(rec.deltaRIS)}</div>
        </div>
      ))}
    </div>
  );
}
TSX

cat > src/components/ui/AltRecsPanel.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";
import AltRecs from "./AltRecs";

export type AltRecsPanelProps = { title?: string; recs: AltRec[]; };

export default function AltRecsPanel({ title = "Alternatives", recs }: AltRecsPanelProps) {
  const safe: AltRec[] = Array.isArray(recs) ? recs : [];
  const sorted = [...safe].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <AltRecs recs={sorted} showDeltas />
    </section>
  );
}
TSX

# root-level stubs so any old imports compile
if [ -f src/components/AltRecs.tsx ]; then
  cp -f src/components/AltRecs.tsx "backups/hard-fix-$STAMP/AltRecs.tsx"
fi
cat > src/components/AltRecs.tsx <<'TSX'
export { default } from "./ui/AltRecs";
export * from "./ui/AltRecs";
TSX

if [ -f src/components/AltRecsPanel.tsx ]; then
  cp -f src/components/AltRecsPanel.tsx "backups/hard-fix-$STAMP/AltRecsPanel.tsx"
fi
cat > src/components/AltRecsPanel.tsx <<'TSX'
export { default } from "./ui/AltRecsPanel";
export * from "./ui/AltRecsPanel";
TSX

# 4) Neutralize any duplicate AltRec types under src/types (keep only src/types/altrec.ts)
while IFS= read -r f; do
  [ "$f" = "src/types/altrec.ts" ] && continue
  cp -f "$f" "backups/hard-fix-$STAMP/$(echo "$f")"
  cat > "$f" <<'TS'
// Replaced to avoid AltRec duplication.
export type { AltRec } from "@/types/altrec";
TS
done < <(grep -R -lE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src/types 2>/dev/null || true)

# 5) Purge caches
rm -rf node_modules/.vite .tsbuildinfo 2>/dev/null || true

# 6) Quick diagnostics
echo "----- DIAGNOSTICS -----"
echo "[AltRec definitions]"
grep -R -nE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src || echo "OK (only in src/types/altrec.ts)"

echo "[.map on strings]"
grep -R -nE 'category\.map\s*\(|name\.map\s*\(|subtype\.map\s*\(' src || echo "OK"

echo "[Non-standard AltRec imports]"
grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || echo "OK"

echo "------------------------"
npx -y tsc --noEmit -p tsconfig.json || true
echo "Done. Now restart VS Code TS server."
# 1) There should be NO active export script left:
ls -l src/types | grep export-type || echo "ok: no export-type script"

# 2) No .bak/.tmp inside src (tsserver will scan them):
find src -type f \( -name "*.bak" -o -name "*.bak.*" -o -name "*.tmp" \) -print || echo "ok: no bak/tmp"

# 3) Exactly one AltRec interface (the canonical one):
grep -R -nE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src

# 4) No .map() on strings (category/name/subtype are strings):
grep -R -nE 'category\.map\(|name\.map\(|subtype\.map\(' src || echo "ok: no bad .map"

# 5) Optional: typecheck
npm run check:types
mkdir -p .git/hooks && cat > .git/hooks/pre-commit <<'SH' && chmod +x .git/hooks/pre-commit
#!/usr/bin/env bash
set -euo pipefail
BAD=$(git diff --cached --name-only | grep -E '^src/.*(\.bak(\.|$)|\.tmp$|export-type.*\.sh$)' || true)
if [ -n "$BAD" ]; then
  echo "❌ Blocked commit: these don't belong in src/:"
  echo "$BAD"
  exit 1
fi
SH
mkdir -p .git/hooks && cat > .git/hooks/pre-commit <<'SH' && chmod +x .git/hooks/pre-commit
#!/usr/bin/env bash
set -euo pipefail
BAD=$(git diff --cached --name-only | grep -E '^src/.*(\.bak(\.|$)|\.tmp$|export-type.*\.sh$)' || true)
if [ -n "$BAD" ]; then
  echo "❌ Blocked commit: these don't belong in src/:"
  echo "$BAD"
  exit 1
fi
SH
# exactly one AltRec interface
grep -R -nE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src

# no .map on string fields
grep -R -nE 'category\.map\(|name\.map\(|subtype\.map\(' src || echo "OK"

# no shell scripts / junk in src
find src -type f \( -name "export-type*.sh" -o -name "*.bak" -o -name "*.bak.*" -o -name "*.tmp" \) -print || echo "OK"

mkdir -p tools && cat > tools/final-stabilize.sh <<'BASH' && bash tools/final-stabilize.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> Final stabilize (quarantine shell, exclude tools/, canonical types, caches)"

ROOT="$(pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
BK="backups/final-stabilize-$STAMP"
mkdir -p "$BK" "src/types" "src/components/ui" ".vscode"

bk(){ [[ -f "$1" ]] && { mkdir -p "$BK/$(dirname "$1")"; cp -f "$1" "$BK/$1"; echo "  • backup $1"; } || true; }
mv_out(){ [[ -f "$1" ]] && { mkdir -p "$BK/$(dirname "$1")"; mv -f "$1" "$BK/$1"; echo "  • quarantined $1 -> $BK/$1"; } || true; }

# 0) VS Code settings: pin workspace TS + exclude tools/
bk .vscode/settings.json
cat > .vscode/settings.json <<'JSON'
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsserver.useSeparateSyntaxServer": false,
  "typescript.tsserver.watchOptions": {
    "watchFile": "useFsEventsOnParentDirectory",
    "watchDirectory": "useFsEvents"
  },
  "typescript.disableAutomaticTypeAcquisition": true,
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "files.watcherExclude": {
    "**/.git/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.vite/**": true,
    "**/.vercel/**": true,
    "**/.cache/**": true,
    "**/backups/**": true,
    "**/scripts/**": true,
    "**/tools/**": true,
    "**/*.bak": true,
    "**/*.tmp": true
  },
  "search.exclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.vite/**": true,
    "**/.vercel/**": true,
    "**/backups/**": true,
    "**/scripts/**": true,
    "**/tools/**": true,
    "**/*.bak": true,
    "**/*.tmp": true
  }
}
JSON
echo "  • wrote .vscode/settings.json"

# 1) tsconfig: exclude tools/ + junk
bk tsconfig.json
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vite/client", "node"]
  },
  "include": ["src", "vite-env.d.ts"],
  "exclude": [
    "node_modules",
    "dist",
    ".vite",
    ".vercel",
    "backups",
    "scripts",
    "tools",
    "**/*.bak",
    "**/*.bak.*",
    "**/*.tmp",
    "**/*.sh"
  ]
}
JSON
echo "  • wrote tsconfig.json"

# 2) quarantine shell scripts and backups inside src/
while IFS= read -r -d '' f; do mv_out "$f"; done < <(find src -type f -name "export-type*.sh" -print0 2>/dev/null || true)
while IFS= read -r -d '' f; do mv_out "$f"; done < <(find src -type f \( -name "*.bak" -o -name "*.bak.*" -o -name "*.tmp" \) -print0 2>/dev/null || true)

# 3) canonical AltRec type + barrel
bk src/types/altrec.ts
cat > src/types/altrec.ts <<'TS'
export interface AltRec {
  id: string;
  name: string;
  category: string;
  subtype?: string;
  lis: number;
  ris: number;
  cpi?: number;
  score?: number | null;
  confidence?: number | null;
  deltaLIS?: number | null;
  deltaRIS?: number | null;
  deltaCPI?: number | null;
}
TS
echo 'export * from "./altrec";' > src/types/index.ts

# 4) canonical UI components + stubs
bk src/components/ui/AltRecs.tsx
cat > src/components/ui/AltRecs.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";
export type AltRecsProps = { recs: AltRec[]; showDeltas?: boolean };
function fmtDelta(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const n = Number(v); return Number.isFinite(n) ? n.toFixed(2) : "—";
}
export default function AltRecs({ recs, showDeltas = true }: AltRecsProps) {
  const rows = Array.isArray(recs) ? recs : [];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2 font-semibold text-sm">
        <div>Name</div><div>Category</div>
        <div className="text-right">Score</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Δ LIS</div>
        <div className="text-right">Δ RIS</div>
      </div>
      {rows.map((rec, idx) => (
        <div key={rec.id ?? idx} className="grid grid-cols-6 gap-2 text-sm">
          <div>{rec.name}</div>
          <div>{rec.category}</div>
          <div className="text-right">{rec.score ?? "—"}</div>
          <div className="text-right">{rec.confidence ?? "—"}</div>
          <div className="text-right">{fmtDelta(rec.deltaLIS)}</div>
          <div className="text-right">{fmtDelta(rec.deltaRIS)}</div>
        </div>
      ))}
    </div>
  );
}
TSX

bk src/components/ui/AltRecsPanel.tsx
cat > src/components/ui/AltRecsPanel.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";
import AltRecs from "./AltRecs";
export type AltRecsPanelProps = { title?: string; recs: AltRec[] };
export default function AltRecsPanel({ title = "Alternatives", recs }: AltRecsPanelProps) {
  const safe: AltRec[] = Array.isArray(recs) ? recs : [];
  const sorted = [...safe].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <AltRecs recs={sorted} showDeltas />
    </section>
  );
}
TSX

# stubs so any old imports compile
cat > src/components/AltRecs.tsx <<'TSX'
export { default } from "./ui/AltRecs";
export * from "./ui/AltRecs";
TSX
cat > src/components/AltRecsPanel.tsx <<'TSX'
export { default } from "./ui/AltRecsPanel";
export * from "./ui/AltRecsPanel";
TSX

# 5) neutralize duplicate AltRec types in src/types (keep only src/types/altrec.ts)
while IFS= read -r f; do
  [[ "$f" == "src/types/altrec.ts" ]] && continue
  bk "$f"
  cat > "$f" <<'TS'
// Replaced to avoid AltRec duplication.
exp
mkdir -p tools && cat > tools/final-stabilize.sh <<'BASH' && bash tools/final-stabilize.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> Final stabilize (quarantine shell, exclude tools/, canonical types, caches)"

ROOT="$(pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
BK="backups/final-stabilize-$STAMP"
mkdir -p "$BK" "src/types" "src/components/ui" ".vscode"

bk(){ [[ -f "$1" ]] && { mkdir -p "$BK/$(dirname "$1")"; cp -f "$1" "$BK/$1"; echo "  • backup $1"; } || true; }
mv_out(){ [[ -f "$1" ]] && { mkdir -p "$BK/$(dirname "$1")"; mv -f "$1" "$BK/$1"; echo "  • quarantined $1 -> $BK/$1"; } || true; }

# 0) VS Code settings: pin workspace TS + exclude tools/
bk .vscode/settings.json
cat > .vscode/settings.json <<'JSON'
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsserver.useSeparateSyntaxServer": false,
  "typescript.tsserver.watchOptions": {
    "watchFile": "useFsEventsOnParentDirectory",
    "watchDirectory": "useFsEvents"
  },
  "typescript.disableAutomaticTypeAcquisition": true,
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "files.watcherExclude": {
    "**/.git/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.vite/**": true,
    "**/.vercel/**": true,
    "**/.cache/**": true,
    "**/backups/**": true,
    "**/scripts/**": true,
    "**/tools/**": true,
    "**/*.bak": true,
    "**/*.tmp": true
  },
  "search.exclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.vite/**": true,
    "**/.vercel/**": true,
    "**/backups/**": true,
    "**/scripts/**": true,
    "**/tools/**": true,
    "**/*.bak": true,
    "**/*.tmp": true
  }
}
JSON
echo "  • wrote .vscode/settings.json"

# 1) tsconfig: exclude tools/ + junk
bk tsconfig.json
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vite/client", "node"]
  },
  "include": ["src", "vite-env.d.ts"],
  "exclude": [
    "node_modules",
    "dist",
    ".vite",
    ".vercel",
    "backups",
    "scripts",
    "tools",
    "**/*.bak",
    "**/*.bak.*",
    "**/*.tmp",
    "**/*.sh"
  ]
}
JSON
echo "  • wrote tsconfig.json"

# 2) quarantine shell scripts and backups inside src/
while IFS= read -r -d '' f; do mv_out "$f"; done < <(find src -type f -name "export-type*.sh" -print0 2>/dev/null || true)
while IFS= read -r -d '' f; do mv_out "$f"; done < <(find src -type f \( -name "*.bak" -o -name "*.bak.*" -o -name "*.tmp" \) -print0 2>/dev/null || true)

# 3) canonical AltRec type + barrel
bk src/types/altrec.ts
cat > src/types/altrec.ts <<'TS'
export interface AltRec {
  id: string;
  name: string;
  category: string;
  subtype?: string;
  lis: number;
  ris: number;
  cpi?: number;
  score?: number | null;
  confidence?: number | null;
  deltaLIS?: number | null;
  deltaRIS?: number | null;
  deltaCPI?: number | null;
}
TS
echo 'export * from "./altrec";' > src/types/index.ts

# 4) canonical UI components + stubs
bk src/components/ui/AltRecs.tsx
cat > src/components/ui/AltRecs.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";
export type AltRecsProps = { recs: AltRec[]; showDeltas?: boolean };
function fmtDelta(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const n = Number(v); return Number.isFinite(n) ? n.toFixed(2) : "—";
}
export default function AltRecs({ recs, showDeltas = true }: AltRecsProps) {
  const rows = Array.isArray(recs) ? recs : [];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2 font-semibold text-sm">
        <div>Name</div><div>Category</div>
        <div className="text-right">Score</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Δ LIS</div>
        <div className="text-right">Δ RIS</div>
      </div>
      {rows.map((rec, idx) => (
        <div key={rec.id ?? idx} className="grid grid-cols-6 gap-2 text-sm">
          <div>{rec.name}</div>
          <div>{rec.category}</div>
          <div className="text-right">{rec.score ?? "—"}</div>
          <div className="text-right">{rec.confidence ?? "—"}</div>
          <div className="text-right">{fmtDelta(rec.deltaLIS)}</div>
          <div className="text-right">{fmtDelta(rec.deltaRIS)}</div>
        </div>
      ))}
    </div>
  );
}
TSX

bk src/components/ui/AltRecsPanel.tsx
cat > src/components/ui/AltRecsPanel.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";
import AltRecs from "./AltRecs";
export type AltRecsPanelProps = { title?: string; recs: AltRec[] };
export default function AltRecsPanel({ title = "Alternatives", recs }: AltRecsPanelProps) {
  const safe: AltRec[] = Array.isArray(recs) ? recs : [];
  const sorted = [...safe].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <AltRecs recs={sorted} showDeltas />
    </section>
  );
}
TSX

# stubs so any old imports compile
cat > src/components/AltRecs.tsx <<'TSX'
export { default } from "./ui/AltRecs";
export * from "./ui/AltRecs";
TSX
cat > src/components/AltRecsPanel.tsx <<'TSX'
export { default } from "./ui/AltRecsPanel";
export * from "./ui/AltRecsPanel";
TSX

# 5) neutralize duplicate AltRec types in src/types (keep only src/types/altrec.ts)
while IFS= read -r f; do
  [[ "$f" == "src/types/altrec.ts" ]] && continue
  bk "$f"
  cat > "$f" <<'TS'
// Replaced to avoid AltRec duplication.
export type { AltRec } from "@/types/altrec";
TS
done < <(grep -R -lE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src/types 2>/dev/null || true)

# 6) clear caches
rm -rf node_modules/.vite .tsbuildinfo 2>/dev/null || true

# 7) health report
echo "----- HEALTH REPORT -----"
echo "[AltRec interface definitions]"
grep -R -nE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src || echo "OK (only in src/types/altrec.ts)"
echo "[.map() on string fields]"
grep -R -nE '(^|[^A-Za-z0-9_])category\.map\s*\(|(^|[^A-Za-z0-9_])name\.map\s*\(|(^|[^A-Za-z0-9_])subtype\.map\s*\(' src || echo "OK"
echo "[Non-standard AltRec imports]"
grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || echo "OK"
echo "-------------------------"
npx -y tsc --noEmit -p tsconfig.json || true
echo "==> Done. In VS Code: Ctrl/Cmd+Shift+P → 'TypeScript: Restart TS Server'."
BASH

mkdir -p tools && cat > tools/finish-line.sh <<'BASH' && bash tools/finish-line.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> Finish Line: analyze the last TS errors and prep fixes"

# 0) fresh typecheck output (plain)
npx -y tsc --noEmit --pretty false -p tsconfig.json > tools/ts-errors.txt || true

echo
echo "---- Error code summary (TSxxxx → count) ----"
awk '/error TS[0-9]+:/{for(i=1;i<=NF;i++) if($i ~ /TS[0-9]+:/){gsub(":","",$i); c[$i]++}} END{for(k in c) printf "%s %d\n", k, c[k] | "sort"}' tools/ts-errors.txt

echo
echo "---- Top files by error count ----"
awk -F: '/\.tsx?:[0-9]+:[0-9]+ - error TS[0-9]+:/{f[$1]++} END{for(k in f) printf "%4d  %s\n", f[k], k | "sort -nr | head -20"}' tools/ts-errors.txt

echo
echo "---- .map() on likely strings (category/name/subtype) ----"
grep -R -nE '(^|[^A-Za-z0-9_])(category|name|subtype)\.map\s*\(' src || echo "OK"

echo
echo "---- Non-standard AltRec imports (should be none) ----"
grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || echo "OK"

echo
echo "---- Places with implicit-any in map callbacks (TS7006 suspects) ----"
grep -R -nE '\.map\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)\s*=>' src | sed 's/^/  /' || echo "OK"

cat <<'NOTE'

============================================================
HOW TO FIX WHAT YOU SEE ABOVE (quick playbook)
============================================================

A) TS2339 “Property 'X' does not exist on type 'AltRec'”
   • If X is a real field you use, add it to src/types/altrec.ts as optional:
       X?: number | string | null;
   • If X is computed (e.g., rec.delta = a - b), compute it before render
     and don’t read an undeclared property.

B) “.map does not exist on type 'string'”
   • You’re mapping a string like rec.category.map(...).
     Change to iterate an array (e.g., recs.map(...)) or change the type
     to string[] if it really is an array.

C) TS7006 “Parameter implicitly has an 'any' type”
   • Add types to callback params:
       recs.map((rec: AltRec, idx: number) => ...)
   • The optional autofix below can add (:any, :number) to map callbacks
     inside src/components to unblock you now (safe, minimal).

D) Non-standard AltRec imports
   • Change any such imports to:
       import type { AltRec } from "@/types/altrec";

NOTE

# OPTIONAL: minimal autofix for implicit-any in .map() callbacks (components only)
read -r -p "Apply optional autofix for TS7006 on map callbacks in src/components? [y/N] " ans
if [[ "${ans:-N}" =~ ^[Yy]$ ]]; then
  node - <<'NODE'
const fs = require('fs'), path = require('path');
const root = 'src/components';
c
mkdir -p tools && cat > tools/finish-line.sh <<'BASH' && bash tools/finish-line.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> Finish Line: analyze the last TS errors and prep fixes"

# 0) fresh typecheck output (plain)
npx -y tsc --noEmit --pretty false -p tsconfig.json > tools/ts-errors.txt || true

echo
echo "---- Error code summary (TSxxxx → count) ----"
awk '/error TS[0-9]+:/{for(i=1;i<=NF;i++) if($i ~ /TS[0-9]+:/){gsub(":","",$i); c[$i]++}} END{for(k in c) printf "%s %d\n", k, c[k] | "sort"}' tools/ts-errors.txt

echo
echo "---- Top files by error count ----"
awk -F: '/\.tsx?:[0-9]+:[0-9]+ - error TS[0-9]+:/{f[$1]++} END{for(k in f) printf "%4d  %s\n", f[k], k | "sort -nr | head -20"}' tools/ts-errors.txt

echo
echo "---- .map() on likely strings (category/name/subtype) ----"
grep -R -nE '(^|[^A-Za-z0-9_])(category|name|subtype)\.map\s*\(' src || echo "OK"

echo
echo "---- Non-standard AltRec imports (should be none) ----"
grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || echo "OK"

echo
echo "---- Places with implicit-any in map callbacks (TS7006 suspects) ----"
grep -R -nE '\.map\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*,\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\)\s*=>' src | sed 's/^/  /' || echo "OK"

cat <<'NOTE'

============================================================
HOW TO FIX WHAT YOU SEE ABOVE (quick playbook)
============================================================

A) TS2339 “Property 'X' does not exist on type 'AltRec'”
   • If X is a real field you use, add it to src/types/altrec.ts as optional:
       X?: number | string | null;
   • If X is computed (e.g., rec.delta = a - b), compute it before render
     and don’t read an undeclared property.

B) “.map does not exist on type 'string'”
   • You’re mapping a string like rec.category.map(...).
     Change to iterate an array (e.g., recs.map(...)) or change the type
     to string[] if it really is an array.

C) TS7006 “Parameter implicitly has an 'any' type”
   • Add types to callback params:
       recs.map((rec: AltRec, idx: number) => ...)
   • The optional autofix below can add (:any, :number) to map callbacks
     inside src/components to unblock you now (safe, minimal).

D) Non-standard AltRec imports
   • Change any such imports to:
       import type { AltRec } from "@/types/altrec";

NOTE

# OPTIONAL: minimal autofix for implicit-any in .map() callbacks (components only)
read -r -p "Apply optional autofix for TS7006 on map callbacks in src/components? [y/N] " ans
if [[ "${ans:-N}" =~ ^[Yy]$ ]]; then
  node - <<'NODE'
const fs = require('fs'), path = require('path');
const root = 'src/components';
const exts = /\.(ts|tsx)$/;
const ignore = /(node_modules|dist|\.vite|backups|scripts|tools)(\/|$)/;

const files = [];
(function walk(d){
  if(!fs.existsSync(d)) return;
  for(const e of fs.readdirSync(d, {withFileTypes:true})){
    const p = path.join(d, e.name);
    if(e.isDirectory()){ if(!ignore.test(p)) walk(p); }
    else if(exts.test(e.name)) files.push(p);
  }
})(root);

// Turn `.map((x, y) =>` into `.map((x: any, y: number) =>` where x,y are bare identifiers.
// Keeps your logic; just adds types to satisfy TS7006.
const re = /\.map\s*\(\s*([A-Za-z_]\w*)\s*,\s*([A-Za-z_]\w*)\s*\)\s*=>/g;

let changed = 0;
for(const f of files){
  const src = fs.readFileSync(f,'utf8');
  const next = src.replace(re, (_, a, b) => `.map((${a}: any, ${b}: number) =>`);
  if(next !== src){ fs.writeFileSync(f, next); changed++; }
}
console.log(`TS7006 autofix touched ${changed} file(s).`);
NODE

  echo "Re-running typecheck..."
  npx -y tsc --noEmit --pretty false -p tsconfig.json > tools/ts-errors.txt || true
  awk '/error TS[0-9]+:/{for(i=1;i<=NF;i++) if($i ~ /TS[0-9]+:/){gsub(":","",$i); c[$i]++}} END{for(k in c) printf "%s %d\n", k, c[k] | "sort"}' tools/ts-errors.txt
fi

echo
echo "==> All set. If counts are still >0, fix the few lines the report points to, then:"
echo "    - VS Code: TypeScript: Restart TS Server"
echo "    - npm run check:types"
BASH
# AltRecs stub
cat > src/components/AltRecs.tsx <<'TSX'
export { default } from "./ui/AltRecs";
export * from "./ui/AltRecs";
TSX

# AltRecsPanel stub
cat > src/components/AltRecsPanel.tsx <<'TSX'
export { default } from "./ui/AltRecsPanel";
export * from "./ui/AltRecsPanel";
TSX

# sanity: should be 2 lines each
nl -ba src/components/AltRecs.tsx | sed -n '1,10p'
nl -ba src/components/AltRecsPanel.tsx | sed -n '1,10p'
ls -l src/components/ui/AltRecs*.tsx
npm run check:types

# Overwrite the old files with 2-line stubs
cat > src/components/AltRecs.tsx <<'TSX'
export { default } from "./ui/AltRecs";
export * from "./ui/AltRecs";
TSX

cat > src/components/AltRecsPanel.tsx <<'TSX'
export { default } from "./ui/AltRecsPanel";
export * from "./ui/AltRecsPanel";
TSX

# Show the first 20 lines so we can *see* they’re stubs
echo "==== AltRecs.tsx (should be 2 lines) ===="
nl -ba src/components/AltRecs.tsx | sed -n '1,20p'
echo "==== AltRecsPanel.tsx (should be 2 lines) ===="
nl -ba src/components/AltRecsPanel.tsx | sed -n '1,20p'
ls -l src/components/ui/AltRecs*.tsx
sed -n '1,120p' src/types/altrec.ts
score?: number | null;
confidence?: number | null;
deltaLIS?: number | null;
deltaRIS?: number | null;
deltaCPI?: number | null;
cat > src/types/altrec.ts <<'TS'
export interface AltRec {
  id: string;
  name: string;
  category: string;
  subtype?: string;
  lis: number;
  ris: number;
  cpi?: number;
  score?: number | null;
  confidence?: number | null;
  deltaLIS?: number | null;
  deltaRIS?: number | null;
  deltaCPI?: number | null;
}
TS

echo 'export * from "./altrec";' > src/types/index.ts
# Clear caches
rm -rf node_modules/.vite .tsbuildinfo 2>/dev/null || true

# No duplicate AltRec types anywhere
grep -R -nE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src || echo "OK"

# All AltRec imports come from the canonical path
grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || echo "OK"

# No .map on string fields (category/name/subtype)
grep -R -nE '(^|[^A-Za-z0-9_])(category|name|subtype)\.map\s*\(' src || echo "OK"
npm run check:types
mkdir -p tools && cat > tools/force-fix-altrecs.sh <<'BASH' && bash tools/force-fix-altrecs.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> Force-fix AltRecs + AltRec type"

STAMP="$(date +%Y%m%d-%H%M%S)"
BK="backups/force-fix-$STAMP"
mkdir -p "$BK" "src/components/ui" "src/types"

bk(){ [[ -f "$1" ]] && { mkdir -p "$BK/$(dirname "$1")"; cp -f "$1" "$BK/$1"; echo "  • backup $1"; } || true; }

# 1) Hard-overwrite the two old components with 2-line stubs
for F in src/components/AltRecs.tsx src/components/AltRecsPanel.tsx; do
  bk "$F"
done

cat > src/components/AltRecs.tsx <<'TSX'
export { default } from "./ui/AltRecs";
export * from "./ui/AltRecs";
TSX
cat > src/components/AltRecsPanel.tsx <<'TSX'
export { default } from "./ui/AltRecsPanel";
export * from "./ui/AltRecsPanel";
TSX
echo "  • stubbed component files"

# 2) Ensure clean UI components exist (create if missing)
if [[ ! -f src/components/ui/AltRecs.tsx ]]; then
  cat > src/components/ui/AltRecs.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";

export type AltRecsProps = { recs: AltRec[]; showDeltas?: boolean };

function fmtDelta(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : "—";
}

export default function AltRecs({ recs, showDeltas = true }: AltRecsProps) {
  const rows: AltRec[] = Array.isArray(recs) ? recs : [];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2 font-semibold text-sm">
        <div>Name</div><div>Category</div>
        <div className="text-right">Score</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Δ LIS</div>
        <div className="text-right">Δ RIS</div>
      </div>
      {rows.map((rec: AltRec, idx: number) => (
        <div key={rec.id ?? idx} className="grid grid-cols-6 gap-2 text-sm">
          <div>{rec.name}</div>
          <div>{rec.category}</div>
          <div className="text-right">{rec.score ?? "—"}</div>
          <div className="text-right">{rec.confidence ?? "—"}</div>
          <div className="text-right">{fmtDelta(rec.deltaLIS)}</div>
          <div className="text-right">{fmtDelta(rec.deltaRIS)}</div>
        </div>
      ))}
    </div>
  );
}
TSX
  echo "  • created ui/AltRecs.tsx"
fi

if [[ ! -f src/components/ui/AltRecsPanel.tsx ]]; then
  cat > src/components/ui/AltRecsPanel.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";
import AltRecs from "./AltRecs";

export type AltRecsPanelProps = { title?: string; recs: AltRec[] };

export default function AltRecsPanel({ title = "Alternatives", recs }: AltRecsPanelProps) {
  const safe: AltRec[] = Array.isArray(recs) ? recs : [];
  const sorted = [...safe].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <AltRecs recs={sorted} showDeltas />
    </section>
  );
}
TSX
  echo "  • created ui/AltRecsPanel.tsx"
fi

# 3) Canonical AltRec type (includes score/confidence + deltas)
bk src/types/altrec.ts
cat > src/types/altrec.ts <<'TS'
export interface AltRec {
  id: string;
  name: string;

  // grouping
  category: string;
  subtype?: string;

  // core metrics
  lis: number;
  ris: number;
  cpi?: number;

  // ranking/meta (optional)
  score?: number | null;
  confidence?: number | null;

  // deltas (optional)
  deltaLIS?: number | null;
  deltaRIS?: number | null;
  deltaCPI?: number | null;
}
TS
echo 'export * from "./altrec";' > src/types/index.ts
echo "  • wrote canonical type"

# 4) Neutralize duplicate AltRec declarations under src/types (keep only src/types/altrec.ts)
mapfile -t DUPS < <(grep -R -lE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src/types 2>/dev/null | grep -v 'src/types/altrec.ts' || true)
for f in "${DUPS[@]}"; do
  bk "$f"
  cat > "$f" <<'TS'
// Replaced to avoid AltRec duplication.
export type { AltRec } from "@/types/altrec";
TS
  echo "  • neutralized duplicate: $f"
done

# 5) Standardize AltRec imports to '@/types/altrec'
node - <<'NODE' || true
const fs=require('fs'), path=require('path');
const root='src', re=/from\s+["']([^"']*types(?:\/index)?\/?altrec|[^"']*types\/index)["'];?/g;
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
 if(e.isDirectory()){ if(/node_modules|dist|\.vite|\.vercel|backups|scripts|tools/.test(p)) continue; walk(p); }
 else if(/\.(ts|tsx)$/.test(e.name)){ const s=fs.readFileSync(p,'utf8'); const n=s.replace(re,'from "@/types/altrec"'); if(n!==s) fs.writeFileSync(p,n); } } }
if(fs.existsSync(root)) walk(root);
NODE
echo "  • standardized type imports"

# 6) Clear caches
rm -rf node_modules/.vite .tsbuildinfo 2>/dev/null || true

# 7) Health report
echo "----- HEALTH REPORT -----"
echo "[AltRecs.tsx stub preview]"
nl -ba src/components/AltRecs.tsx | sed -n '1,6p'
echo "[AltRecsPanel.tsx stub preview]"
nl -ba src/components/AltRecsPanel.tsx | sed -n '1,6p'
echo
echo "[AltRec interface definitions]"
grep -R -nE '(^|[[:space:]])(type|interface)[[:space:]]+AltRec\b' src || echo "OK (only src/types/altrec.ts)"
echo
echo "[Non-standard AltRec imports]"
grep -R -n "import.*AltRec.*from" src | grep -v '@/types/altrec' || echo "OK"
echo
echo "[.map on string fields]"
grep -R -nE '(^|[^A-Za-z0-9_])(category|name|subtype)\.map\s*\(' src || echo "OK"
echo "-------------------------"
npx -y tsc --noEmit -p tsconfig.json || true
echo "==> Done. Restart TS server in VS Code."
BASH
# 1) Move the old files out of the way so the editor can't silently restore them
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p backups/pin-stubs-$STAMP

[ -f src/components/AltRecs.tsx ] && mv -f src/components/AltRecs.tsx backups/pin-stubs-$STAMP/AltRecs.old.tsx
[ -f src/components/AltRecsPanel.tsx ] && mv -f src/components/AltRecsPanel.tsx backups/pin-stubs-$STAMP/AltRecsPanel.old.tsx

# 2) Create fresh 2-line stubs
cat > src/components/AltRecs.tsx <<'TSX'
export { default } from "./ui/AltRecs";
export * from "./ui/AltRecs";
TSX

cat > src/components/AltRecsPanel.tsx <<'TSX'
export { default } from "./ui/AltRecsPanel";
export * from "./ui/AltRecsPanel";
TSX

# 3) Ensure the clean UI components exist (create if missing)
mkdir -p src/components/ui

[ -f src/components/ui/AltRecs.tsx ] || cat > src/components/ui/AltRecs.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";

export type AltRecsProps = { recs: AltRec[]; showDeltas?: boolean };

function fmtDelta(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  const n = Number(v); return Number.isFinite(n) ? n.toFixed(2) : "—";
}

export default function AltRecs({ recs, showDeltas = true }: AltRecsProps) {
  const rows: AltRec[] = Array.isArray(recs) ? recs : [];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-2 font-semibold text-sm">
        <div>Name</div><div>Category</div>
        <div className="text-right">Score</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Δ LIS</div>
        <div className="text-right">Δ RIS</div>
      </div>
      {rows.map((rec: AltRec, idx: number) => (
        <div key={rec.id ?? idx} className="grid grid-cols-6 gap-2 text-sm">
          <div>{rec.name}</div>
          <div>{rec.category}</div>
          <div className="text-right">{rec.score ?? "—"}</div>
          <div className="text-right">{rec.confidence ?? "—"}</div>
          <div className="text-right">{fmtDelta(rec.deltaLIS)}</div>
          <div className="text-right">{fmtDelta(rec.deltaRIS)}</div>
        </div>
      ))}
    </div>
  );
}
TSX

[ -f src/components/ui/AltRecsPanel.tsx ] || cat > src/components/ui/AltRecsPanel.tsx <<'TSX'
import type { AltRec } from "@/types/altrec";
import AltRecs from "./AltRecs";

export type AltRecsPanelProps = { title?: string; recs: AltRec[] };

export default function AltRecsPanel({ title = "Alternatives", recs }: AltRecsPanelProps) {
  const safe: AltRec[] = Array.isArray(recs) ? recs : [];
  const sorted = [...safe].sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
  );
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <AltRecs recs={sorted} showDeltas />
    </section>
  );
}
TSX

# 4) Make sure the type DEFINITELY has 'score' (and friends)
mkdir -p src/types
cat > src/types/altrec.ts <<'TS'
export interface AltRec {
  id: string;
  name: string;
  category: string;
  subtype?: string;
  lis: number;
  ris: number;
  cpi?: number;
  score?: number | null;
  confidence?: number | null;
  deltaLIS?: number | null;
  deltaRIS?: number | null;
  deltaCPI?: number | null;
}
TS
echo 'export * from "./altrec";' > src/types/index.ts

# 5) Clear caches
rm -rf node_modules/.vite .tsbuildinfo 2>/dev/null || true

# 6) Show what VS Code should be compiling now (sanity print)
echo "----- STUB PREVIEW (should be 2 lines each) -----"
nl -ba src/components/AltRecs.tsx | sed -n '1,6p'
nl -ba src/components/AltRecsPanel.tsx | sed -n '1,6p'
echo "----- AltRec interface (should include 'score'/'confidence') -----"
sed -n '1,120p' src/types/altrec.ts
# bootstrap-blockplane-v2-clean.sh
set -euo pipefail

APP="blockplane-v2-clean"
echo "🚀 Creating $APP …"
mkdir -p "$APP"
cd "$APP"

echo "📦 Initializing package.json…"
npm init -y >/dev/null

echo "⬇️ Installing deps…"
npm i react react-dom
npm i -D typescript @types/react @types/react-dom vite @vitejs/plugin-react rimraf ts-node

echo "🧭 package.json scripts…"
node - <<'JS'
const fs=require('fs'); const p=JSON.parse(fs.readFileSync('package.json','utf8'));
p.type="module";
p.scripts={ dev:"vite", build:"vite build", preview:"vite preview", "check:types":"tsc --noEmit" };
fs.writeFileSync('package.json', JSON.stringify(p,null,2));
JS

echo "🗂️  Project skeleton…"
mkdir -p src/components src/types public .vscode

cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>BlockPlane v2 Clean</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTML

cat > src/main.tsx <<'TSX'
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const el = document.getElementById("root")!;
createRoot(el).render(<React.StrictMode><App /></React.StrictMode>);
TSX

cat > src/App.tsx <<'TSX'
import React, { useEffect, useMemo, useState } from "react";
import StatsHeader from "@/components/StatsHeader";
import AltRecsPanel from "@/components/AltRecsPanel";

export type Material = {
  id?: string;
  name: string;
  category: string;
  subtype: string;
  unit?: string;
  quantity?: number;
  lis?: number;
  ris?: number;
  cpi?: number;
  price?: number;
  lifespan?: number;
  carbonFootprint?: number;
  recyclability?: string;
  cost?: number;
};

async function loadMaterials(): Promise<Material[]> {
  const r = await fetch("/data/materials.json", { cache: "no-store" });
  return r.ok ? (await r.json()) as Material[] : [];
}

export default function App() {
  const [rows, setRows] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setRows(await loadMaterials()); }
      finally { setLoading(false); }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const avgLifespan = total ? rows.reduce((a,m)=>a+(m.lifespan??0),0)/total : 0;
    const byCat = new Map<string,number>();
    rows.forEach(m => byCat.set(m.category, (byCat.get(m.category)??0)+1));
    const topCategory = [...byCat.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0];
    // Simple sustainability proxy (lower carbon = higher score)
    const cf = rows.map(m=>m.carbonFootprint ?? 0);
    const min = Math.min(...cf, 0), max = Math.max(...cf, 1), span = Math.max(1, max-min);
    const sustainabilityScore = total ? 100 - Math.round(cf.reduce((a,x)=>a+(x-min)/span,0)/total*100) : 0;
    return { totalMaterials: total, avgLifespan, topCategory, sustainabilityScore };
  }, [rows]);

  // Demo AltRecs list
  const altRecs = [
    { baseName: "Portland cement", altName: "LC3 cement", deltaCPI: -0.12, deltaRIS: 0.18, reason: "Lower clinker factor" },
    { baseName: "Virgin steel", altName: "Recycled steel", deltaCPI: -0.08, deltaRIS: 0.10, reason: "EAF route" }
  ];

  return (
    <div style={{fontFamily:"system-ui, sans-serif", padding:"16px"}}>
      <h1>BlockPlane v2 Clean</h1>
      <p style={{opacity:.7, marginTop:0}}>Baseline skeleton with hardened TS/Vite settings.</p>

      <section style={{margin:"12px 0"}}>
        <StatsHeader stats={stats} />
      </section>

      <section style={{marginTop:"16px"}}>
        <AltRecsPanel
          items={altRecs}
          applied={{}}
          onApply={() => {}}
          onClear={() => {}}
        />
      </section>

      {loading && <div>Loading data…</div>}
    </div>
  );
}
TSX

# --- Components ---
cat > src/components/StatsHeader.tsx <<'TSX'
import React from "react";

type LegacyStats = {
  totalMaterials: number;
  avgLifespan?: number;
  topCategory?: string;
  sustainabilityScore?: number; // 0–100
};

type ExtendedProps = {
  totalMaterials?: number;
  filteredMaterials?: number;
  averageLIS?: number;
  averageRIS?: number;
  totalCost?: number;
};

type Props = { stats?: LegacyStats } & ExtendedProps;

function fmtNum(n?: number) { return typeof n === "number" && isFinite(n) ? n.toLocaleString() : "—"; }
function fmtFloat(n?: number, d = 2) { return typeof n === "number" && isFinite(n) ? n.toFixed(d) : "—"; }

const StatsHeader: React.FC<Props> = (props) => {
  const totalMaterials =
    typeof props.totalMaterials === "number" ? props.totalMaterials : props.stats?.totalMaterials ?? 0;

  const avgLifespan = props.stats?.avgLifespan;
  const topCategory = props.stats?.topCategory;
  const sustainabilityScore = props.stats?.sustainabilityScore;

  const filteredMaterials = props.filteredMaterials;
  const averageLIS = props.averageLIS;
  const averageRIS = props.averageRIS;

  const percentFiltered =
    typeof filteredMaterials === "number" && totalMaterials > 0
      ? Math.round((filteredMaterials / totalMaterials) * 100)
      : undefined;

  const items: { label: string; value: string; hint?: string }[] = [];
  items.push({ label: "Total Materials", value: fmtNum(totalMaterials), hint: "In dataset" });

  if (typeof filteredMaterials === "number") {
    items.push({
      label: "Filtered",
      value: percentFiltered !== undefined
        ? `${fmtNum(filteredMaterials)} (${percentFiltered}%)`
        : fmtNum(filteredMaterials),
      hint: "Visible after filters",
    });
  } else if (typeof avgLifespan === "number") {
    items.push({ label: "Avg Lifespan", value: `${fmtFloat(avgLifespan)} years`, hint: "Across visible rows" });
  }

  if (topCategory) items.push({ label: "Top Category", value: topCategory, hint: "Most represented" });

  if (typeof sustainabilityScore === "number") {
    items.push({
      label: "Sustainability",
      value: `${Math.max(0, Math.min(100, Math.round(sustainabilityScore)))}/100`,
      hint: "Higher is better",
    });
  }

  if (typeof averageLIS === "number") items.push({ label: "Avg LIS", value: fmtFloat(averageLIS, 1), hint: "Lower is better" });
  if (typeof averageRIS === "number") items.push({ label: "Avg RIS", value: fmtFloat(averageRIS, 1), hint: "Higher is better" });

  return (
    <div style={{display:"grid", gap:"12px", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))"}}>
      {items.map((it) => (
        <div key={it.label} style={{border:"1px solid #e5e7eb", borderRadius:12, padding:12}}>
          <div style={{fontSize:12, letterSpacing:1, opacity:.6}}>{it.label}</div>
          <div style={{fontSize:18, fontWeight:600}}>{it.value}</div>
          {it.hint && <div style={{fontSize:12, opacity:.6}}>{it.hint}</div>}
        </div>
      ))}
    </div>
  );
};

export default StatsHeader;
TSX

cat > src/components/AltRecsPanel.tsx <<'TSX'
import React from "react";
import type { AltRec } from "@/types/altrec";

type ReplacementMap = Record<string, string>;

export interface AltRecsPanelProps {
  items: AltRec[];
  applied: ReplacementMap;
  onApply: (rec: AltRec) => void;
  onClear: () => void;
  className?: string;
}

function isNum(n: unknown): n is number { return typeof n === "number" && isFinite(n); }
function fmtDelta(n?: number, d = 1) { if (!isNum(n)) return "—"; const s = n>0?"+":""; return `${s}${n.toFixed(d)}`; }

function Pill({ label, value }: { label: string; value?: number }) {
  if (!isNum(value)) return null;
  const pos = value > 0;
  const style = { background: pos ? "#dcfce7" : value < 0 ? "#fee2e2" : "#f3f4f6", color: pos ? "#166534" : value < 0 ? "#991b1b" : "#374151", borderRadius: 6, padding: "2px 6px", fontSize: 12 };
  return <span style={style}>{fmtDelta(value)} {label}</span>;
}

const AltRecsPanel: React.FC<AltRecsPanelProps> = ({ items, applied, onApply, onClear, className }) => {
  const appliedCount = Object.keys(applied || {}).length;

  return (
    <section className={className}>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>
        <h2 style={{fontSize:18, fontWeight:600}}>Suggested Alternatives</h2>
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <span style={{background:"#000", color:"#fff", padding:"2px 6px", borderRadius:6, fontSize:12}}>{appliedCount} applied</span>
          <button onClick={onClear} style={{border:"1px solid #e5e7eb", borderRadius:6, padding:"4px 10px", fontSize:14}}>Clear</button>
        </div>
      </div>

      <ul style={{display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))"}}>
        {items.map((rec, i) => {
          const isApplied = !!applied?.[rec.baseName];
          const dCPI = isNum(rec.deltaCPI) ? rec.deltaCPI : rec.costDelta;
          const dRIS = isNum(rec.deltaRIS) ? rec.deltaRIS : rec.risDelta;
          const dLIS = isNum(rec.deltaLIS) ? rec.deltaLIS : rec.lisDelta;

          const notes = Array.isArray((rec as any).notes)
            ? (rec as any).notes as string[]
            : typeof rec.notes === "string"
            ? rec.notes.split(/\r?\n/).filter(Boolean)
            : [];

          return (
            <li key={`${rec.baseName}::${rec.altName}::${i}`} style={{border:"1px solid #e5e7eb", borderRadius:12, padding:12}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                <div>
                  <div style={{fontSize:12, opacity:.6}}>{rec.baseName}</div>
                  <div style={{fontSize:16, fontWeight:600}}>{rec.altName}</div>
                </div>
                <button
                  onClick={() => onApply(rec)}
                  disabled={isApplied}
                  title={isApplied ? "Applied" : "Apply this swap"}
                  style={{
                    borderRadius:6, padding:"4px 10px", fontSize:14,
                    background: isApplied ? "#e5e7eb" : "#000", color: isApplied ? "#374151" : "#fff",
                    cursor: isApplied ? "default" : "pointer"
                  }}>
                  {isApplied ? "Applied" : "Apply"}
                </button>
              </div>

              <div style={{marginTop:8, display:"flex", gap:8, flexWrap:"wrap"}}>
                <Pill label="CPI" value={dCPI} />
                <Pill label="RIS" value={dRIS} />
                <Pill label="LIS" value={dLIS} />
                {rec.subtype && <span style={{fontSize:12, opacity:.7, border:"1px solid #e5e7eb", borderRadius:6, padding:"2px 6px"}}>{rec.subtype}</span>}
              </div>

              {(rec.reason || notes.length>0) && (
                <div style={{marginTop:8, fontSize:14}}>
                  {rec.reason && <div style={{marginBottom:4}}>{rec.reason}</div>}
                  {notes.length>0 && <ul style={{paddingLeft:16, margin:0}}>
                    {notes.slice(0,3).map((n,j)=><li key={j}>{n}</li>)}
                  </ul>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default AltRecsPanel;
TSX

# --- Types ---
cat > src/types/altrec.ts <<'TS'
/**
 * Alternative Recommendation record with modern and legacy field support
 */
export type AltRec = {
  baseName: string;
  altName: string;
  // Modern deltas
  deltaCPI?: number;
  deltaRIS?: number;
  deltaLIS?: number;
  // Legacy synonyms (compat)
  costDelta?: number;
  risDelta?: number;
  lisDelta?: number;
  // Optional meta
  score?: number;
  confidence?: number;
  subtype?: string;
  reason?: string;
  notes?: string | string[];
};

export function isAltRec(obj: unknown): obj is AltRec {
  return typeof obj === 'object' && obj !== null &&
         'baseName' in obj && 'altName' in obj;
}
export const getAltRecDeltas = (r: AltRec) => ({
  deltaCPI: r.deltaCPI ?? r.costDelta,
  deltaRIS: r.deltaRIS ?? r.risDelta,
  deltaLIS: r.deltaLIS ?? r.lisDelta,
});
TS

cat > src/types/index.ts <<'TS'
export * from "./altrec";
TS

# --- Sample data ---
mkdir -p public/data
cat > public/data/materials.json <<'JSON'
[
  { "name": "Portland cement", "category": "Binders", "subtype": "OPC", "lifespan": 50, "carbonFootprint": 900 },
  { "name": "LC3 cement", "category": "Binders", "subtype": "LC3", "lifespan": 60, "carbonFootprint": 650 },
  { "name": "Virgin steel", "category": "Metals", "subtype": "BOF", "lifespan": 75, "carbonFootprint": 1900 },
  { "name": "Recycled steel", "category": "Metals", "subtype": "EAF", "lifespan": 75, "carbonFootprint": 900 }
]
JSON

# --- TS / Vite / VS Code hardening ---
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020","DOM","DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },

    "strict": true,
    "skipLibCheck": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src/**/*","vite-env.d.ts"],
  "exclude": ["node_modules","dist","build","backups","scripts","**/*.bak","**/*.tmp","**/*.pre-*","**/*.sh","backend"]
}
JSON

cat > vite.config.ts <<'TS'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react({ fastRefresh: true })],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  server: {
    watch: {
      ignored: [
        "**/node_modules/**","**/dist/**","**/build/**",
        "**/backups/**","**/scripts/**",
        "**/*.bak","**/*.tmp","**/*.pre-*","**/*.sh","**/.tsbuildinfo",
        "**/backend/**"
      ]
    }
  }
});
TS

cat > .vscode/settings.json <<'JSON'
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.tsserver.watchOptions": {
    "watchFile": "useFsEventsOnParentDirectory",
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority"
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/backups/**": true,
    "**/scripts/**": true,
    "**/*.bak": true,
    "**/*.tmp": true,
    "**/*.pre-*": true,
    "**/*.sh": true,
    "**/.tsbuildinfo": true,
    "**/backend/**": true
  },
  "files.eol": "\n"
}
JSON

cat > .editorconfig <<'CONF'
root = true
[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
CONF

cat > .gitattributes <<'CONF'
*.{js,jsx,ts,tsx,json,css,scss,md} text eol=lf
* text=auto
CONF

echo "✅ Done. Next:"
echo "   cd $APP"
echo "   npm install   # ensures lockfile resolves correctly"
echo "   npm run dev"
