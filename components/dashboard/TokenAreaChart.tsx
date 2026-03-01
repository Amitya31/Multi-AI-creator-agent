"use client"

import useSWR from "swr"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function TokenAreaChart() {
  const { data } = useSWR("/api/usage/summary", fetcher)

  if (!data) {
    return <div className="h-72 rounded-2xl bg-muted animate-pulse" />
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="mb-5">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
          Usage
        </p>
        <h2 className="font-serif text-xl tracking-tight text-foreground">
          Token Usage Over Time
        </h2>
      </div>

      <ChartContainer
        config={{
          tokens: {
            label: "Tokens",
            color: "var(--chart-2)",
          },
        }}
      >
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-tokens)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--color-tokens)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false} tickLine={false} width={40}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="tokens"
            type="monotone"
            stroke="var(--color-tokens)"
            strokeWidth={2}
            fill="url(#tokenGrad)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
