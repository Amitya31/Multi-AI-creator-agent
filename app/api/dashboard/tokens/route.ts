// app/api/dashboard/tokens/route.ts
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

    return NextResponse.json(
      rows.map((r) => ({
        agent: r.type,
        tokens: r._sum.totalTokens ?? 0,
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
