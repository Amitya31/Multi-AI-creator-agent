"use client"

import useSWR from "swr"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AgentUsageBar() {
  const { data } = useSWR("/api/dashboard/tokens", fetcher)

  if (!data) {
    return <div className="h-72 rounded-2xl bg-muted animate-pulse" />
  }

  const chartData = data.map((row: any) => ({
    agent: row.agent.replaceAll("_", " "),
    tokens: row.tokens,
  }))

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="mb-5">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
          Breakdown
        </p>
        <h2 className="font-serif text-xl tracking-tight text-foreground">
          Agent Token Usage
        </h2>
      </div>

      <ChartContainer
        config={{
          tokens: {
            label: "Tokens",
            color: "var(--chart-1)",
          },
        }}
      >
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
          <XAxis
            dataKey="agent"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false} tickLine={false} width={40}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="tokens" fill="var(--color-tokens)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
