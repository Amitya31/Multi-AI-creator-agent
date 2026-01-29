"use client";

import { useParams } from "next/navigation";
import { TaskHeader } from "@/components/task-header";
import PipelineView from "@/components/pipeline-view";
import StepOutput from "@/components/step-output";
import useTaskEvents from "@/lib/hooks/use-task-events";

export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const task = useTaskEvents(taskId);

  if (!task) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading task…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <TaskHeader
        name={`Task ${task.taskId.slice(0, 6)}`}
        status={task.status}
        createdAt={new Date().toISOString()}
      />


      {/* Pipeline */}
      <PipelineView steps={task.steps} />

      {/* Step outputs */}
      <StepOutput steps={task.steps} />

      {/* Final Output (runtime-only) */}
      {task.finalOutput && (
        <div className="border rounded-md p-4 bg-muted">
          <div className="font-medium mb-2">Final Output</div>
          <pre className="text-sm whitespace-pre-wrap">
            {task.finalOutput.text}
          </pre>
        </div>
      )}
    </div>
  );
}
