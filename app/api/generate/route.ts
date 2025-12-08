import { NextResponse,NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { AgentPipelineStep, decideAgentsForPromopt } from "@/lib/planner";
import { agentQueue } from "@/lib/queue";


const BodySchema = z.object({
    prompt:z.string().min(1),
    userId:z.string().optional(),
    options:z.record(z.string(),z.any()).optional(),
    idempotencyKey:z.string().optional()
})

export async function POST (request:Request){
try{
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);

    if(!parsed.success){
        return NextResponse.json({error: parsed.error},{status:400});
    }
    // need to create validator later
    const {prompt,userId,options,idempotencyKey} = parsed.data;

    //error handling required
    if(!prompt){
        return NextResponse.json({error:"Prompt is required"},{status:400});
    }

    if(!idempotencyKey){
        const existing = await prisma.task.findFirst({where: {idempotencyKey}});
        if(existing) return NextResponse.json({message:"Task already created",taskId:existing.id},{status:200})
    }

    const pipeline:AgentPipelineStep[] = decideAgentsForPromopt(prompt,options);
    if(!pipeline.length) return NextResponse.json({error:"No agents selected"},{status:400});

    const result = await prisma.$transaction(async (tx)=>{
        const task = await tx.task.create({
            data:{
                type: pipeline.length > 1 ? "MULTI_AGENT_PIPELINE":pipeline[0].type, 
                payload:{prompt,options},
                status:"pending",
                idempotencyKey:idempotencyKey??null,
            }
        })

        const taskResultRows = [];
        for(let i = 0 ; i<pipeline.length;i++){
            const step = pipeline[i];
            const tr = await tx.taskResult.create({
                data:{
                    taskId:task.id,
                    agentId: step.agentId ?? null,
                    type:step.type,
                    status:"pending",
                    order:i+1,
                }
            });
            taskResultRows.push(tr);
        }
        return {task, taskResultRows};
    });

    const first = result.taskResultRows[0];
    //enqueue the job for processing
    await agentQueue.add("run-step",{
        taskId:result.task.id,
        taskResultId: first.id,
        stepIndex: 0,
        pipeline
    },{attempts:3,backoff:{type:"exponential",delay:1000}});


    return NextResponse.json({message:"Task created",taskId:result.task.id});
}catch(err){
    console.error("Generate API Error:",err);
    return NextResponse.json({error:"Internal Server Error"},{status:500});
}
}