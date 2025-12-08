export type AgentKey = "outline" | "writer" | "seo" | "title" | "summarizer";

export type AgentConfig = {
    id:string;
    label:string;
    description: string;
};

export const AGENTS: Record<AgentKey, AgentConfig> = {
    outline:{
        id: "agent_outline_v1",
        label:"Outline Agent",
        description: "Creates a structured outline for a article, blog, script, or video"
    },
    writer: {
        id: "agent_writer_v1",
        label: "Writer Agent",
        description: "Writer full content based on an outline or topic.",
    },
    seo:{
        id: "agent_seo_v1",
        label:"SEO Agent",
        description: "Improves content SEO: keywords, headings, meta description."
    },
    title: {
        id:"agent_title_v1",
        label: "Title Agent",
        description:"Creates catchy, optimized titles for the content.",
    },
    summarizer:{
        id: "agent_summarizer_v1",
        label: "Summarizer Agent",
        description:"Summarizes content into shorter forms: TL;DR, bullets, etc."
    },
};

export type AgentPipelineStep = {
    key:AgentKey;
    type:string;
    agentId: string;
    description?: string;
    options?: Record<string, any>;
}