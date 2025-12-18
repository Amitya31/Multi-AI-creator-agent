// lib/planner.ts
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AGENTS, AgentKey, AgentPipelineStep } from "@/lib/agents/registry";

let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// --- Zod schema for Gemini planner output ---

const PlanStepSchema = z.object({
  key: z.enum(["outline", "writer", "seo", "title", "summarizer"]),
  type: z.string().optional(), // Gemini may or may not fill this
  description: z.string().optional(),
  options: z.record(z.string(), z.any()).optional(),
});

const PlanSchema = z.object({
  steps: z.array(PlanStepSchema).min(1).max(8),
});

// Helper to extract JSON if Gemini adds extra text
function extractJsonFromText(text: string): string {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in planner output");
  }
  return text.slice(firstBrace, lastBrace + 1);
}

// Map AgentKey -> AgentStepType string for prompts
const STEP_TYPE_BY_KEY: Record<AgentKey, string> = {
  outline: "CREATE_OUTLINE",
  writer: "GENERATE_TEXT",
  seo: "SEO_OPTIMIZE",
  title: "GENERATE_TITLE",
  summarizer: "SUMMARIZE",
};

// --- Heuristic planner (your current simple planner) ---

function heuristicPlan(
  prompt: string,
  options?: Record<string, any>
): AgentPipelineStep[] {
  const lower = prompt.toLowerCase();
  const pipeline: AgentPipelineStep[] = [];

  // Outline when structuring/long-form
  if (
    lower.includes("outline") ||
    lower.includes("structure") ||
    lower.includes("sections")
  ) {
    pipeline.push({
      key: "outline",
      type: "CREATE_OUTLINE",
      agentId: AGENTS.outline.id,
      options: { levelOfDetail: "high", ...(options ?? {}) },
    });
  }

  // Writer for blog/article/post/essay style prompts
  if (
    lower.includes("blog") ||
    lower.includes("article") ||
    lower.includes("post") ||
    lower.includes("essay")
  ) {
    pipeline.push({
      key: "writer",
      type: "GENERATE_TEXT",
      agentId: AGENTS.writer.id,
      options: { tone: "conversational", ...(options ?? {}) },
    });
  }

  // SEO
  if (lower.includes("seo") || lower.includes("rank") || lower.includes("google")) {
    pipeline.push({
      key: "seo",
      type: "SEO_OPTIMIZE",
      agentId: AGENTS.seo.id,
      options: { targetLength: "medium", ...(options ?? {}) },
    });
  }

  // Title
  if (lower.includes("title") || lower.includes("headline")) {
    pipeline.push({
      key: "title",
      type: "GENERATE_TITLE",
      agentId: AGENTS.title.id,
      options: { style: "clickable", ...(options ?? {}) },
    });
  }

  // Summarizer
  if (lower.includes("summarize") || lower.includes("summary") || lower.includes("tl;dr")) {
    pipeline.push({
      key: "summarizer",
      type: "SUMMARIZE",
      agentId: AGENTS.summarizer.id,
      options: { compression: "medium", ...(options ?? {}) },
    });
  }

  // If nothing triggered → default: outline + writer
  if (pipeline.length === 0) {
    pipeline.push(
      {
        key: "outline",
        type: "CREATE_OUTLINE",
        agentId: AGENTS.outline.id,
        options: { levelOfDetail: "medium", ...(options ?? {}) },
      },
      {
        key: "writer",
        type: "GENERATE_TEXT",
        agentId: AGENTS.writer.id,
        options: { tone: "neutral", ...(options ?? {}) },
      }
    );
  }

  console.log("[planner] heuristic pipeline:", pipeline);
  return pipeline;
}

// --- Gemini-based planner with fallback to heuristicPlan ---

export async function decideAgentsForPromopt(
  prompt: string,
  options?: Record<string, any>
): Promise<AgentPipelineStep[]> {
  // If no Gemini key → always heuristic
  if (!genAI) {
    return heuristicPlan(prompt, options);
  }

  const modelName = process.env.GEMINI_PLANNER_MODEL || process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const agentsDescription = (Object.entries(AGENTS) as [AgentKey, (typeof AGENTS)[AgentKey]][])
    .map(
      ([key, cfg]) =>
        `- key: "${key}", id: "${cfg.id}", label: "${cfg.label}", role: ${cfg.description}`
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
    type?: string;
    description?: string;
    options?: Record<string, any>;
  }[];
};

NO extra text. NO markdown. ONLY JSON.
`.trim();

  const userPrompt =
    typeof prompt === "string" ? prompt : JSON.stringify(prompt, null, 2);

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                plannerInstruction +
                `\n\nUser prompt:\n"""${userPrompt}"""\n\nRemember: ONLY return JSON.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: options?.plannerTemperature ?? 0.2,
        maxOutputTokens: 512,
      },
    });

    const response = await result.response;
    const rawText = response.text();

    let json: unknown;
    try {
      const jsonString = extractJsonFromText(rawText);
      json = JSON.parse(jsonString);
    } catch (e) {
      console.error("[planner] Failed to parse JSON from Gemini:", e, rawText);
      return heuristicPlan(prompt, options);
    }

    const parsed = PlanSchema.safeParse(json);
    if (!parsed.success) {
      console.error("[planner] Plan validation failed:", parsed.error);
      return heuristicPlan(prompt, options);
    }

    const plan = parsed.data;

    const pipeline: AgentPipelineStep[] = plan.steps.map((step) => {
      const cfg = AGENTS[step.key];
      return {
        key: step.key,
        type: STEP_TYPE_BY_KEY[step.key], // map key -> agent step type
        agentId: cfg.id,
        description: step.description,
        options: step.options ?? {},
      };
    });

    if (!pipeline.length) {
      return heuristicPlan(prompt, options);
    }

    console.log("[planner] input prompt:", prompt);
    console.log("[planner] pipeline (Gemini):", pipeline);
    return pipeline;
  } catch (err: any) {
    // Handles 429, 404, network, etc.
    console.error("[planner] Gemini planner failed, falling back to heuristic:", err?.message ?? err);
    return heuristicPlan(prompt, options);
  }
}
