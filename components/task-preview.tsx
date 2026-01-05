// app/(app)/tasks/components/task-preview.tsx
import { Task } from "@/lib/models/task"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function TaskPreview({ task }: { task: Task | null }) {
  if (!task) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a task
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-4 overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">{task.name}</h1>
        <Badge>{task.status}</Badge>
      </div>

      <div className="flex gap-2">
        {task.pipeline.map(step => (
          <Badge key={step} variant="secondary">
            {step}
          </Badge>
        ))}
      </div>

      <div className="border rounded-md p-4 text-sm bg-muted">
        {task.lastOutput || "No output yet"}
      </div>

      <div className="flex gap-2">
        <Button variant="outline">Open Full Task</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  )
}
