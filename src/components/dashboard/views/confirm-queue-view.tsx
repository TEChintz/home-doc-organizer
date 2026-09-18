import React, { useState } from "react";
import { AlertTriangle, Check, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirmDocument, useDocuments, usePatchDocument } from "@/lib/api/hooks";
import { EDITABLE_FIELDS, extractedOf, type ApiDocument } from "@/lib/api/types";

/**
 * Documents the server has read but nobody has checked yet.
 *
 * This screen is not optional: a document stays out of alerts, Q&A and packets
 * until a human confirms it, because the extraction is a model's best guess.
 */
export function ConfirmQueueView() {
  const { data: pending = [], isLoading } = useDocuments({ status: "needs_confirmation" });
  const { data: failed = [] } = useDocuments({ status: "failed" });

  if (isLoading) {
    return <Centered icon={<Loader2 className="h-5 w-5 animate-spin" />} text="Loading…" />;
  }

  if (pending.length === 0 && failed.length === 0) {
    return (
      <Centered
        icon={<Check className="h-6 w-6 text-emerald-600" />}
        text="Nothing waiting — every document has been checked."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">Needs your check</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We read these automatically. Correct anything that looks wrong, then confirm — alerts only
          start once a document is confirmed.
        </p>
      </header>

      {pending.map((doc) => (
        <PendingCard key={doc.id} doc={doc} />
      ))}

      {failed.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Could not be read</h3>
          {failed.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{doc.title}</p>
                <p className="mt-1 text-xs text-amber-800">
                  {doc.error ?? "Extraction failed."} You can still fill the details in by hand.
                </p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function PendingCard({ doc }: { doc: ApiDocument }) {
  const extracted = extractedOf(doc);
  const patch = usePatchDocument();
  const confirm = useConfirmDocument();

  const [title, setTitle] = useState(doc.title);
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const seed: Record<string, string> = {};
    for (const { key } of EDITABLE_FIELDS) {
      const value = extracted[key];
      if (typeof value === "string" && value !== "") seed[key as string] = value;
    }
    return seed;
  });

  const busy = patch.isPending || confirm.isPending;

  async function handleConfirm() {
    try {
      // Save corrections first so the alert rules run against what the human saw.
      await patch.mutateAsync({ id: doc.id, title, extracted: fields });
      const result = await confirm.mutateAsync(doc.id);
      toast.success(
        result.alerts_opened > 0
          ? `Confirmed — ${result.alerts_opened} thing${result.alerts_opened === 1 ? "" : "s"} need attention`
          : "Confirmed",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not confirm");
    }
  }

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {doc.doc_type.replace(/_/g, " ")}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor={`title-${doc.id}`}>Title</Label>
        <Input id={`title-${doc.id}`} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {EDITABLE_FIELDS.filter(({ key }) => fields[key as string] !== undefined).map(
          ({ key, label }) => (
            <div key={key as string} className="space-y-2">
              <Label htmlFor={`${doc.id}-${String(key)}`}>{label}</Label>
              <Input
                id={`${doc.id}-${String(key)}`}
                value={fields[key as string] ?? ""}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, [key as string]: e.target.value }))
                }
              />
            </div>
          ),
        )}
      </div>

      {Object.keys(fields).length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          We couldn&apos;t read any details from this one — confirm to keep it as a plain file.
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <Button onClick={handleConfirm} disabled={busy}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Confirm
        </Button>
      </div>
    </article>
  );
}

function Centered({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      {icon}
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
