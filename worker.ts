import {Job, Worker} from "bullmq";
import {agentQueue, connection} from "./lib/queue";
import {prisma} from "@/lib/prisma";
import { buildAgentPrompt } from "@/lib/agents/prompts";
import { runAgentWithGemini } from "@/lib/agents/agentHandler";

type RunStepPayload = {
    taskId:string,
    taskResultId:string,
    stepIndex:number,
    pipeline:any[]
}


const worker = new Worker(
    "AgentJobs",
    async (job:Job<RunStepPayload>)=>{
        const {taskId,taskResultId,stepIndex, pipeline} = job.data;
        const tr = await prisma.taskResult.findUnique({where:{id:taskResultId}});
        if(!tr) throw new Error("TaskResult not found");

        if(tr.status === "completed") return;

        await prisma.taskResult.update({ where: {id:taskResultId}, data: {status:"processing"}})

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
        const agentOutput = await runAgentWithGemini(
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
                    model:agentOutput.model,
                    usage:agentOutput.usage  ?? null,
                },
                contentId:content.id,
            }
        })

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
        }else{
            await prisma.task.update({where:{id:taskId}, data:{status:"completed"}});
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
