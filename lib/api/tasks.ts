import { Task } from "../models/task";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data = await res.json();

  // 👇 SAFETY GUARD
  if (!Array.isArray(data)) {
    console.error("Invalid tasks response:", data);
    return [];
  }
  console.log(data)

  return data;
}
