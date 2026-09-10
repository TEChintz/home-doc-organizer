import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, Trash2, ShieldCheck } from "lucide-react";
import type { VaultDocument } from "./dashboard-types";
import { GeometricDocIcon } from "./geometric-doc-icon";

interface DocumentViewerDialogProps {
  document: VaultDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
}

export function DocumentViewerDialog({
  document,
  open,
  onOpenChange,
  onDelete,
}: DocumentViewerDialogProps) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-zinc-200 bg-white p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-700 capitalize">
              {document.category}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 ${
                document.source === "digilocker"
                  ? "bg-docket-blue/[0.05] text-docket-blue border border-docket-blue/20"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {document.source === "digilocker" && <ShieldCheck className="size-3 text-docket-blue" />}
              {document.source === "digilocker" ? "DigiLocker Verified" : "Uploaded Document"}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <GeometricDocIcon type={docTypeOrDefault(document.iconType)} color={document.iconColor} />
            <DialogTitle className="text-base font-extrabold tracking-tight text-zinc-900">
              {document.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs font-medium text-zinc-500">
            Assigned to <span className="font-bold text-zinc-800">{document.memberName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-zinc-200/60">
            <span className="text-zinc-500 font-medium">Document ID / Number</span>
            <span className="font-mono font-bold text-zinc-900">{document.documentNumber}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-200/60">
            <span className="text-zinc-500 font-medium">Issuing Authority</span>
            <span className="font-bold text-zinc-900">{document.issuingAuthority}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-zinc-200/60">
            <span className="text-zinc-500 font-medium">Issued Date</span>
            <span className="font-bold text-zinc-900">{document.issuedDate}</span>
          </div>
          {document.expiryDate && (
            <div className="flex justify-between py-1 border-b border-zinc-200/60">
              <span className="text-zinc-500 font-medium">Expiry Date</span>
              <span className="font-bold text-docket-blue">{document.expiryDate}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-zinc-500 font-medium">Encryption & Storage</span>
            <span className="font-bold text-zinc-900">256-bit AES Vault</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 pt-2">
          {onDelete ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDelete(document.id);
                onOpenChange(false);
              }}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full cursor-pointer"
            >
              <Trash2 className="size-3.5 mr-1" />
              Remove
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-xs font-bold border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 cursor-pointer"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                alert(`Downloading ${document.title}...`);
                onOpenChange(false);
              }}
              className="rounded-full bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-bold px-4 cursor-pointer gap-1.5 shadow-xs"
            >
              <Download className="size-3.5" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function docTypeOrDefault(type?: VaultDocument["iconType"]) {
  return type || "stripes";
}
