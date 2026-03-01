"use client"

import useSWR from "swr"
import { CheckCircle2, XCircle, Zap, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const cards = [
  {
    key: "totalTasks",
    label: "Total Tasks",
    icon: ListTodo,
    iconClass: "bg-primary/10 text-primary",
  },
  {
    key: "completedTasks",
    label: "Completed",
    icon: CheckCircle2,
    iconClass: "bg-green-500/10 text-green-600",
  },
  {
    key: "failedTasks",
    label: "Failed",
    icon: XCircle,
    iconClass: "bg-destructive/10 text-destructive",
  },
  {
    key: "remainingCredits",
    label: "Credits Left",
    icon: Zap,
    iconClass: "bg-primary/10 text-primary",
    hint: "Tokens available",
  },
]

export default function OverviewCards() {
  const { data, isLoading } = useSWR("/api/dashboard/overview", fetcher)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, iconClass, hint }) => (
        <div
          key={key}
          className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3"
        >
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconClass)}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
              {label}
            </p>
            <p className="font-serif text-3xl tracking-tight text-foreground">
              {(data?.[key] ?? 0).toLocaleString()}
            </p>
            {hint && (
              <p className="text-[11px] text-muted-foreground/60 font-light mt-0.5">{hint}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
