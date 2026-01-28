import { TaskStepStatus } from "@/lib/models/task-details";

export type RuntimeStep = {
    step: string,
    status: TaskStepStatus,
    output?: string|null
};

export type RunTimeTaskState = {
    taskId: string,
    status: "pending" | "running" | "completed" | "failed",
    steps: RuntimeStep[],
    finalOutput? :{
        text: string,
        model?: string | null,
        usage?: any,
    }
}