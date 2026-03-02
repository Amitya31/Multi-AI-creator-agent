export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const plans = await prisma.pricingPlan.findMany({
    where: { active: true },
    orderBy: { priceUSD: "asc" },
  })

  return NextResponse.json(plans)
}