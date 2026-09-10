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
import { ShieldCheck, Check, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import type { FamilyMember, VaultDocument } from "./dashboard-types";

interface ConnectDigiLockerDialogProps {
  member: FamilyMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (memberId: string, newDocs: VaultDocument[]) => void;
}

export function ConnectDigiLockerDialog({
  member,
  open,
  onOpenChange,
  onSuccess,
}: ConnectDigiLockerDialogProps) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  React.useEffect(() => {
    if (open) {
      setMobileNumber("");
      setOtpSent(false);
      setOtpCode("");
      setOtpVerified(false);
      setIsVerifying(false);
    }
  }, [open]);

  if (!member) return null;

  const handleSendOtp = () => {
    if (mobileNumber.length >= 10) {
      setOtpSent(true);
      setOtpCode("492810"); // Pre-filled simulation OTP
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setOtpVerified(true);
    }, 600);
  };

  const handleComplete = () => {
    const maskedAadhaar = "•••• " + Math.floor(1000 + Math.random() * 9000);
    const newDocs: VaultDocument[] = [
      {
        id: `doc-dl-${Date.now()}-1`,
        title: "Aadhaar Identity Card",
        category: "identity",
        memberId: member.id,
        memberName: member.name,
        documentNumber: "•••• •••• " + Math.floor(1000 + Math.random() * 9000),
        issuingAuthority: "UIDAI (Govt of India)",
        issuedDate: "Verified Today",
        dueDate: "Due date: Permanent",
        iconType: "stripes",
        iconColor: "#3b82f6",
        fileSize: "1.4 MB",
        source: "digilocker",
      },
      {
        id: `doc-dl-${Date.now()}-2`,
        title: "Income Tax PAN Card",
        category: "identity",
        memberId: member.id,
        memberName: member.name,
        documentNumber: "ABCDE" + Math.floor(1000 + Math.random() * 9000) + "F",
        issuingAuthority: "Income Tax Department",
        issuedDate: "Verified Today",
        dueDate: "Due date: Permanent",
        iconType: "pinwheel",
        iconColor: "#f59e0b",
        fileSize: "820 KB",
        source: "digilocker",
      },
    ];

    onSuccess(member.id, newDocs);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-zinc-200 bg-white p-6 shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-8 rounded-full bg-docket-blue/10 grid place-items-center text-docket-blue">
              <ShieldCheck className="size-4.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-docket-blue">
              National DigiLocker Gateway
            </span>
          </div>

          <DialogTitle className="text-xl font-black tracking-tight text-zinc-900">
            Connect DigiLocker for {member.name}
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-zinc-500">
            Securely fetch Aadhaar, PAN, and government verified certificates using Aadhaar-linked OTP.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Member Card preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            <div
              className={`size-10 rounded-xl grid place-items-center text-lg shrink-0 ${member.avatarBg}`}
            >
              <span>{member.avatarEmoji}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate">{member.name}</p>
              <p className="text-[10px] text-zinc-500">
                Relationship: {member.relationship} • {member.documentsCount} documents in vault
              </p>
            </div>
          </div>

          {/* OTP Section */}
          <div className="space-y-3">
            {!otpSent ? (
              <div className="space-y-2">
                <Label htmlFor="dlPhone" className="text-xs font-bold text-zinc-700">
                  Aadhaar Registered Mobile Number *
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                      +91
                    </span>
                    <Input
                      id="dlPhone"
                      placeholder="98201 00000"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      className="h-10 rounded-xl border-zinc-200 pl-10 text-xs font-semibold focus:ring-docket-blue"
                      maxLength={10}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={mobileNumber.length < 10}
                    className="h-10 rounded-xl bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-bold px-4 shadow-xs cursor-pointer"
                  >
                    Send OTP
                  </Button>
                </div>
                <p className="text-[10px] text-zinc-400">
                  A 6-digit verification code will be sent by UIDAI / DigiLocker.
                </p>
              </div>
            ) : !otpVerified ? (
              <div className="space-y-2.5 p-4 rounded-2xl bg-docket-blue/[0.05]/60 border border-docket-blue/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dlOtp" className="text-xs font-bold text-zinc-800">
                    Enter 6-Digit OTP
                  </Label>
                  <span className="text-[10px] text-docket-blue font-bold bg-docket-blue/10 px-2 py-0.5 rounded-md">
                    Demo OTP: 492810
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="dlOtp"
                    placeholder="492810"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="h-10 rounded-xl border-docket-blue/30 bg-white text-xs font-mono font-bold text-center tracking-widest text-zinc-900 focus:ring-docket-blue"
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    onClick={handleVerify}
                    disabled={otpCode.length < 6 || isVerifying}
                    className="h-10 rounded-xl bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-bold px-5 shadow-xs cursor-pointer"
                  >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  OTP sent to +91 {mobileNumber.slice(0, 3)}••••{mobileNumber.slice(-3)}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-docket-blue/[0.05] border border-docket-blue/20 text-center space-y-2">
                <div className="size-10 rounded-full bg-docket-blue/10 text-docket-blue grid place-items-center mx-auto">
                  <Check className="size-5 stroke-[2.5]" />
                </div>
                <h4 className="text-xs font-black text-zinc-900">
                  DigiLocker Authentication Successful!
                </h4>
                <p className="text-[11px] text-zinc-600">
                  Ready to import official <span className="font-bold">Aadhaar Card</span> and{" "}
                  <span className="font-bold">PAN Card</span> into {member.name}'s vault.
                </p>
              </div>
            )}

            {/* DigiLocker Guarantees */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-docket-blue" /> 256-Bit Encrypted
              </span>
              <span>Govt. of India IT Act 2000 compliant</span>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-full text-xs font-bold border-zinc-300 bg-white hover:bg-zinc-50 cursor-pointer"
          >
            Cancel
          </Button>

          {otpVerified && (
            <Button
              type="button"
              onClick={handleComplete}
              className="h-9 rounded-full bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-black px-6 cursor-pointer shadow-xs gap-1.5"
            >
              <span>Import Documents to Vault</span>
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
