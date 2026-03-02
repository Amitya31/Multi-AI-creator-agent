import {verifyEdgeToken} from "@/lib/auth/jwt";
import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
import Stripe from "stripe";
import {NextResponse} from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = await verifyEdgeToken(token);
  return payload.userId;
}

export async function POST(req: Request){
  try {
    const userId =  await getUserId();
    const body = await req.json();

    
    const {planId} = body;

    if(!planId){
      return NextResponse.json({error: "Plan ID is required"}, {status: 400})
    }

    const plan = await prisma.pricingPlan.findUnique({
      where: {id: planId}
    })
    if (!plan || !plan.active) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} Plan`,
              description: `${plan.credits.toLocaleString()} credits`,
            },
            unit_amount: plan.priceUSD,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        planId: plan.id,
        credits: plan.credits.toString(),
      },
    })
    
    await prisma.billingTransaction.create({
      data: {
        userId,
        amount: plan.priceUSD,
        currency: "USD",
        creditsAdded: plan.credits,
        stripeSessionId: session.id,
        status: "pending",
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout Error:", error)
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    )
  }
}