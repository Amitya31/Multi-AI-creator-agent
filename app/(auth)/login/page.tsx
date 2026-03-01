/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api/auth";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.error ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── LEFT PANEL — branding ── */}
      <div className="hidden lg:flex w-1/2 bg-foreground flex-col justify-between p-12">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl tracking-tight text-background/80">
          Content<em className="italic text-primary">Forge</em>
        </Link>

        {/* Quote */}
        <div>
          <p className="font-serif text-3xl text-background/90 leading-snug tracking-tight mb-6">
            "One prompt.<br />
            <em className="italic text-primary">Five agents.</em><br />
            Publish-ready content."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              SJ
            </div>
            <div>
              <p className="text-sm font-medium text-background/70">Sara J.</p>
              <p className="text-xs text-background/30">Tech Newsletter · 12K subscribers</p>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex gap-2">
          {["Outline", "Writer", "SEO", "Title", "Summary"].map((tag) => (
            <span key={tag} className="text-[10px] font-semibold tracking-wide uppercase px-2 py-1 rounded bg-background/5 text-background/30">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden font-serif text-2xl tracking-tight text-foreground mb-10">
          Content<em className="italic text-primary">Forge</em>
        </Link>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-2">
              Welcome back
            </p>
            <h1 className="font-serif text-4xl tracking-tight text-foreground">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-light">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                Register for free
              </Link>
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4" onKeyDown={handleKeyDown}>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Email
              </label>
              <Input
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-muted/40 border-border focus:bg-background transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10 bg-muted/40 border-border focus:bg-background transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((c) => !c)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className="w-full h-11 text-sm font-medium gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            New accounts start with{" "}
            <span className="text-primary font-medium">100,000 free credits</span>.
          </p>
        </div>
      </div>
    </div>
  );
}