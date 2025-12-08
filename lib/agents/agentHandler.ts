// lib/agents/agentHandler.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type NormalizedUsage = {
  promptTokens: number | null;
  candidatesTokens: number | null;
  totalTokens: number | null;
};

export async function runAgentWithGemini(
  agentId: string,
  input: any,
  options?: any
): Promise<{ text: string; usage: NormalizedUsage | null; model: string }> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from .env");
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  const prompt = typeof input === "string" ? input : JSON.stringify(input, null, 2);

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are ${agentId}. Produce the requested output.\n\nInput:\n${prompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 2048,
    },
  });

  const response = await result.response;
  const text = response.text();

  const u = response.usageMetadata;
  const usage: NormalizedUsage | null = u
    ? {
        promptTokens: u.promptTokenCount ?? null,
        candidatesTokens: u.candidatesTokenCount ?? null,
        totalTokens: u.totalTokenCount ?? null,
      }
    : null;

  return {
    text,
    usage,
    model: modelName,
  };
}
