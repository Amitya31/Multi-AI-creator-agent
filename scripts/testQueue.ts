import "dotenv/config"
import {agentQueue} from "../lib/queue";
import {prisma} from "../lib/prisma";

async function main() {
    const pipeline = [
        {type:"CREATE_OUTLINE",agentId:"agent_outline_v1",options:{sections:3}},
        {type:"GENERATE_TEXT",agentId:"agent_writer_v1", tone:"friendly"},
    ];

    const result = await prisma.$transaction(async (tx)=>{
        const task = await tx.task.create({
            data :{
                type: "MULTI_AGENT_PIPELINE",
                payload: {prompt:"Write a shor paragraph about multi-agent sysytems"},
                status:"pending",
            },
        });

        const taskResultRows = [];
        for(let i=0; i<pipeline.length;i++){
            const tr = await tx.taskResult.create({
                data:{
                    taskId:task.id,
                    agentId: pipeline[i].agentId,
                    type:pipeline[i].type,
                    status: "pending",
                    order:i+1,
                }
            });
            taskResultRows.push(tr)
        }

        return {task, taskResultRows};                                                
    
    });

    const first = result.taskResultRows[0];
    await agentQueue.add("run-step",{
        taskId:result.task.id,
        taskResultId: first.id,
        stepIndex: 0,
        pipeline
    });

    console.log("✅ Enqueued task:", result.task.id);
}

main().catch((e)=>{
    console.error(e);
    process.exit(1);
}).finally(async ()=>{
    await prisma.$disconnect();
})