import { TaskStep } from "@/lib/models/task-details";

export default function StepOutput({steps}:{steps:TaskStep[]}){
    return (
        <div className="space-y-4">
            {steps.map(step=>(
                <div key={step.step} className="border rounded-md p-4">
                    <div className="font-medium mb-2">{step.step}</div>
                    <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                        {step.output ?? "No output yet"}
                    </pre>
                </div>
            ))}
        </div>
    )
}