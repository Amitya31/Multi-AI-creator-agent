export type AgentKey = "outline" | "writer" | "seo" | "title" | "summarizer";

export const AGENT_LABELS: Record<AgentKey, string> = {
  outline: "Outline Agent",
  writer: "Writer Agent",
  seo: "SEO Agent",
  title: "Title Agent",
  summarizer: "Summarizer Agent",
};

export const AGENT_DESCRIPTIONS: Record<AgentKey, string> = {
  outline: "Creates structured outlines",
  writer: "Writes long-form content",
  seo: "Optimizes content for SEO",
  title: "Generates titles",
  summarizer: "Summarizes content",
};
