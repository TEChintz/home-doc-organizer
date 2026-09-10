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
import { ShieldCheck, Check, Sparkles } from "lucide-react";
import type { FamilyMember, VaultDocument } from "./dashboard-types";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (newMember: FamilyMember, newDocs: VaultDocument[]) => void;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onAddMember,
}: AddMemberDialogProps) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<FamilyMember["relationship"]>("Spouse");
  const [task, setTask] = useState("");
  const [connectDigilocker, setConnectDigilocker] = useState(true);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setName("");
      setRelationship("Spouse");
      setTask("");
      setConnectDigilocker(true);
      setMobileNumber("");
      setOtpSent(false);
      setOtpCode("");
      setOtpVerified(false);
    }, 200);
  };

  const handleSendOtp = () => {
    if (mobileNumber.length >= 10) {
      setOtpSent(true);
      setOtpCode("492810");
    }
  };

  const getAvatarInfo = (rel: FamilyMember["relationship"]) => {
    switch (rel) {
      case "Self":
        return { emoji: "👨🏻‍💻", bg: "bg-amber-100" };
      case "Spouse":
        return { emoji: "👩🏻‍💼", bg: "bg-rose-100" };
      case "Father":
        return { emoji: "👨🏼‍🦳", bg: "bg-blue-100" };
      case "Mother":
        return { emoji: "👵🏼", bg: "bg-purple-100" };
      case "Son":
        return { emoji: "👦🏻", bg: "bg-docket-blue/10" };
      case "Daughter":
        return { emoji: "👧🏻", bg: "bg-pink-100" };
      default:
        return { emoji: "👤", bg: "bg-zinc-100" };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `mem-${Date.now()}`;
    const avatar = getAvatarInfo(relationship);
    const hasLinked = connectDigilocker && otpVerified;

    const newMember: FamilyMember = {
      id,
      name: name.trim(),
      relationship,
      statusText:
        task.trim() ||
        (hasLinked
          ? "Aadhaar & PAN Auto-Synced via DigiLocker"
          : "Initial Vault Document Setup"),
      status: hasLinked ? "Completed" : "In Progress",
      avatarBg: avatar.bg,
      avatarEmoji: avatar.emoji,
      digilockerLinked: hasLinked,
      ...(hasLinked ? {
        digilockerAadhaarMasked: "•••• " + Math.floor(1000 + Math.random() * 9000),
        digilockerLastSync: "Today"
      } : {}),
      documentsCount: hasLinked ? 2 : 0,
    };

    const newDocs: VaultDocument[] = [];
    if (hasLinked) {
      newDocs.push(
        {
          id: `doc-${Date.now()}-1`,
          title: "Aadhaar Identity Card",
          category: "identity",
          memberId: id,
          memberName: newMember.name,
          documentNumber: "•••• •••• " + Math.floor(1000 + Math.random() * 9000),
          issuingAuthority: "UIDAI",
          issuedDate: "Synced via DigiLocker",
          dueDate: "Due date: Nov 26, 2026",
          iconType: "stripes",
          iconColor: "#3b82f6",
          fileSize: "1.2 MB",
          source: "digilocker",
        },
        {
          id: `doc-${Date.now()}-2`,
          title: "Income Tax PAN Card",
          category: "identity",
          memberId: id,
          memberName: newMember.name,
          documentNumber: "ABCDE" + Math.floor(1000 + Math.random() * 9000) + "F",
          issuingAuthority: "Income Tax Department",
          issuedDate: "Synced via DigiLocker",
          dueDate: "Due date: Permanent",
          iconType: "pinwheel",
          iconColor: "#f59e0b",
          fileSize: "820 KB",
          source: "digilocker",
        }
      );
    }

    onAddMember(newMember, newDocs);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-zinc-200 bg-white p-6 shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-black tracking-tight text-zinc-900">
            Add Family Member
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-zinc-500">
            Create a profile to organize documents, link DigiLocker, and track renewals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="memberName" className="text-xs font-bold text-zinc-700">
              Full Name *
            </Label>
            <Input
              id="memberName"
              placeholder="e.g. Emily Carter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl border-zinc-200 text-xs focus:ring-docket-blue"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700">Relationship *</Label>
              <Select
                value={relationship}
                onValueChange={(val: FamilyMember["relationship"]) => setRelationship(val)}
              >
                <SelectTrigger className="h-10 rounded-xl border-zinc-200 text-xs">
                  <SelectValue placeholder="Relationship" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Son">Son</SelectItem>
                  <SelectItem value="Daughter">Daughter</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="taskName" className="text-xs font-bold text-zinc-700">
                Current Focus
              </Label>
              <Input
                id="taskName"
                placeholder="e.g. Health Insurance"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="h-10 rounded-xl border-zinc-200 text-xs focus:ring-docket-blue"
              />
            </div>
          </div>

          {/* DigiLocker One-Click Link Option */}
          <div className="rounded-2xl border border-docket-blue/20 bg-docket-blue/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4.5 text-docket-blue" />
                <span className="text-xs font-black text-zinc-900">
                  Connect DigiLocker Account
                </span>
              </div>
              <input
                type="checkbox"
                id="dlToggle"
                checked={connectDigilocker}
                onChange={(e) => setConnectDigilocker(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-docket-blue focus:ring-docket-blue cursor-pointer accent-docket-blue"
              />
            </div>

            {connectDigilocker && (
              <div className="space-y-2 pt-2 border-t border-docket-blue/20/60">
                {!otpSent ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="10-digit mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="h-9 rounded-xl border-zinc-200 bg-white text-xs flex-1"
                      maxLength={10}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSendOtp}
                      disabled={mobileNumber.length < 10}
                      className="h-9 rounded-xl text-xs bg-docket-blue hover:bg-docket-blue/90 text-white font-bold cursor-pointer"
                    >
                      Send OTP
                    </Button>
                  </div>
                ) : !otpVerified ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="OTP (492810)"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="h-9 rounded-xl border-zinc-200 bg-white text-xs flex-1 text-center font-mono font-bold"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setOtpVerified(true)}
                      className="h-9 rounded-xl text-xs bg-docket-blue hover:bg-docket-blue/90 text-white font-bold cursor-pointer"
                    >
                      Verify
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-docket-blue">
                    <Check className="size-4" />
                    <span>DigiLocker verified. Aadhaar & PAN will auto-sync.</span>
                  </div>
                )}
              </div>
            )}
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
              disabled={!name.trim()}
              className="h-9 rounded-full bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-black px-6 cursor-pointer shadow-xs"
            >
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
