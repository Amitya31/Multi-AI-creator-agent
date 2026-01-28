import { TaskStep } from "@/lib/models/task-details";
import { cn } from "@/lib/utils";

export default function PipelineView({steps}:{steps:TaskStep[]}){
    return (
        <div className="flex gap-3">
            {steps.map(step=>(
                <div key={step.step} className={cn(
                    "px-3 py-2 rounded-md text-sm border",
                    step.status==="completed" && "bg-green-100 border-green-400",
                    step.status==="running" && "bg-blue-100 border-blue-400",
                    step.status==="failed" && "bg-red-100 border-red-400"
                )}>
                    {step.step}
                </div>
            ))} 
        </div>
    )
}