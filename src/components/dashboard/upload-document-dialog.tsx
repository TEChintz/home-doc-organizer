import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { FamilyMember } from "./dashboard-types";
import { useUploadDocument } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";

/**
 * Uploading is just "pick a file". The server reads the document and fills in
 * the details, so asking a human to retype the number and issuer — as the mock
 * version did — would be busywork and a source of wrong data.
 *
 * The upload returns 202 immediately; extraction continues in the background and
 * the document then appears under "Needs check".
 */

const MAX_MULTIPART_BYTES = 4 * 1024 * 1024;
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: FamilyMember[];
  defaultMemberId?: string | null;
  onUploadSuccess: () => void;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  members,
  defaultMemberId,
  onUploadSuccess,
}: UploadDocumentDialogProps) {
  const upload = useUploadDocument();
  const inputRef = useRef<HTMLInputElement>(null);

  const [memberId, setMemberId] = useState(defaultMemberId || members[0]?.id || "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (defaultMemberId) setMemberId(defaultMemberId);
    else if (members.length > 0 && !memberId) setMemberId(members[0]?.id ?? "");
  }, [defaultMemberId, members, memberId]);

  function reset() {
    setFile(null);
    setError(null);
    setDone(false);
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(reset, 200);
  }

  function pick(next: File | null) {
    setError(null);
    if (!next) return;
    if (!ACCEPTED.includes(next.type)) {
      setError("We can read PDF, JPG, PNG and WEBP files.");
      return;
    }
    if (next.size > MAX_MULTIPART_BYTES) {
      // The API caps this route at 4 MB; larger files need the signed-URL flow.
      setError("That file is over 4 MB. Please upload a smaller scan for now.");
      return;
    }
    setFile(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    try {
      await upload.mutateAsync({ file, ownerMemberId: memberId || null });
      setDone(true);
      onUploadSuccess();
      toast.success("Uploaded — we're reading it now");
      setTimeout(handleClose, 1200);
    } catch (err) {
      if (err instanceof ApiError && err.code === "duplicate_document") {
        toast.info("You already have this document saved.");
        handleClose();
        return;
      }
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a document</DialogTitle>
          <DialogDescription>
            Upload a scan or photo — we&apos;ll read the details and ask you to check them.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            <p className="text-sm">Saved. It&apos;ll show up under “Needs check” shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="upload-member">Whose document is this?</Label>
              <Select value={memberId} onValueChange={setMemberId}>
                <SelectTrigger id="upload-member">
                  <SelectValue placeholder="We'll work it out from the name" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Leave it if you&apos;re not sure — we match the name on the document.
              </p>
            </div>

            <div className="space-y-2">
              <Label>File</Label>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED.join(",")}
                className="hidden"
                onChange={(e) => pick(e.target.files?.[0] ?? null)}
              />

              {file ? (
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                  <Button type="button" size="icon" variant="ghost" onClick={() => setFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                >
                  <Upload className="h-5 w-5" />
                  Choose a PDF or photo
                  <span className="text-xs">Up to 4 MB</span>
                </button>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!file || upload.isPending}>
                {upload.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
