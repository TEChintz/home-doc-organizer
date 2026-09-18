import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { FamilyMember } from "./dashboard-types";
import {
  useCreateDigiLockerRequest,
  useDigiLockerStatus,
  useImportDigiLocker,
} from "@/lib/api/hooks";

/**
 * Real DigiLocker consent flow.
 *
 * DigiLocker does not use an OTP that a third-party app can collect — the user
 * consents on DigiLocker's own page and we poll for the result. The previous
 * mock asked for a mobile number and a fake OTP, which no real integration can
 * do, so the mechanics here are different even though the shell looks the same.
 *
 * The provider is currently the mock one, which serves a clearly-labelled
 * stand-in consent page.
 */

interface ConnectDigiLockerDialogProps {
  member: FamilyMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Stage = "intro" | "waiting" | "importing" | "done";

export function ConnectDigiLockerDialog({
  member,
  open,
  onOpenChange,
  onSuccess,
}: ConnectDigiLockerDialogProps) {
  const createRequest = useCreateDigiLockerRequest();
  const importDocs = useImportDigiLocker();

  const [stage, setStage] = useState<Stage>("intro");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [imported, setImported] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { data: status } = useDigiLockerStatus(requestId, stage === "waiting");

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStage("intro");
        setRequestId(null);
        setImported(0);
        setError(null);
      }, 200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  // Consent granted on DigiLocker's side — pull the documents across.
  useEffect(() => {
    if (stage !== "waiting" || status?.status !== "authenticated" || !requestId) return;
    setStage("importing");
    importDocs
      .mutateAsync(requestId)
      .then((result) => {
        setImported(result.imported.length);
        setStage("done");
        onSuccess();
        toast.success(
          result.imported.length > 0
            ? `Imported ${result.imported.length} document${result.imported.length === 1 ? "" : "s"}`
            : "Nothing new to import",
        );
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Import failed");
        setStage("intro");
      });
    // importDocs is a stable mutation object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, status?.status, requestId]);

  async function start() {
    setError(null);
    try {
      const request = await createRequest.mutateAsync([]);
      setRequestId(request.id);
      setStage("waiting");
      window.open(request.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start DigiLocker");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-docket-blue" />
            Connect DigiLocker
          </DialogTitle>
          <DialogDescription>
            {member ? `Import ${member.name}'s issued documents.` : "Import issued documents."}
          </DialogDescription>
        </DialogHeader>

        {stage === "intro" && (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              We&apos;ll open DigiLocker in a new tab. Pick what you want to share, approve it, then
              come back here — the documents arrive automatically.
            </p>
            <ul className="space-y-2 text-sm">
              {["Aadhaar", "PAN", "Driving licence", "Vehicle RC"].map((label) => (
                <li key={label} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  {label}
                </li>
              ))}
            </ul>
            {error && (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={start} disabled={createRequest.isPending}>
                {createRequest.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Open DigiLocker
              </Button>
            </DialogFooter>
          </div>
        )}

        {(stage === "waiting" || stage === "importing") && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-docket-blue" />
            <p className="text-sm">
              {stage === "waiting"
                ? "Waiting for you to approve in the DigiLocker tab…"
                : "Bringing your documents across…"}
            </p>
            {stage === "waiting" && (
              <Button variant="ghost" size="sm" onClick={() => setStage("intro")}>
                Cancel
              </Button>
            )}
          </div>
        )}

        {stage === "done" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Check className="h-8 w-8 text-emerald-600" />
            <p className="text-sm">
              {imported > 0
                ? `${imported} document${imported === 1 ? "" : "s"} imported and verified.`
                : "Everything shared was already in your vault."}
            </p>
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
