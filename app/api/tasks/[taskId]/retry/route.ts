// app/api/tasks/[taskId]/retry/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { agentQueue } from "@/lib/queue";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const {taskId} = await params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

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

  if (failedStep.order == null) {
    return NextResponse.json(
      { error: "Invalid task state" },
      { status: 500 }
    );
  }

  const pipeline = (task.payload as any)?.pipeline;
  if (!pipeline || !Array.isArray(pipeline)) {
    return NextResponse.json(
      { error: "Pipeline not found on task" },
      { status: 500 }
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
      output: { set: null },
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
    stepIndex: failedStep.order - 1,
    pipeline,
  });

  return NextResponse.json({ message: "Retry started" });
}
