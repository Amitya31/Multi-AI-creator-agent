"use client"
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, FileText, BarChart2, Type, AlignLeft, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {Button } from "@/components/ui/button";
// ── DATA ──────────────────────────────────────────────────────────────────────

const agents = [
  {
    icon: <Search className="w-5 h-5 text-primary" />,
    badge: "Strategy",
    badgeClass: "bg-primary/10 text-primary",
    name: "Outline Agent",
    description:
      "Builds a hierarchical content structure — main title, 5–7 sections, and 2–4 bullet points each — before a single word is written.",
    output: "Structured outline · logical flow · section coverage",
  },
  {
    icon: <FileText className="w-5 h-5 text-primary" />,
    badge: "Writing",
    badgeClass: "bg-primary/10 text-primary",
    name: "Content Agent",
    description:
      "Takes the outline and writes a full article — headings, subheadings, smooth transitions, and concrete examples. No bullet-only walls of text.",
    output: "Full article · configurable tone & style",
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-primary" />,
    badge: "SEO",
    badgeClass: "bg-primary/10 text-primary",
    name: "SEO Agent",
    description:
      "Optimizes your article for search engines — refines headings, suggests 5–10 keywords, and writes a meta description under 160 characters.",
    output: "Keywords · meta description · heading improvements",
  },
  {
    icon: <Type className="w-5 h-5 text-primary" />,
    badge: "Headlines",
    badgeClass: "bg-primary/10 text-primary",
    name: "Title Agent",
    description:
      "Generates 5 catchy, SEO-friendly title variants — all under 60 characters, compelling without crossing into clickbait.",
    output: "5 ranked title options · 60-char limit enforced",
  },
  {
    icon: <AlignLeft className="w-5 h-5 text-primary" />,
    badge: "Summary",
    badgeClass: "bg-primary/10 text-primary",
    name: "Summary Agent",
    description:
      "Condenses your full article into short, medium, or long summaries — perfect for newsletters, social captions, or article previews.",
    output: "Short / medium / long summary variants",
  },
];

const steps = [
  {
    num: "01",
    icon: "✍️",
    title: "Write your prompt",
    description:
      "Describe your topic, audience, tone, and style. The more context you give, the sharper every agent output becomes.",
  },
  {
    num: "02",
    icon: "⚡",
    title: "Agents run in parallel",
    description:
      "Five specialized agents spin up simultaneously via BullMQ queues — streaming results to you in real-time over SSE.",
  },
  {
    num: "03",
    icon: "📦",
    title: "Publish-ready content",
    description:
      "Receive a full article, SEO headings, title variants, and a summary — billed transparently by credits consumed.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$9",
    credits: "500,000 credits / mo",
    description: "For individual creators getting started with AI-assisted publishing.",
    features: [
      "All 5 AI agents included",
      "Real-time SSE streaming",
      "Credit usage dashboard",
      "Per-task token breakdown",
      "Credits roll over monthly",
    ],
    cta: "Start for Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    credits: "2,000,000 credits / mo",
    description: "For serious creators publishing multiple articles every week.",
    features: [
      "Everything in Starter",
      "Priority queue processing",
      "Custom tone & style config",
      "Billing ledger CSV export",
      "2M credits per month",
    ],
    cta: "Get Pro",
    featured: true,
  },
  {
    name: "Scale",
    price: "$79",
    credits: "Unlimited credits",
    description: "For agencies and teams producing high-volume content at scale.",
    features: [
      "Everything in Pro",
      "Unlimited credits",
      "Multi-seat team access",
      "Stripe billing portal",
      "Dedicated support",
    ],
    cta: "Contact Us",
    featured: false,
  },
];

const testimonials = [
  {
    stars: 5,
    quote:
      "I went from publishing once a week to four times. The outline agent alone saves me two hours per article.",
    initials: "SJ",
    name: "Sara J.",
    role: "Tech Newsletter · 12K subscribers",
  },
  {
    stars: 5,
    quote:
      "The SEO agent replaced my entire keyword research workflow. My articles now consistently rank on page one.",
    initials: "MK",
    name: "Marcus K.",
    role: "SaaS Blogger · 30K monthly readers",
  },
  {
    stars: 5,
    quote:
      "Credit-based billing is so fair. I only pay for what I actually generate — no wasted flat-rate subscriptions.",
    initials: "AL",
    name: "Aiko L.",
    role: "Freelance Content Strategist",
  },
];

const terminalRows = [
  { tag: "Outline", tagClass: "bg-amber-500/20 text-amber-400",   text: "Structuring 6 main sections with bullet points...", live: true },
  { tag: "Writer",  tagClass: "bg-purple-500/20 text-purple-400", text: "Drafting full paragraphs with smooth transitions...", live: true },
  { tag: "SEO",     tagClass: "bg-green-500/20 text-green-400",   text: "Optimizing headings · keywords · meta description...", live: false },
  { tag: "Title",   tagClass: "bg-blue-500/20 text-blue-400",     text: "5 catchy SEO-friendly titles generated and ranked...", live: false },
  { tag: "Summary", tagClass: "bg-orange-500/20 text-orange-400", text: "Condensing article into 2-sentence abstract...", live: false },
];


export default function LandingPage() {
  const { theme,setTheme } = useTheme()
  return (
    <div className="bg-background text-foreground overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] py-4 bg-background/90 backdrop-blur-md border-b border-border">
        <Link href="/" className="font-serif text-2xl tracking-tight text-foreground">
          Content<em className="italic text-primary not-italic">Forge</em>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="#how"     className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
          <Link href="#agents"  className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">Agents</Link>
          <Link href="#pricing" className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                System
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Start for Free
          </Link>
        </div>
      </nav>

      <section className="min-h-screen flex items-center justify-center text-center px-[5vw] pt-28 pb-16 bg-muted/30 relative overflow-hidden">
        {/* ambient glow — uses primary color so it adapts to theme */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_700px_500px_at_60%_20%,hsl(var(--primary)/0.08),transparent)]" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            Multi-Agent AI Content Studio
          </div>

          <h1 className="font-serif text-5xl md:text-7xl leading-[1.06] tracking-tight text-foreground mb-6">
            Grow your audience with{" "}
            <em className="italic text-primary">AI agents</em>{" "}
            that write like you
          </h1>

          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md mx-auto mb-10">
            One prompt. Five specialized agents. Full articles, SEO, titles, and summaries — streaming live to your dashboard.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/register" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              See how it works
            </Link>
          </div>

          <div className="mt-14 rounded-2xl overflow-hidden shadow-2xl text-left ring-1 ring-border">
            <div className="bg-zinc-800 px-5 py-3 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-zinc-500">contentforge — generation in progress</span>
            </div>
            <div className="bg-zinc-950 p-6">
              <p className="text-xs text-zinc-500 font-mono mb-5">
                <span className="text-amber-400">→ prompt:</span>{" "}
                "Write a complete SEO article on productivity tips for remote workers"
              </p>
              <div className="flex flex-col gap-2">
                {terminalRows.map((row) => (
                  <div
                    key={row.tag}
                    className="grid grid-cols-[110px_1fr_72px] items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                  >
                    <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded text-center ${row.tagClass}`}>
                      {row.tag}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono truncate">{row.text}</span>
                    {row.live ? (
                      <span className="flex items-center justify-end gap-1.5 text-[10px] text-green-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        live
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-600 text-right">✓ done</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-[5vw] py-6 border-b border-border text-center">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/40 mb-4">
          Used by creators publishing on
        </p>
        <div className="flex justify-center items-center gap-10 flex-wrap">
          {["Substack", "Medium", "Ghost", "Hashnode", "Beehiiv"].map((b) => (
            <span key={b} className="font-serif text-base text-muted-foreground/30">{b}</span>
          ))}
        </div>
      </div>

      <section id="how" className="px-[5vw] py-24 bg-background">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-3">How it works</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mb-4">
            One prompt, <em className="italic text-primary">five outputs</em>
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
            ContentForge dispatches specialized AI agents in parallel — each focused on one job, all working at once.
          </p>
        </div>

        <div className="grid md:grid-cols-3 border border-border rounded-2xl overflow-hidden max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`p-10 relative bg-card ${
                i < steps.length - 1 ? "md:border-r border-border border-b md:border-b-0" : ""
              }`}
            >
              <div className="absolute top-8 right-8 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                {step.icon}
              </div>
              <span className="font-serif text-6xl text-muted/50 block mb-5 select-none">{step.num}</span>
              <h3 className="font-semibold text-card-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="agents" className="px-[5vw] py-24 bg-muted/30">
        <div className="mb-14">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-3">The Agents</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mb-3">
            Five specialists, <em className="italic text-primary">one pipeline</em>
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md">
            Each agent is a fine-tuned expert. They collaborate on your prompt and never duplicate work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {agent.icon}
                </div>
                <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded ${agent.badgeClass}`}>
                  {agent.badge}
                </span>
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">{agent.name}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">{agent.description}</p>
              <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                Output:{" "}
                <span className="text-foreground font-medium">{agent.output}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="px-[5vw] py-24 bg-background">
        <div className="text-center mb-6">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-3">Pricing</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mb-4">
            Pay for what you <em className="italic text-primary">actually use</em>
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
            Credits are consumed per agent run based on token usage. Every generation is tracked transparently in your billing dashboard.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-10">
          New accounts start with{" "}
          <span className="text-primary font-medium">100,000 free credits</span> — no credit card required.
        </p>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border transition-all ${
                plan.featured
                  ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20"
                  : "bg-card text-card-foreground border-border hover:border-primary/30"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-foreground text-primary text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <p className={`text-[10px] font-semibold tracking-widest uppercase mb-4 ${plan.featured ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {plan.name}
              </p>

              <div>
                <span className="font-serif text-5xl tracking-tight">
                  {plan.price}
                </span>
                <span className={`text-sm font-light ml-1 ${plan.featured ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  / month
                </span>
              </div>

              <div className={`inline-flex items-center gap-1.5 mt-3 mb-4 text-xs font-medium px-2.5 py-1 rounded-md ${
                plan.featured ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary/10 text-primary"
              }`}>
                <Zap className="w-3 h-3" /> {plan.credits}
              </div>

              <p className={`text-sm font-light leading-relaxed mb-6 ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <hr className={`mb-6 ${plan.featured ? "border-primary-foreground/20" : "border-border"}`} />

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2.5 text-sm font-light ${
                      plan.featured ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.featured ? "text-primary-foreground" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                  plan.featured
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-[5vw] py-24 bg-muted/30">
        <div className="text-center mb-14">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-3">Testimonials</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground">
            Creators love <em className="italic text-primary">ContentForge</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-6">
              <p className="text-primary tracking-widest text-sm mb-4">{"★".repeat(t.stars)}</p>
              <p className="text-sm text-muted-foreground font-light leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-light">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      {/* Inverted section: uses foreground as bg, background as text */}
      <section className="px-[5vw] py-28 bg-foreground text-center">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-4">
          Get Started Today
        </p>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight text-background leading-tight mb-5">
          Your next article starts<br />with a{" "}
          <em className="italic text-primary">single prompt</em>
        </h2>
        <p className="text-sm text-background/50 font-light leading-relaxed max-w-md mx-auto mb-10">
          Join creators who ship more content, rank higher, and spend less time staring at blank pages.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-sm font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-primary/30 hover:shadow-xl transition-all"
        >
          Start for Free <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-4 text-xs text-background/30">
          New accounts get{" "}
          <span className="text-primary font-medium">100,000 free credits</span>. No credit card required.
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-[5vw] py-6 bg-foreground border-t border-background/10 flex items-center justify-between flex-wrap gap-3">
        <span className="font-serif text-background/40">
          Content<em className="italic text-background/30">Forge</em>
        </span>
        <span className="text-xs text-background/20">© 2025 ContentForge. All rights reserved.</span>
      </footer>

    </div>
  );
}