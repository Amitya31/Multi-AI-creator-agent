"use client"

import useSWR from "swr"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then(r => r.json())


const statusStyles: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  running:   "bg-primary/10 text-primary border-primary/20",
  failed:    "bg-destructive/10 text-destructive border-destructive/20",
  pending:   "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
}

export default function RecentTasks() {
  const { data } = useSWR("/api/dashboard/recent-tasks", fetcher)

  if (!data) {
    return <div className="h-56 rounded-2xl bg-muted animate-pulse" />
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
            Activity
          </p>
          <h2 className="font-serif text-xl tracking-tight text-foreground">Recent Tasks</h2>
        </div>
        <Link
          href="/tasks"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1 font-light">
            Create a task to see your activity here.
          </p>
        </div>
      ) : (
        <div>
          {data.map((t: any, i: number) => (
            <Link
              key={t.id}
              href={`/tasks/${t.id}`}
              className={cn(
                "flex items-center justify-between px-6 py-3.5 hover:bg-muted/40 transition-colors",
                i < data.length - 1 && "border-b border-border/50"
              )}
            >
              {/* Left */}
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-foreground truncate">
                  {t.name.length > 60 ? t.name.slice(0, 59) + "…" : t.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {new Date(t.createdAt).toLocaleString(undefined, {
                    month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {t.tokens?.toLocaleString()}
                </span>
                <span className={cn(
                  "text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border",
                  statusStyles[t.status] ?? "bg-muted text-muted-foreground border-border"
                )}>
                  {t.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}