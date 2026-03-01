"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Map plan index → feature list (adjust to match your real plans)
const planFeatures: Record<number, string[]> = {
  0: ["All 5 AI agents", "Real-time SSE streaming", "Credit dashboard", "Credits roll over"],
  1: ["Everything in Starter", "Priority queue", "Custom tone & style", "Billing CSV export"],
  2: ["Everything in Pro", "Unlimited credits", "Multi-seat access", "Dedicated support"],
}

export default function PricingCards() {
  const { data } = useSWR("/api/billing/plans", fetcher)

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  const buyPlan = async (planId: string) => {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    })
    const result = await res.json()
    window.location.href = result.url
  }

  // Middle plan is featured
  const featuredIndex = Math.floor(data.length / 2)

  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-4">
        Plans
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((plan: any, i: number) => {
          const featured = i === featuredIndex
          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-6 border transition-all",
                featured
                  ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20"
                  : "bg-card text-card-foreground border-border hover:border-primary/30"
              )}
            >
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-foreground text-primary text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <p className={cn(
                "text-[10px] font-semibold tracking-widest uppercase mb-3",
                featured ? "text-primary-foreground/60" : "text-muted-foreground"
              )}>
                {plan.name}
              </p>

              <div className="mb-2">
                <span className="font-serif text-4xl tracking-tight">
                  ${(plan.priceUSD / 100).toFixed(0)}
                </span>
                <span className={cn("text-sm font-light ml-1", featured ? "text-primary-foreground/60" : "text-muted-foreground")}>
                  / month
                </span>
              </div>

              <div className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md mb-4",
                featured ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary/10 text-primary"
              )}>
                <Zap className="w-3 h-3" />
                {plan.credits.toLocaleString()} credits
              </div>

              <hr className={cn("mb-4", featured ? "border-primary-foreground/20" : "border-border")} />

              <ul className="space-y-2 mb-6">
                {(planFeatures[i] ?? []).map(f => (
                  <li key={f} className={cn(
                    "flex items-center gap-2 text-sm font-light",
                    featured ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", featured ? "text-primary-foreground" : "text-primary")} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  featured
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => buyPlan(plan.id)}
              >
                Buy Now
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
