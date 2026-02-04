import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyEdgeToken } from "@/lib/auth/jwt"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  console.log(token)

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try{
    verifyEdgeToken(token)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/tasks/:path*", "/api/tasks/:path*"]
}
