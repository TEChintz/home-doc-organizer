import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, X } from "lucide-react";
import type {
  FamilyMember,
  VaultDocument,
  DocumentCategory,
} from "./dashboard-types";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: FamilyMember[];
  defaultMemberId?: string | null;
  onUploadSuccess: (newDoc: VaultDocument) => void;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  members,
  defaultMemberId,
  onUploadSuccess,
}: UploadDocumentDialogProps) {
  const [memberId, setMemberId] = useState(defaultMemberId || members[0]?.id || "");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("identity");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  React.useEffect(() => {
    if (defaultMemberId) {
      setMemberId(defaultMemberId);
    } else if (members.length > 0 && !memberId) {
      setMemberId(members[0]?.id || "");
    }
  }, [defaultMemberId, members]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setTitle("");
      setDocumentNumber("");
      setIssuingAuthority("");
      setExpiryDate("");
      setFileName(null);
    }, 200);
  };

  const handleSimulateFile = (name: string) => {
    setFileName(name);
    if (!title) {
      setTitle(name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
    }
  };

  const getIconForCategory = (cat: DocumentCategory): { iconType: VaultDocument["iconType"]; iconColor: string } => {
    switch (cat) {
      case "identity":
        return { iconType: "stripes", iconColor: "#3b82f6" };
      case "vehicles":
        return { iconType: "arc", iconColor: "#0d9488" };
      case "health":
        return { iconType: "pinwheel", iconColor: "#f59e0b" };
      case "finance":
        return { iconType: "crescent", iconColor: "#ea580c" };
      default:
        return { iconType: "dots", iconColor: "#8b5cf6" };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !memberId) return;

    const member = members.find((m) => m.id === memberId);
    const memberName = member ? member.name : "Family Member";
    const iconConfig = getIconForCategory(category);

    const formattedExpiry = expiryDate
      ? new Date(expiryDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : undefined;

    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      category,
      memberId,
      memberName,
      documentNumber: documentNumber || "DOC-" + Math.floor(1000 + Math.random() * 9000),
      issuingAuthority: issuingAuthority || "Government / Private Issuer",
      issuedDate: "Today",
      ...(formattedExpiry ? { expiryDate: formattedExpiry } : {}),
      dueDate: formattedExpiry ? `Due date: ${formattedExpiry}` : "Due date: Permanent",
      iconType: iconConfig.iconType,
      iconColor: iconConfig.iconColor,
      fileSize: "1.8 MB",
      source: "upload",
    };

    onUploadSuccess(newDoc);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-zinc-200 bg-white p-6 shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-black tracking-tight text-zinc-900">
            Upload Document
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-zinc-500">
            Add a policy, certificate, or deed to a family member's vault.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* File Dropzone */}
          <div>
            {!fileName ? (
              <div
                onClick={() => handleSimulateFile("Health_Insurance_Policy.pdf")}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/70 p-6 text-center hover:border-docket-blue hover:bg-docket-blue/[0.05]/30 transition-all cursor-pointer"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-docket-blue/10 text-docket-blue mb-2">
                  <Upload className="size-5" />
                </div>
                <p className="text-xs font-bold text-zinc-800">
                  Click to select file or drag here
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">PDF, PNG, JPG up to 25MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-docket-blue/20 bg-docket-blue/[0.04] px-3.5 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="size-4 text-docket-blue shrink-0" />
                  <span className="text-xs font-bold text-zinc-900 truncate">
                    {fileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFileName(null)}
                  className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-700">Assign to Member *</Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger className="h-10 rounded-xl border-zinc-200 text-xs">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.relationship})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="docTitle" className="text-xs font-bold text-zinc-700">
                Document Title *
              </Label>
              <Input
                id="docTitle"
                placeholder="e.g. Star Health Cover"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 rounded-xl border-zinc-200 text-xs focus:ring-docket-blue"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700">Category</Label>
              <Select
                value={category}
                onValueChange={(val: DocumentCategory) => setCategory(val)}
              >
                <SelectTrigger className="h-10 rounded-xl border-zinc-200 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="identity">Identity</SelectItem>
                  <SelectItem value="health">Health & Insurance</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="finance">Finance & Tax</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="docNo" className="text-xs font-bold text-zinc-700">
                Document / Policy No.
              </Label>
              <Input
                id="docNo"
                placeholder="e.g. POL-849201"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="h-10 rounded-xl border-zinc-200 text-xs focus:ring-docket-blue"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expDate" className="text-xs font-bold text-zinc-700">
                Renewal / Expiry Date
              </Label>
              <Input
                id="expDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="h-10 rounded-xl border-zinc-200 text-xs focus:ring-docket-blue"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 rounded-full text-xs font-bold border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !memberId}
              className="h-9 rounded-full bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-black px-6 cursor-pointer shadow-xs"
            >
              Save Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
