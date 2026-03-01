"use client"

import { CheckCircle2 } from "lucide-react"

export default function AgentCard({
  title,
  description,
  features,
  icon,
  label,
}: {
  agentKey: string
  title: string
  description: string
  features: string[]
  icon?: React.ReactNode
  label?: string
}) {
  return (
    <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all cursor-default">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        {label && (
          <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            {label}
          </span>
        )}
      </div>

      {/* Title + description */}
      <h2 className="font-serif text-xl tracking-tight text-foreground mb-2">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">
        {description}
      </p>

      {/* Divider */}
      <div className="border-t border-border mb-4" />

      {/* Features */}
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground font-light">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}