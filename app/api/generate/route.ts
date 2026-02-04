// app/api/generate/route.ts
import { NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";
import { decideAgentsForPromopt } from "@/lib/planner";
import { agentQueue } from "@/lib/queue";
import { AgentPipelineStep } from "@/lib/agents/types";
import { cookies } from "next/headers";
import { verifyEdgeToken } from "@/lib/auth/jwt";

const BodySchema = z.object({
  prompt: z.string().min(1),
  userId: z.string().optional(),
  options: z.record(z.string(), z.any()).optional(),
  idempotencyKey: z.string().optional(),
});
  async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");
    const { userId } = await verifyEdgeToken(token);
    return userId;
  }
type ResolvedPipelineStep = AgentPipelineStep & {
  agentId: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { prompt, options, idempotencyKey } = parsed.data;
    const userId = await getUserId();


    if (idempotencyKey) {
      const existing = await prisma.task.findFirst({
        where: { idempotencyKey },
      });

      if (existing) {
        return NextResponse.json(
          {
            message: "Task already created",
            taskId: existing.id,
          },
          { status: 200 }
        );
      }
    }


    const plannedPipeline = await decideAgentsForPromopt(prompt, options);

    if (!plannedPipeline.length) {
      return NextResponse.json(
        { error: "No agents selected" },
        { status: 400 }
      );
    }


      const TOKEN_COST_BY_AGENT = {
        CREATE_OUTLINE: 1500,
        GENERATE_TEXT: 4000,
        SEO_OPTIMIZE: 2500,
        GENERATE_TITLE: 800,
        SUMMARIZE: 1000,
      };

      const TOKEN_ESTIMATE_BY_STEP = {
        CREATE_OUTLINE: 1500,
        GENERATE_TEXT: 4000,
        SEO_OPTIMIZE: 2000,
        GENERATE_TITLE: 800,
        SUMMARIZE: 1000,
      } as const;

      function estimatePipelineTokens(pipeline: AgentPipelineStep[]) {
        return pipeline.reduce(
          (sum, step) => sum + (TOKEN_COST_BY_AGENT[step.type] ?? 3000),
          0
        );
      }


    const estimatedTokens = estimatePipelineTokens(plannedPipeline);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.credits < estimatedTokens) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }



    const resolvedPipeline: ResolvedPipelineStep[] = [];

    for (const step of plannedPipeline) {
      const agent = await prisma.agent.findFirst({
        where: {
          name: step.key, // "writer", "outline", etc
          OR: [
            userId ? { ownerId: userId } : undefined,
            { owner: { email: "admin@example.com" } }, // system fallback
          ].filter(Boolean) as any,
        },
      });

      if (!agent) {
        return NextResponse.json(
          { error: `Agent not found: ${step.key}` },
          { status: 400 }
        );
      }

      resolvedPipeline.push({
        ...step,
        agentId: agent.id,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          userId,
          type:
            resolvedPipeline.length > 1
              ? "MULTI_AGENT_PIPELINE"
              : resolvedPipeline[0].type,
          payload: { prompt, options },
          status: "pending",
          idempotencyKey: idempotencyKey ?? null,
        },
      });

      const taskResultRows = [];

      for (let i = 0; i < resolvedPipeline.length; i++) {
        const step = resolvedPipeline[i];

        const tr = await tx.taskResult.create({
          data: {
            taskId: task.id,
            agentId: step.agentId,
            type: step.type,
            status: "pending",
            order: i + 1,
          },
        });

        taskResultRows.push(tr);
      }

      return { task, taskResultRows };
    });

  
    const firstStep = result.taskResultRows[0];

    await agentQueue.add(
      "run-step",
      {
        taskId: result.task.id,
        taskResultId: firstStep.id,
        stepIndex: 0,
        pipeline: resolvedPipeline,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      }
    );


    return NextResponse.json(
      {
        message: "Task created",
        taskId: result.task.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Generate API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
