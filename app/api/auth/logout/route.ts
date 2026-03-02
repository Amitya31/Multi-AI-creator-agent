import { NextResponse } from "next/server"
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    expires: new Date(0), // expire immediately
    path: "/",
  })

  return response
}