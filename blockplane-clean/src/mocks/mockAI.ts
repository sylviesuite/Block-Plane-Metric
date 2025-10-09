// src/mocks/mockAI.ts

import type { Insight } from "../aiAgent";

export async function callAllAI(): Promise<Insight> {
  return {
    takeaway: "This is a mock insight.",
    summary: "Mock summary for testing UI rendering.",
    compliance: "Mock compliance result: Meets all major standards.",
    LIS: 42,
    RIS: 70,
    model: "mock-AI",
    flags: ["mocked", "demo"],
  };
}
