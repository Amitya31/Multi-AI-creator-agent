// app/api/dashboard/agents/route.ts
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

    const rows = await prisma.taskResult.groupBy({
      by: ["type"],
      where: {
        task: { userId },
        totalTokens: { not: null },
      },
      _sum: {
        totalTokens: true,
      },
      orderBy: {
        _sum: { totalTokens: "desc" },
      },
    });

    const tokenByStep = rows.map((r) => ({
      stepType: r.type,
      tokens: r._sum.totalTokens ?? 0,
    }));

    return NextResponse.json({
      tokenByStep,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load agent analytics" },
      { status: 500 }
    );
  }
}   
