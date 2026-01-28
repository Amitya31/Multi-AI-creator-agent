import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = await params;

  if (!taskId) {
    return NextResponse.json(
      { error: "taskId is required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      taskResults: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: task.id,
    status: task.status,
    steps: task.taskResults.map((r) => ({
      step: r.type,
      status: r.status,
      output:
        typeof r.output === "object" && r.output !== null
          ? (r.output as any).text ?? null
          : null,
    })),
  });
}
