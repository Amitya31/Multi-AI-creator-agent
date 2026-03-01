import { TaskStep } from "@/lib/models/task-details";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function PipelineView({ steps }: { steps: TaskStep[] }) {
  return (
    <div className="px-6 py-4 border-b border-border">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
        Pipeline
      </p>
      <div className="flex items-center gap-1 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.step} className="flex items-center gap-1">
            <span className={cn(
              "text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md border transition-colors",
              step.status === "completed" && "bg-green-500/10 text-green-600 border-green-500/20",
              step.status === "running"   && "bg-primary/10 text-primary border-primary/20",
              step.status === "failed"    && "bg-destructive/10 text-destructive border-destructive/20",
              !["completed","running","failed"].includes(step.status) && "bg-muted text-muted-foreground border-border"
            )}>
              {step.step}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}