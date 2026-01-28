"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

type Props = {
    open:boolean,
    onOpenChange: (open:boolean) => void,
    onCreated?: ()=>void
}

function NewTaskDialog({open, onOpenChange, onCreated}:Props) {

    const [prompt,setPrompt] = useState<string>("")
    const [loading,setLoading] = useState<boolean>(false)
    const [error,setError] = useState<string|null>()

    async function handleCreate(){
        if(!prompt.trim()){
            setError("Prompt is required")
            return;
        }

        setLoading(false);
        setError(null);

        try{
            const res = await fetch('/api/generate',{
                method:"POST",
                headers:{"Content-type":"Application/json"},
                body:JSON.stringify({
                    prompt,
                    idempotency: `task-${Date.now()}`
                }),
            });

            if(!res.ok){
                const data = await res.json();
                throw new Error(data.error || "Failed to create task")
            }

            setPrompt("");
            onOpenChange(false);
            onCreated?.()
        }catch(err:any){
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent >
            <DialogHeader>
                <DialogTitle>New Task</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                
                <Textarea
                    placeholder="Describe what you want the agents to do..."
                    value={prompt}
                    rows={6}
                    className=" overflow-hidden max-h-[300px]"
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        
                    }}
                />

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </DialogDescription>
            <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Running..." : "Run Task"}
          </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default NewTaskDialog;