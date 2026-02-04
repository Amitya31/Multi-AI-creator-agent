// lib/planner.ts
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AgentKey, AGENT_LABELS, AGENT_DESCRIPTIONS } from "@/lib/agents/registry";
import { AgentPipelineStep, AgentStepType } from "@/lib/agents/types";


let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/* ----------------------------------
 * Zod schema for Gemini output
 * ---------------------------------- */

const PlanStepSchema = z.object({
  key: z.enum(["outline", "writer", "seo", "title", "summarizer"]),
  description: z.string().optional(),
  options: z.record(z.string(), z.any()).optional(),
});

const PlanSchema = z.object({
  steps: z.array(PlanStepSchema).min(1).max(8),
});

/* ----------------------------------
 * Helpers
 * ---------------------------------- */

function extractJsonFromText(text: string): string {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in planner output");
  }
  return text.slice(firstBrace, lastBrace + 1);
}

/* ----------------------------------
 * AgentKey → StepType mapping
 * ---------------------------------- */

const STEP_TYPE_BY_KEY: Record<AgentKey, AgentPipelineStep["type"]> = {
  outline: "CREATE_OUTLINE",
  writer: "GENERATE_TEXT",
  seo: "SEO_OPTIMIZE",
  title: "GENERATE_TITLE",
  summarizer: "SUMMARIZE",
};


/* ----------------------------------
 * Types
 * ---------------------------------- */


/* ----------------------------------
 * Heuristic planner
 * ---------------------------------- */

function heuristicPlan(
  prompt: string,
  options?: Record<string, any>
): AgentPipelineStep[] {
  const lower = prompt.toLowerCase();
  const pipeline: AgentPipelineStep[] = [];

  if (
    lower.includes("outline") ||
    lower.includes("structure") ||
    lower.includes("sections")
  ) {
    pipeline.push({
      key: "outline",
      type: STEP_TYPE_BY_KEY.outline,
      options: { levelOfDetail: "high", ...(options ?? {}) },
    });
  }

  if (
    lower.includes("blog") ||
    lower.includes("article") ||
    lower.includes("post") ||
    lower.includes("essay")
  ) {
    pipeline.push({
      key: "writer",
      type: STEP_TYPE_BY_KEY.writer,
      options: { tone: "conversational", ...(options ?? {}) },
    });
  }

  if (lower.includes("seo") || lower.includes("rank") || lower.includes("google")) {
    pipeline.push({
      key: "seo",
      type: STEP_TYPE_BY_KEY.seo,
      options: { targetLength: "medium", ...(options ?? {}) },
    });
  }

  if (lower.includes("title") || lower.includes("headline")) {
    pipeline.push({
      key: "title",
      type: STEP_TYPE_BY_KEY.title,
      options: { style: "clickable", ...(options ?? {}) },
    });
  }

  if (
    lower.includes("summarize") ||
    lower.includes("summary") ||
    lower.includes("tl;dr")
  ) {
    pipeline.push({
      key: "summarizer",
      type: STEP_TYPE_BY_KEY.summarizer,
      options: { compression: "medium", ...(options ?? {}) },
    });
  }

  // Default fallback
  if (pipeline.length === 0) {
    pipeline.push(
      {
        key: "outline",
        type: STEP_TYPE_BY_KEY.outline,
        options: { levelOfDetail: "medium", ...(options ?? {}) },
      },
      {
        key: "writer",
        type: STEP_TYPE_BY_KEY.writer,
        options: { tone: "neutral", ...(options ?? {}) },
      }
    );
  }

  console.log("[planner] heuristic pipeline:", pipeline);
  return pipeline;
}

/* ----------------------------------
 * Gemini-based planner
 * ---------------------------------- */

export async function decideAgentsForPromopt(
  prompt: string,
  options?: Record<string, any>
): Promise<AgentPipelineStep[]> {
  if (!genAI) {
    return heuristicPlan(prompt, options);
  }

  const modelName =
    process.env.GEMINI_PLANNER_MODEL ||
    process.env.GEMINI_MODEL ||
    "gemini-2.0-flash";

  const model = genAI.getGenerativeModel({ model: modelName });

  const agentsDescription = (Object.keys(AGENT_LABELS) as AgentKey[])
    .map(
      (key) =>
        `- key: "${key}", label: "${AGENT_LABELS[key]}", role: ${AGENT_DESCRIPTIONS[key]}`
    )
    .join("\n");

  const plannerInstruction = `
  You are a planning agent in a multi-agent content system.

  Available agents:
  ${agentsDescription}

  Your job:
  - Read the user prompt.
  - Decide which agents to run and in what order.
  - You can skip agents that are not needed.
  - For short tasks like "summarize this", you may only use the summarizer.
  - For longer content generation, a typical pipeline is:
    outline -> writer -> seo -> title
  - For pure SEO optimization you may only use the seo agent.

  Respond ONLY with JSON in this TypeScript shape:

  type Plan = {
    steps: {
      key: "outline" | "writer" | "seo" | "title" | "summarizer";
      description?: string;
      options?: Record<string, any>;
    }[];
  };

  NO extra text. NO markdown. ONLY JSON.
  `.trim();

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${plannerInstruction}\n\nUser prompt:\n"""${prompt}"""` }],
        },
      ],
      generationConfig: {
        temperature: options?.plannerTemperature ?? 0.2,
        maxOutputTokens: 512,
      },
    });

    const rawText = result.response.text();

    let json: unknown;
    try {
      json = JSON.parse(extractJsonFromText(rawText));
    } catch (e) {
      console.error("[planner] JSON parse failed:", e, rawText);
      return heuristicPlan(prompt, options);
    }

    const parsed = PlanSchema.safeParse(json);
    if (!parsed.success) {
      console.error("[planner] Plan validation failed:", parsed.error);
      return heuristicPlan(prompt, options);
    }

    const pipeline: AgentPipelineStep[] = parsed.data.steps.map((step) => ({
      key: step.key,
      type: STEP_TYPE_BY_KEY[step.key],
      description: step.description,
      options: step.options ?? {},
    }));

    console.log("[planner] pipeline (Gemini):", pipeline);
    return pipeline;
  } catch (err: any) {
    console.error(
      "[planner] Gemini planner failed, falling back to heuristic:",
      err?.message ?? err
    );
    return heuristicPlan(prompt, options);
  }
}
