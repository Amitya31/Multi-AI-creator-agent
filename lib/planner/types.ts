import { AgentKey } from "@/lib/agents/registry";
import { AgentStepType } from "../agents/prompts";

export type AgentPipelineStep = {
  key: AgentKey;
  type: AgentStepType;
  description?: string;
  options?: Record<string, any>;
};
