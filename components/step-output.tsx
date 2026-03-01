import { TaskStep } from "@/lib/models/task-details";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, FileText, Loader2, XCircle } from "lucide-react";

const statusStyles: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  running:   "bg-primary/10 text-primary border-primary/20",
  failed:    "bg-destructive/10 text-destructive border-destructive/20",
  pending:   "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

const statusIcon: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="w-3.5 h-3.5" />,
  running:   <Loader2 className="w-3.5 h-3.5 animate-spin" />,
  failed:    <XCircle className="w-3.5 h-3.5" />,
  pending:   <Clock className="w-3.5 h-3.5" />,
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md border",
      statusStyles[status] ?? "bg-muted text-muted-foreground border-border"
    )}>
      {statusIcon[status]}
      {status}
    </span>
  );
}

export default function StepOutput({steps}:{steps:TaskStep[]}){
    return (
    <div className="px-6 py-4 space-y-3">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-4">
        Step Outputs
      </p>
      {steps.map((step) => (
        <div key={step.step} className="border border-border rounded-xl overflow-hidden">
          {/* step header */}
          <div className={cn(
            "flex items-center justify-between px-4 py-2.5 border-b border-border",
            step.status === "completed" && "bg-green-500/5",
            step.status === "running"   && "bg-primary/5",
            step.status === "failed"    && "bg-destructive/5",
            !["completed","running","failed"].includes(step.status) && "bg-muted/40",
          )}>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{step.step}</span>
            </div>
            <StatusBadge status={step.status} />
          </div>
          {/* step body */}
          <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground leading-relaxed p-4 bg-muted/20 max-h-190 overflow-auto">
            {step.output ?? "No output yet…"}
          </pre>
        </div>
      ))}
    </div>
  );
}
