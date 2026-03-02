// app/api/usage/summary/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyEdgeToken } from "@/lib/auth/jwt";
export const dynamic = "force-dynamic";
async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  const { userId } = await verifyEdgeToken(token);
  return userId;
}

export async function GET() {
  try {
    const userId = await getUserId();

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 7);

    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);

    const [
      totalAgg,
      todayAgg,
      last7Agg,
      last30Agg,
      user,
    ] = await Promise.all([
      prisma.taskResult.aggregate({
        where: { task: { userId } },
        _sum: { totalTokens: true },
      }),

      prisma.taskResult.aggregate({
        where: {
          task: { userId },
          createdAt: { gte: startOfToday },
        },
        _sum: { totalTokens: true },
      }),

      prisma.taskResult.aggregate({
        where: {
          task: { userId },
          createdAt: { gte: last7Days },
        },
        _sum: { totalTokens: true },
      }),

      prisma.taskResult.aggregate({
        where: {
          task: { userId },
          createdAt: { gte: last30Days },
        },
        _sum: { totalTokens: true },
      }),
      
      prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      }),
    ]);

    return NextResponse.json({
      totalTokensUsed: totalAgg._sum.totalTokens ?? 0,
      tokensToday: todayAgg._sum.totalTokens ?? 0,
      tokensLast7Days: last7Agg._sum.totalTokens ?? 0,
      tokensLast30Days: last30Agg._sum.totalTokens ?? 0,
      remainingCredits: user?.credits ?? 0,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
