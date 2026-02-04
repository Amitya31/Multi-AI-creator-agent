// app/api/dashboard/recent-tasks/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyEdgeToken } from "@/lib/auth/jwt";

async function getUserId() {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const { userId } = await verifyEdgeToken(token);
  return userId;
}

export async function GET() {
  try {
    const userId = await getUserId();

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        taskResults: {
          select: { totalTokens: true },
        },
      },
    });

    return NextResponse.json(
      tasks.map((t) => ({
        id: t.id,
        name:
          typeof t.payload === "object" && t.payload !== null
            ? (t.payload as any).prompt?.slice(0, 50) ?? "Task"
            : "Task",
        status: t.status,
        tokens: t.taskResults.reduce(
          (sum, r) => sum + (r.totalTokens ?? 0),
          0
        ),
        createdAt: t.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
