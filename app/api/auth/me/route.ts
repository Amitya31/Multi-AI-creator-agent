import { NextResponse } from "next/server"
import { verifyEdgeToken } from "@/lib/auth/jwt"
import {prisma} from "@/lib/prisma"

export async function GET(req: Request) {
  

  const cookie = req.headers.get("cookie")
  const token = cookie?.split("token=")[1]
  if (!token) return NextResponse.json(null)

  try {
    const { userId } = verifyEdgeToken(token)
    const user = await prisma.user.findUnique({where:{id:userId}})
    return NextResponse.json(user)
  } catch {
    return NextResponse.json(null)
  }
}
