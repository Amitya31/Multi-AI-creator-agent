"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchTasks } from "@/lib/api/tasks";
import { Task } from "@/lib/models/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { redirect, useRouter } from "next/navigation";
import NewTaskDialog from "@/components/new-task-dialog";
import { Plus, ArrowRight, Trash2, Clock, Inbox } from "lucide-react";


// ── helpers ──────────────────────────────────────────────────────────────────

const statusVariant: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  pending:   "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  failed:    "bg-destructive/10 text-destructive border-destructive/20",
  running:   "bg-primary/10 text-primary border-primary/20",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border",
      statusVariant[status] ?? "bg-muted text-muted-foreground border-border"
    )}>
      {status}
    </span>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  

  useEffect(() => {
    
    let mounted = true;
    async function load() {
      try {
        const data = await fetchTasks();
        if (!mounted) return;
        setTasks(data);
        if (data.length > 0) setSelectedTaskId(data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-0 bg-background overflow-hidden">

      {/* ── LEFT: TASK LIST ── */}
      <div className="w-[320px] flex-shrink-0 flex flex-col border-r border-border bg-background">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-0.5">
              Workspace
            </p>
            <h2 className="font-serif text-xl tracking-tight text-foreground">Tasks</h2>
          </div>
          <Button
            size="sm"
            onClick={() => setNewTaskOpen(true)}
            className="h-8 gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </Button>
        </div>

        {/* List */}
        <ScrollArea className="flex-1">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Inbox className="w-8 h-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Create your first task to get started</p>
            </div>
          ) : (
            <div className="py-1">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-border/50 transition-colors hover:bg-muted/50",
                    task.id === selectedTaskId && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-medium text-sm text-foreground leading-snug line-clamp-2 flex-1">
                      {task.name.length > 48 ? task.name.slice(0, 47).trim() + "…" : task.name}
                    </span>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(task.updatedAt).toLocaleString(undefined, {
                      month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── RIGHT: TASK DETAIL ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedTask ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-primary" />
            </div>
            <p className="font-serif text-2xl text-foreground mb-2">No task selected</p>
            <p className="text-sm text-muted-foreground font-light">
              Pick a task from the list to preview its output.
            </p>
          </div>
        ) : (
          <>
            {/* Detail header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-border">
              <div className="flex-1 mr-6">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">
                  Task Preview
                </p>
                <h2 className="font-serif text-2xl tracking-tight text-foreground leading-tight">
                  {selectedTask.name}
                </h2>
              </div>
              <StatusBadge status={selectedTask.status} />
            </div>

            {/* Pipeline badges */}
            {selectedTask.pipeline?.length > 0 && (
              <div className="flex items-center gap-2 px-6 py-3 border-b border-border flex-wrap">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mr-1">
                  Pipeline
                </span>
                {selectedTask.pipeline.map((step) => (
                  <span
                    key={step}
                    className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                  >
                    {step}
                  </span>
                ))}
              </div>
            )}

            {/* Output */}
            <ScrollArea className="flex-1 px-6 py-4">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-foreground bg-muted/40 border border-border rounded-xl p-5">
                {selectedTask.lastOutput || "No output yet."}
              </pre>
            </ScrollArea>

            {/* Actions */}
            <div className="flex items-center gap-2 px-6 py-4 border-t border-border">
              <Button
                onClick={() => router.push(`/tasks/${selectedTask.id}`)}
                className="gap-2 text-sm"
              >
                Open Full Task <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                className="gap-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          </>
        )}
      </div>

      <NewTaskDialog
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        onCreated={async () => {
          const data = await fetchTasks();
          setTasks(data);
          if (data.length > 0) setSelectedTaskId(data[0].id);
        }}
      />
    </div>
  );
}