import BillingOverview from "@/components/billing/BillingOverview"
import BillingHistory from "@/components/billing/BillingHistory"
import PricingCards from "@/components/billing/PricingCards"
import {prisma} from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyEdgeToken } from "@/lib/auth/jwt"

export default async function BillingPage() {
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect('/login');
  const { userId } = await verifyEdgeToken(token);
  const user = await prisma.user.findFirst({where:{id:userId}})
  console.log(user)
      
 
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      {/* Page header */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">
          Account
        </p>
        <h1 className="font-serif text-3xl tracking-tight text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground font-light mt-1">
          Manage your credits, plans, and payment history.
        </p>
      </div>

      <BillingOverview />
      <PricingCards />
      <BillingHistory />
    </div>
  )
}
