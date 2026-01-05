"use client"

import { useParams } from "next/navigation"

export default function TaskDetailsPage(){
    const {taskId} = useParams<{taskId:string}>()
    
    return (
        
    )
}