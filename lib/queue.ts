import "dotenv/config";
import IORedis from "ioredis";
import {Queue} from "bullmq";

const redisuri = process.env.REDIS_URL;

if(!redisuri) {
    throw new Error("REDIS_URL is not defined in environment variables");
}


export const connection = new IORedis(redisuri,{
    tls:{},
    maxRetriesPerRequest:null,
    enableReadyCheck:true,
});

//create a queue for agent tasks
export const agentQueue = new Queue("AgentJobs",{
    connection,
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:5000
        },
        removeOnComplete:100,
        removeOnFail:1000,
    }
})

