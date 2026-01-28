import { TaskDetails } from "../models/task-details";

export async function fetchTaskDetails(taskId:string): Promise<TaskDetails>{
    const res = await fetch(`/api/tasks/${taskId}`,{cache:"no-store"});
    if(!res.ok) throw new Error ("Failed to fetch task details");
    return res.json();
}