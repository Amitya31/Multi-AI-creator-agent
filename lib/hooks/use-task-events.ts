"use client";

import { useEffect, useState } from "react";
import { fetchTaskDetails } from "@/lib/api/task-details";
import { RunTimeTaskState } from "@/lib/state/task-runtime";

type UiStatus = "pending" | "running" | "completed" | "failed";

function mapTaskStatus(status: string): UiStatus {
  if (status === "queued" || status === "pending") return "pending";
  if (status === "processing" || status === "running") return "running";
  if (status === "completed") return "completed";
  return "failed";
}

export default function useTaskEvents(taskId: string | null) {
  const [state, setState] = useState<RunTimeTaskState | null>(null);

  useEffect(() => {
    if (!taskId) return;
    const id = taskId;
    let mounted = true;


    async function hydrate() {
      const data = await fetchTaskDetails(id);
      if (!mounted) return;

      setState({
        taskId:id,
        status: mapTaskStatus(data.status),
        steps: data.steps.map((s) => ({
          step: s.step,
          status: mapTaskStatus(s.status),
          output: s.output ?? null,
        })),
      });
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, [taskId]);


  useEffect(() => {
    if (!taskId) return;

    const es = new EventSource(`/api/task/${taskId}/events`);

    es.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      setState((prev) => {
        if (!prev) return prev;

        // Step update
        if (payload.type === "STEP_UPDATED") {
          const steps = [...prev.steps];
          const idx = payload.stepIndex;

          if (steps[idx]) {
            steps[idx] = {
              ...steps[idx],
              status: mapTaskStatus(payload.status),
            };
          }

          return {
            ...prev,
            status: "running",
            steps,
          };
        }

        if (payload.type === "STEP_FAILED") {
          return {
            ...prev,
            status: "failed",
            error: payload.message,
          };
        }

        // Final output
        if (payload.type === "FINAL_OUTPUT") {
          return {
            ...prev,
            status: "completed",
            finalOutput: payload.content,
          };
        }

        // Error
        if (payload.type === "ERROR") {
          return {
            ...prev,
            status: "failed",
          };
        }

        return prev;
      });
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [taskId]);

  return state;
}
