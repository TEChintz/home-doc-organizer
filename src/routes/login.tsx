import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
      <h1 className="text-2xl font-semibold tracking-tight">Sign in to Docket</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;ll email you a link — no password to remember.
      </p>

      {sent ? (
        <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
          Check <span className="font-medium">{email}</span> for a sign-in link. You can close this
          tab once you&apos;ve clicked it.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy || !email}>
            {busy ? "Sending…" : "Email me a link"}
          </Button>
        </form>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <DocketLogo />
        </div>
        {children}
      </div>
    </div>
  );
}
