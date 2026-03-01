"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Zap, ArrowRight } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function BillingOverview() {
  const { data } = useSWR("/api/usage/summary", fetcher)
  const [loading, setLoading] = useState(false)

  const buyCredits = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: 10000 }),
      })
      const json = await res.json()
      if (json?.url) window.location.href = json.url
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!data) {
    return <div className="h-28 bg-muted animate-pulse rounded-2xl" />
  }

  // Calculate a rough usage percentage for the progress bar
  const total = data.totalCredits ?? 100000
  const remaining = data.remainingCredits ?? 0
  const used = total - remaining
  const pct = Math.min(100, Math.round((used / total) * 100))

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6">
        {/* Left */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
              Current Balance
            </p>
            <p className="font-serif text-4xl tracking-tight text-foreground">
              {remaining.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-light">
              credits remaining · {pct}% used
            </p>
          </div>
        </div>

        {/* Right */}
        <Button
          onClick={buyCredits}
          disabled={loading}
          className="gap-2 sm:self-center"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Redirecting…
            </>
          ) : (
            <>
              Buy 10,000 Credits <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
