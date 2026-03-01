import { NextResponse } from "next/server"
import { verifyEdgeToken } from "@/lib/auth/jwt"
import {prisma} from "@/lib/prisma"
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw new Error("Unauthorized");
    const { userId } = await verifyEdgeToken(token);
     
    
    const user = await prisma.user.findUnique({where:{id:userId}})
    return NextResponse.json(user)
  } catch {
    return NextResponse.json(null)
  }
}
