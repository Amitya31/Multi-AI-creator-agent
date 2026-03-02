import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,);


export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  if (!sig) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    )
  }

  let event:Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err:any) {
    console.error("Webhook signature verification failed: ",err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId!;
    const credits = Number(session.metadata?.credits);
    const StripeSessionId = session.id;
 
    await prisma.$transaction(async (tx) => {
      const billingTx = await tx.billingTransaction.findFirst({
        where: {
          stripeSessionId:StripeSessionId,
        },
      });

      if(!billingTx){
        console.error("Billing Transaction not found")
        return
      }

      if (billingTx.status === "completed") {
        console.log("⚠️ Already processed")
        return
      }

      await tx.billingTransaction.update({
        where: {
          id: billingTx.id,
        },
        data: {
          status: "completed",
        }
      })

      await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      })

      await tx.creditLedger.create({
        data: {
          userId,
          change: credits,
          reason: "purchase",
        },
      });
    });
  }

  return NextResponse.json({ received: true });
}
