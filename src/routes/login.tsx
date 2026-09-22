import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocketLogo } from "@/components/ui/docket-logo";
import { useAuth } from "@/lib/auth-context";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/dashboard" });
  }, [session, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: authError } = await getSupabase().auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (authError) throw authError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the link");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleBusy(true);
    try {
      const { error: authError } = await getSupabase().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start Google sign-in");
      setGoogleBusy(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <Shell>
        <h1 className="text-xl font-semibold">Sign-in is not configured</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, then reload.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-8 flex flex-col items-start">
        <h1 className="text-[28px] font-bold tracking-tight text-zinc-900">Welcome back</h1>
        <p className="mt-2 text-base text-zinc-500 font-medium">
          Sign in to your Docket vault to continue.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 text-[15px] font-medium shadow-sm border-zinc-200 hover:bg-zinc-50"
        onClick={handleGoogle}
        disabled={googleBusy}
      >
        <GoogleMark />
        {googleBusy ? "Redirecting…" : "Continue with Google"}
      </Button>

      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Or continue with</span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      {sent ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 text-sm text-blue-900 shadow-sm">
          Check <span className="font-semibold">{email}</span> for a secure sign-in link. You can close this
          tab once you&apos;ve clicked it.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-medium text-zinc-700">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 shadow-sm border-zinc-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          {error && <p className="text-[13px] font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
          <Button type="submit" className="w-full h-11 text-[15px] font-medium bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm cursor-pointer" disabled={busy || !email}>
            {busy ? "Sending link…" : "Send secure link"}
          </Button>
        </form>
      )}
    </Shell>
  );
}

/** Google's brand mark */
function GoogleMark() {
  return (
    <svg className="mr-2.5 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.7l7.8 6.1C12.3 13.9 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.15-3.2-.43-4.7H24v9h12.7c-.55 2.9-2.2 5.4-4.7 7.1l7.4 5.7c4.3-4 6.8-9.9 6.8-17.1z" />
      <path fill="#FBBC05" d="M10.4 28.2a14.6 14.6 0 0 1 0-8.4l-7.8-6.1a23.6 23.6 0 0 0 0 20.6l7.8-6.1z" />
      <path fill="#34A853" d="M24 47.5c6.2 0 11.5-2.1 15.4-5.6l-7.4-5.7c-2.1 1.4-4.8 2.2-8 2.2-6.4 0-11.7-4.4-13.6-10.3l-7.8 6.1C6.5 42.1 14.6 47.5 24 47.5z" />
    </svg>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 items-center justify-center p-12 overflow-hidden border-r border-zinc-800">
        {/* Subtle grid on the dark side */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg flex flex-col justify-between h-full py-8">
          {/* Logo Top Left */}
          <div className="flex items-center gap-3 text-white">
            <div className="grid size-10 place-items-center bg-blue-600 text-white rounded-xl shadow-sm">
              <DocketLogo className="size-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Docket</span>
          </div>

          {/* Value Prop */}
          <div className="space-y-8 mt-12 mb-auto">
            <h2 className="text-[32px] font-medium text-white leading-[1.3] tracking-tight">
              "Docket completely changed how our family manages critical documents. We never miss a renewal anymore."
            </h2>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden shrink-0">
                <img src="https://i.pravatar.cc/150?img=44" alt="Avatar" className="w-full h-full object-cover grayscale opacity-90" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">Sarah Jenkins</p>
                <p className="text-sm text-zinc-400 font-medium">Family Pro Subscriber</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-8 bg-white relative">
        <div className="w-full max-w-[400px]">
          
          {/* Mobile Logo (hidden on desktop since it's on the left panel) */}
          <div className="mb-10 flex lg:hidden items-center gap-3">
            <div className="grid size-10 place-items-center bg-blue-600 text-white rounded-xl shadow-sm">
              <DocketLogo className="size-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900">Docket</span>
          </div>

          {children}

          <div className="mt-12 flex justify-start lg:justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
            >
              <ArrowLeft className="size-4" />
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
