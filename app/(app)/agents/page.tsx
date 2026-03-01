import AgentCard from "@/components/agents/AgentCard"
import { AGENT_CATALOG } from "@/lib/agents/agentCatalog"
import { Search, FileText, BarChart2, Type, AlignLeft } from "lucide-react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Map agent keys to icons — adjust keys to match your AGENT_CATALOG
const agentIcons: Record<string, React.ReactNode> = {
  outline: <Search className="w-5 h-5" />,
  writer:  <FileText className="w-5 h-5" />,
  seo:     <BarChart2 className="w-5 h-5" />,
  title:   <Type className="w-5 h-5" />,
  summary: <AlignLeft className="w-5 h-5" />,
}

const agentLabels: Record<string, string> = {
  outline: "Strategy",
  writer:  "Writing",
  seo:     "SEO",
  title:   "Headlines",
  summary: "Summary",
}

export default async function AgentsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) redirect('/login');
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">
          System
        </p>
        <h1 className="font-serif text-3xl tracking-tight text-foreground">
          AI Agent Pipeline
        </h1>
        <p className="text-sm text-muted-foreground font-light mt-2 max-w-xl leading-relaxed">
          Our multi-agent architecture processes your prompt through five specialized
          AI modules in parallel — each focused on one job, streaming results in real-time.
        </p>
      </div>

      {/* Pipeline flow indicator */}
      <div className="flex items-center gap-2 flex-wrap">
        {AGENT_CATALOG.map((agent, i) => (
          <div key={agent.key} className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              {agentLabels[agent.key] ?? agent.title}
            </span>
            {i < AGENT_CATALOG.length - 1 && (
              <span className="text-muted-foreground/30 text-xs">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENT_CATALOG.map((agent) => (
          <AgentCard
            key={agent.key}
            agentKey={agent.key}
            title={agent.title}
            description={agent.description}
            features={agent.features}
            icon={agentIcons[agent.key]}
            label={agentLabels[agent.key]}
          />
        ))}
      </div>
    </div>
  )
}