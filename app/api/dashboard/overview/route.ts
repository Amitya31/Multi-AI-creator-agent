// app/api/dashboard/overview/route.ts
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

    const [totalTasks, completedTasks, failedTasks, tokenAgg, user] =
      await Promise.all([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: "completed" } }),
        prisma.task.count({ where: { userId, status: "failed" } }),
        prisma.taskResult.aggregate({
          where: { task: { userId } },
          _sum: { totalTokens: true },
        }),
        prisma.user.findUnique({ where: { id: userId } }),
      ]);

    return NextResponse.json({
      totalTasks,
      completedTasks,
      failedTasks,
      totalTokensUsed: tokenAgg._sum.totalTokens ?? 0,
      remainingCredits: user?.credits ?? 0,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
