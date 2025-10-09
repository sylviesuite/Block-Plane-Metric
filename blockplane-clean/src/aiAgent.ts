// src/aiAgent.ts

export interface Insight {
  name: string;
  LIS: number;
  RIS: number;
  category?: string;
  summary?: string;
  takeaway?: string;
  compliance?: string;
  flags?: string[];
  carbonClass?: string;
  model?: string;

  // Lifecycle phase data (needed for charting)
  origin: number;
  factory: number;
  transport: number;
  construction: number;
  disposal: number;
}

export interface InsightRequest {
  LIS?: number;
  RIS?: number;
  model?: string;
  flags?: string[];
  materialName?: string;
}

export async function callAllAI(context: InsightRequest): Promise<Insight> {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const claudeKey = import.meta.env.VITE_CLAUDE_API_KEY;

  const materialName = context.materialName ?? "the selected material";

  const gptPrompt = `Provide a short, builder-friendly environmental impact summary for the material "${materialName}".`;
  const claudePrompt = `Does the material "${materialName}" meet key environmental standards?`;

  const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: gptPrompt }],
    }),
  });

  const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": claudeKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-opus-2024-04-08",
      max_tokens: 300,
      messages: [{ role: "user", content: claudePrompt }],
    }),
  });

  const gptData = await gptRes.json();
  const claudeData = await claudeRes.json();

  return {
    name: materialName,
    takeaway: gptData?.choices?.[0]?.message?.content ?? "",
    compliance: claudeData?.content?.[0]?.text ?? "",
    LIS: context.LIS ?? 0,
    RIS: context.RIS ?? 0,
    summary: "Generated summary placeholder.",
    model: context.model,
    flags: context.flags,
    category: undefined, // can be added externally
    carbonClass: undefined,
    origin: Math.random() * 2,
    factory: Math.random() * 2,
    transport: Math.random() * 2,
    construction: Math.random() * 2,
    disposal: Math.random() * 2,
  };
}
