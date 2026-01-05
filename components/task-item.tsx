import { cn } from "@/lib/utils"
import { Task } from "@/lib/models/task"

export function TaskItem({
  task,
  active,
  onClick
}: {
  task: Task
  active?: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer px-3 py-2 text-sm border-b hover:bg-muted",
        active && "bg-muted"
      )}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium truncate">{task.name}</span>
        <span
          className={cn(
            "text-xs",
            task.status === "running" && "text-blue-500",
            task.status === "completed" && "text-green-500",
            task.status === "failed" && "text-red-500"
          )}
        >
          {task.status}
        </span>
      </div>

      <div className="text-xs text-muted-foreground">
        Updated {task.updatedAt}
      </div>
    </div>
  )
}
