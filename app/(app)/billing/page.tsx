export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import BillingOverview from "@/components/billing/BillingOverview"
import BillingHistory from "@/components/billing/BillingHistory"
import PricingCards from "@/components/billing/PricingCards"

export default function BillingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">
          Account
        </p>
        <h1 className="font-serif text-3xl tracking-tight text-foreground">
          Billing
        </h1>
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