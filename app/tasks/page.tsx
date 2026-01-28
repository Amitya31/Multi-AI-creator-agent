"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchTasks } from "@/lib/api/tasks";
import { Task } from "@/lib/models/task";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import NewTaskDialog from "@/components/new-task-dialog";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskOpen,setNewTaskOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchTasks();
        if (!mounted) return;

        setTasks(data);
        if (data.length > 0) {
          setSelectedTaskId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading tasks…
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 p-4">
      {/* LEFT: TASK LIST */}
      <Card className="w-[360px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Tasks</CardTitle>
          <Button size="sm" onClick={()=>setNewTaskOpen(true)}>+ New</Button>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-140px)]">
            {tasks.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No tasks yet
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={cn(
                    "cursor-pointer px-4 py-3 border-b hover:bg-muted",
                    task.id === selectedTaskId && "bg-muted"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm truncate">
                      {task.name}
                    </span>
                    
                  </div>
                  <div className="flex text-xs gap-x-2 text-muted-foreground">
                    {new Date(task.updatedAt).toLocaleString()}
                    <Badge variant="default">{task.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* RIGHT: TASK PREVIEW */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-sm">Preview</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!selectedTask ? (
            <div className="text-muted-foreground">
              Select a task
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{selectedTask.name}</h2>
                <Badge>{selectedTask.status}</Badge>
              </div>

              <div className="flex gap-2">
                {selectedTask.pipeline.map((step) => (
                  <Badge key={step} variant="outline">
                    {step}
                  </Badge>
                ))}
              </div>

              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md max-h-[60vh] overflow-auto">
                {selectedTask.lastOutput || "No output yet"}
              </pre>

              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    router.push(`/tasks/${selectedTask.id}`)
                  }
                >
                  Open Full Task
                </Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <NewTaskDialog 
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        onCreated={async ()=> {
          const data = await fetchTasks();
          setTasks(data);
          if(data.length>0){
            setSelectedTaskId(data[0].id)
          }
        }}
      />
    </div>
    
  );
}
