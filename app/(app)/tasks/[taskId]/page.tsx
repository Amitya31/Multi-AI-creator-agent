"use client";

import { useParams } from "next/navigation";
import { TaskHeader } from "@/components/task-header";
import PipelineView from "@/components/pipeline-view";
import StepOutput from "@/components/step-output";
import useTaskEvents from "@/lib/hooks/use-task-events";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Loader2 } from "lucide-react";


export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const task = useTaskEvents(taskId);


  if (!task) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading task…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <TaskHeader
        name={`Task ${task.taskId.slice(0, 8)}`}
        status={task.status}
        createdAt={new Date().toISOString()}
      />

      <ScrollArea className="flex-1">
        {/* Pipeline */}
        <PipelineView steps={task.steps} />

        {/* Step outputs */}
        <StepOutput steps={task.steps} />

        {/* Final output */}
        {task.finalOutput && (
          <div className="px-6 py-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              Final Output
            </p>
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-primary/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-medium text-foreground">Result</span>
              </div>
              <pre className="text-sm font-mono whitespace-pre-wrap text-foreground leading-relaxed p-5 bg-muted/20">
                {task.finalOutput.text}
              </pre>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}