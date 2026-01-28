import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEdgeToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const { userId } = await verifyEdgeToken(token);
  return userId;
}

function getPromptFromPayload(payload: unknown): string | null {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "prompt" in payload &&
    typeof (payload as any).prompt === "string"
  ) {
    return (payload as any).prompt;
  }
  return null;
}

function getTextFromOutput(output: unknown): string | null {
  if (
    typeof output === "object" &&
    output !== null &&
    "text" in output &&
    typeof (output as any).text === "string"
  ) {
    return (output as any).text;
  }
  return null;
}

export async function GET() {
  try {
    const userId = await getUserId();

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        taskResults: {
          orderBy: { order: "asc" },
          take: 1,
        },
      },
    });

    const tasksResponse = tasks.map((t) => {
        const prompt = getPromptFromPayload(t.payload);
        const lastStep = t.taskResults.at(-1);

        return {
            id: t.id,
            name: prompt ? prompt.slice(0, 50) : "Task",
            status: t.status,
            updatedAt: t.updatedAt,
            pipeline: t.taskResults.map((r) => r.type),
            lastOutput: lastStep ? getTextFromOutput(lastStep.output) : null,
        };
    });

    return NextResponse.json(tasksResponse);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
