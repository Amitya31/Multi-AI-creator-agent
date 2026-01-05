import {TaskStatus} from "./task";

export type TaskStepStatus = "pending" | "running" | "completed" | "failed"

export type TaskStep = {
    step:string,
    status: TaskStepStatus,
    output?: string | null,
}

export type TaskDetails = {
    id: string, 
    name:string,
    status: TaskStatus,
    pipeline:string[],
    currentStep?:string,
    steps: TaskStep[],
    createdAt:string,
}