// import {v4 as uuid} from 'uuid';

// const JOBS = {};
// const SUBSCRIBERS = {};
// const TASKS = {};

// function timestamp(){
//     return new Date().toString()
// }
// function emit(jobId, event){
//     if(!JOBS[jobId]) return;
//     JOBS[jobId].timelines.push({timestamp:timestamp(),...event});

//     const subs = SUBSCRIBERS[jobId] || [];

//     const payload = JSON.stringify(event);
//     subs.forEach(res => {
//         try{
//             res.write(`data: payload\n\n`);
//         }catch(e){

//         }
//     });


// }
// function subscribeSSE(jobId, res){
//     if(!SUBSCRIBERS)
// }