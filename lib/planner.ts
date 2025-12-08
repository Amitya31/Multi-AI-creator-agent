import "dotenv/config";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AGENTS,AgentKey, AgentPipelineStep } from "./agents/registry";

const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PlanStepSchema = z.object({
    key: z.enum(["outline", "writer", "seo", "title", "summarizer"]),
    type: z.string(),
    description: z.string().optional(),
    options: z.record(z.string(),z.any()).optional(),
})

const PlanSchema = z.object({
    steps: z.array(PlanStepSchema).min(1).max(8),
});

function extractJsonFromText(text: string): string{
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if(firstBrace===-1 || lastBrace === -1 || lastBrace <= firstBrace){
        throw new Error("No JSON object found in planner output");
    } 
    return text.slice(firstBrace, lastBrace + 1)
}



export async function decideAgentsForPromopt(prompt:string,options?:Record<string,any>):Promise<AgentPipelineStep[]>{
    if(!process.env.GEMINI_API_KEY){
        return [
            { key: "outline", type: "CREATE_OUTLINE", agentId: AGENTS.outline.id },
            { key: "writer", type: "GENERATE_DRAFT", agentId: AGENTS.writer.id },
            { key: "seo", type: "SEO_OPTIMIZE", agentId: AGENTS.seo.id },
            { key: "title", type: "GENERATE_TITLE", agentId: AGENTS.title.id }
        ]
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const agentsDescription = Object.entries(AGENTS)
       .map(([key,cfg])=> `-key: "${key}", id: "${cfg.id}", role: ${cfg.description}`)
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
       - For longer content generation, typical pipeline:
        outline -> writer -> seo -> title
       - For pure SEO optimization you may only use the seo agent.
       - Respond ONLY with JSON in the following TypeScript shape:
        
       type Plan = {
        steps: {
           key: "outline" | "writer" | "title" | "summarizer";
           type: string;
           description?: string;
           options?: Record<string, any>;
        }[];
       };

       NO extra text. NO markdown. ONLY JSON.
       ` ;

    const userPrompt = typeof prompt === "string" ? prompt : JSON.stringify(prompt, null, 2);

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
            temperature: options?.plannerTemprature ?? 0.2,
            maxOutputTokens: 512,
        },
    });
    const response =  await result.response;
    const rawText = response.text();

    let json: unknown;
    try {
        const jsonString = extractJsonFromText(rawText);
        json = JSON.parse(jsonString);
    }catch(e){
        console.error("[planner] Failed to parse JSON from Gemini:", e, rawText)

        return [
            { key: "outline", type: "CREATE_OUTLINE", agentId: AGENTS.outline.id },
            { key: "writer", type: "GENERATE_DRAFT", agentId: AGENTS.writer.id },
            { key: "seo", type: "SEO_OPTIMIZE", agentId: AGENTS.seo.id },
            { key: "title", type: "GENERATE_TITLE", agentId: AGENTS.title.id }
        ];
    }
    
    const parsed = PlanSchema.safeParse(json);
    if(!parsed.success){
        console.error("[planner] Plan validation failed:", parsed.error);
        return [
            { key: "outline", type: "CREATE_OUTLINE", agentId: AGENTS.outline.id },
            { key: "writer", type: "GENERATE_DRAFT", agentId: AGENTS.writer.id },
            { key: "seo", type: "SEO_OPTIMIZE", agentId: AGENTS.seo.id },
            { key: "title", type: "GENERATE_TITLE", agentId: AGENTS.title.id }
        ];
    }
    const plan = parsed.data;

    const pipeline: AgentPipelineStep[] = plan.steps.map((step)=>{
        const cfg = AGENTS[step.key];
        return {
            key: step.key,
            type: step.key,
            agentId: cfg.id,
            description: step.description,
            options: step.options ?? {},
        };
    });

    if(!pipeline.length){
        return [
            { key: "outline", type: "CREATE_OUTLINE", agentId: AGENTS.outline.id },
            { key: "writer", type: "GENERATE_DRAFT", agentId: AGENTS.writer.id },
            { key: "seo", type: "SEO_OPTIMIZE", agentId: AGENTS.seo.id },
            { key: "title", type: "GENERATE_TITLE", agentId: AGENTS.title.id }
        ];
    }

    return pipeline;

}

