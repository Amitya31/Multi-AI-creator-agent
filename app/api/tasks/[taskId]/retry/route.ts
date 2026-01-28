// app/api/tasks/[taskId]/retry/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { agentQueue } from "@/lib/queue";

export async function POST(
  _req: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;

  const failedStep = await prisma.taskResult.findFirst({
    where: { taskId, status: "failed" },
    orderBy: { order: "asc" },
  });

  if (!failedStep) {
    return NextResponse.json(
      { error: "No failed step to retry" },
      { status: 400 }
    );
  }

  // Reset failed + downstream steps
  await prisma.taskResult.updateMany({
    where: {
      taskId,
      order: { gte: failedStep.order },
    },
    data: {
      status: "pending",
      errorMessage: null,
      output: null,
      contentId: null,
    },
  });

  await prisma.task.update({
    where: { id: taskId },
    data: { status: "running" },
  });

  await agentQueue.add("run-step", {
    taskId,
    taskResultId: failedStep.id,
    stepIndex: (failedStep.order ?? 1) - 1,
    pipeline: [], 
  });

  return NextResponse.json({ message: "Retry started" });
}
