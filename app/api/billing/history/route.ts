import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyEdgeToken } from "@/lib/auth/jwt"

async function getUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) throw new Error("Unauthorized")
  const { userId } = await verifyEdgeToken(token)
  return userId
}

export async function GET() {
  try {
    const userId = await getUserId()

    const transactions = await prisma.billingTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(transactions)
  } catch (err) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}
