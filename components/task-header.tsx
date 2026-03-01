import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils"


type TaskHeaderProps = {
  name: string;
  status: string;
  createdAt: string;
};

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
export function TaskHeader({ name, status, createdAt }: { name: string; status: string; createdAt: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border">
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">
          Task Details
        </p>
        <h1 className="font-serif text-2xl tracking-tight text-foreground">{name}</h1>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          Created {new Date(createdAt).toLocaleString(undefined, {
            month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}