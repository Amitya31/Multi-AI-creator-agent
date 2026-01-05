import { Task } from "@/lib/models/task"

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks", { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  const json = await res.json()
  return json.data
}
