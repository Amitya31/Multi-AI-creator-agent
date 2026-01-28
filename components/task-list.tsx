// app/(app)/tasks/components/task-list.tsx
import { Task } from "@/lib/models/task"
import { TaskItem } from "./task-item"
import { Button } from "@/components/ui/button"

type Props = {
  tasks: Task[]
  selectedTaskId?: string
  onSelect: (task: Task) => void
}

export function TaskList({ tasks, selectedTaskId, onSelect }: Props) {
  return (
    <div className="w-[320px] border bg-background flex flex-col">
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="text-sm font-semibold">Tasks</h2>
        <Button size="sm">+ New</Button>
      </div>

      <div className="flex-1 overflow-auto">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            active={task.id === selectedTaskId}
            onClick={() => onSelect(task)}
          />
        ))}
      </div>
    </div>
  )
}
