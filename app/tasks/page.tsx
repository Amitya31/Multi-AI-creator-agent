"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchTasks  } from "@/lib/api/tasks"
import { Task } from "@/lib/models/task"
import { TaskList } from "@/components/task-list"
import { TaskPreview } from "@/components/task-preview"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadTasks() {
      try {
        const data = await fetchTasks()
        if (!mounted) return

        setTasks(data)

        if (!selectedTaskId && data.length > 0) {
          setSelectedTaskId(data[0].id)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadTasks()

    const interval = setInterval(loadTasks, 5000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [selectedTaskId])

  const selectedTask = useMemo(
    () => tasks.find(t => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  )

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading tasks…
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <TaskList
        tasks={tasks}
        selectedTaskId={selectedTaskId ?? undefined}
        onSelect={(task) => setSelectedTaskId(task.id)}
      />

      <TaskPreview task={selectedTask} />
    </div>
  )
}
