import {Job, Worker} from "bullmq";
import {agentQueue, connection} from "./lib/queue";
import {prisma} from "@/lib/prisma";
import { buildAgentPrompt } from "@/lib/agents/prompts";
import { runAgent } from "@/lib/agents/agentHandler";
import {  ResolvedPipelineStep } from "@/lib/agents/types";

type RunStepPayload = {
  taskId: string;
  taskResultId: string;
  stepIndex: number;
  pipeline: ResolvedPipelineStep[]; // ✅
};

function publishTaskEvent(taskId:string,payload:any){
    const channel = `task-events:${taskId}`;
    connection.publish(channel,JSON.stringify(payload));
}

const worker = new Worker(
    "AgentJobs",
    async (job:Job<RunStepPayload>)=>{
        const {taskId,taskResultId,stepIndex, pipeline} = job.data;
        const lock = await prisma.taskResult.updateMany({
            where: {
                id: taskResultId,
                status: "pending",
            },
            data: {
                status: "processing",
            },
        });

            if (lock.count === 0) {
            return;
        }
        publishTaskEvent(taskId, {
            type: "STEP_UPDATED",
            taskId,
            taskResultId,
            status:"processing",
            stepIndex
        });

        let input:any = null;
        if(stepIndex===0){
            const task = await prisma.task.findUnique({where:{id:taskId}});
            input = task?.payload;
        }else{
            const prev = await prisma.taskResult.findFirst({
                where:{taskId,order:stepIndex},
                orderBy:{order:"desc"}
            });
            input = prev?.output??prev?.contentId;
        }

        const stepSpec = pipeline[stepIndex];

        const promptForGemini = buildAgentPrompt({
            stepType:stepSpec.type,
            agentId: stepSpec.agentId,
            input,
            options:stepSpec.options,
        })

        try{
            const agentOutput = await runAgent(
            stepSpec.agentId,
            promptForGemini,
            stepSpec.options
            );

            const content = await prisma.content.create({
                data:{
                    body: agentOutput.text,
                    source: "agent",
                    metadata: {
                        type:stepSpec.type,
                        agentId:stepSpec.agentId,
                        model: agentOutput.model,
                        usage: agentOutput.usage ?? null,
                    },
                },
            });                 

            await prisma.taskResult.update({
                where:{id:taskResultId},
                data:{
                    status:"completed",
                    output:{
                        text:agentOutput.text,
                    },
                    model: agentOutput.model,

                    promptTokens: agentOutput.usage?.promptTokens ?? null,
                    completionTokens: agentOutput.usage?.completionTokens ?? null,
                    totalTokens: agentOutput.usage?.totalTokens ?? null,
                    contentId:content.id,
                }
            })

        }catch(err){
              const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            await prisma.taskResult.update({
                where: { id: taskResultId },
                data: {
                status: "failed",
                errorMessage,                
                },
            });

            await prisma.task.update({
                where: { id: taskId },
                data: { status: "failed" },
            });


            publishTaskEvent(taskId,{
                type: "STEP_FAILED",
                taskId,
                stepIndex,
                errorMessage,
            })
              
            throw err; 
        }

        const nextIndex = stepIndex+1;
        if(pipeline[nextIndex]){
            const nextTR= await prisma.taskResult.findFirst({
                where:{taskId,order:nextIndex+1}
            });
            if(!nextTR) {
                const created = await prisma.taskResult.create({
                    data:{
                        taskId, 
                        agentId:pipeline[nextIndex].agentId, 
                        type:pipeline[nextIndex].type,
                        status:"pending",
                        order:nextIndex+1, 
                    }
                });
                await agentQueue.add("run-step",{
                    taskId,
                    taskResultId:created.id,
                    stepIndex: nextIndex,
                    pipeline,
                });
            }else{
                await agentQueue.add("run-step",{
                    taskId,
                    taskResultId:nextTR.id,
                    stepIndex: nextIndex,
                    pipeline,
                });
            }
        }else {
            await prisma.task.update({
                where: { id: taskId },
                data: { status: "completed" },
            });

            const finalResult = await prisma.taskResult.findFirst({
                where: { taskId },
                orderBy: { order: "desc" },
            });

            let text = "";
            let model = null;
            let usage = null;

            if (finalResult?.contentId) {
                const content = await prisma.content.findUnique({
                where: { id: finalResult.contentId },
                });
                text = content?.body ?? "";
            }

            if (
                finalResult?.output &&
                typeof finalResult.output === "object" &&
                finalResult.output !== null
            ) {
                const out = finalResult.output as {
                text?: string;
                model?: string;
                usage?: any;
                };
                model = out.model ?? null;
                usage = out.usage ?? null;
                if (!text) text = out.text ?? "";
            }

            const usageAgg = await prisma.taskResult.aggregate({
            where: { taskId },
            _sum: { totalTokens: true },
            });


            const totalTokensUsed = usageAgg._sum.totalTokens ?? 0;

            const task = await prisma.task.findUnique({ where: { id: taskId } });

            if (!task?.billed && totalTokensUsed > 0) {
            await prisma.task.update({
                where: { id: taskId },
                data: {
                billed: true,
                user: {
                    update: {
                    credits: {
                        decrement: totalTokensUsed,
                    },
                    },
                },
                },
            });
            }

            publishTaskEvent(taskId, {
                type: "FINAL_OUTPUT",
                taskId,

                content: {
                text,
                model,
                usage,
                },
            });

        }
    },
    {connection}
);

worker.on("completed",(job)=>{
    console.log(`[worker] job ${job.id} completed`)
})

worker.on("failed",(job,err)=>{
    console.error(`[worker] job ${job?.id} failed:`,err)
})

console.log("[worker] started")
