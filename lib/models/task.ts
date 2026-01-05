export type TaskStatus = "queued" | "running" | "completed" | "failed"

export type Task = {
  id: string
  name: string
  status: TaskStatus
  updatedAt: string
  pipeline: string[]
  lastOutput?: string
}
