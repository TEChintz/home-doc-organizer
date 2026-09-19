import React, { useEffect, useState } from "react";
import { Copy, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreateLinkCode } from "@/lib/api/hooks";

/**
 * Connect a WhatsApp number to this account.
 *
 * The web app issues a 6-digit code; the user texts `LINK <code>` from the phone
 * they want attached. If that phone had already been talking to the bot on its
 * own, the server merges the two families rather than leaving documents stranded.
 */

const BOT_NUMBER =
  (import.meta.env["VITE_WHATSAPP_NUMBER"] as string | undefined) ?? "+1 555 143 0916";

export function WhatsAppView() {
  const createCode = useCreateLinkCode();
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => setSecondsLeft(Math.max(0, Math.round((expiresAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  async function generate() {
    try {
      const result = await createCode.mutateAsync();
      setCode(result.code);
      setExpiresAt(Date.parse(result.expires_at));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create a code");
    }
  }

  const expired = code !== null && secondsLeft === 0;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <header className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <MessageCircle className="h-6 w-6 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">Connect WhatsApp</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Forward documents straight from WhatsApp and ask questions in plain English, Hindi or
          Hinglish.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-white p-6">
        {!code ? (
          <Button className="w-full" onClick={generate} disabled={createCode.isPending}>
            {createCode.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get my linking code
          </Button>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Your code</p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="font-mono text-4xl font-semibold tracking-[0.3em]">{code}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    void navigator.clipboard.writeText(`LINK ${code}`);
                    toast.success("Copied");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p
                className={`mt-2 text-xs ${expired ? "text-destructive" : "text-muted-foreground"}`}
              >
                {expired
                  ? "This code has expired — generate another."
                  : `Expires in ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`}
              </p>
            </div>

            <ol className="space-y-3 text-sm">
              <Step n={1}>
                Open WhatsApp and message <span className="font-medium">{BOT_NUMBER}</span>
              </Step>
              <Step n={2}>
                Send <code className="rounded bg-muted px-1.5 py-0.5 font-mono">LINK {code}</code>
              </Step>
              <Step n={3}>
                You&apos;ll get a confirmation naming your family. Anything you&apos;d already sent
                that number moves across automatically.
              </Step>
            </ol>

            {expired && (
              <Button className="w-full" variant="outline" onClick={generate}>
                Generate a new code
              </Button>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Codes work once and last 10 minutes.
      </p>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
        {n}
      </span>
      <span className="text-muted-foreground">{children}</span>
    </li>
  );
}
