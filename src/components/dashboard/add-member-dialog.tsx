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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { FamilyMember } from "./dashboard-types";
import { useCreateMember } from "@/lib/api/hooks";

/**
 * Add someone to the family.
 *
 * The previous version collected a mobile number and a fake OTP. Phone numbers
 * are attached by the person themselves, from their own handset, via the
 * WhatsApp linking code — so there is nothing to verify here.
 */

const RELATIONSHIPS: FamilyMember["relationship"][] = [
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Other",
];

/** Mirrors the API's roles; a viewer only sees their own and identity documents. */
const ROLES = [
  { value: "adult", label: "Adult — can see and manage everything" },
  { value: "viewer", label: "Viewer — their own documents plus IDs" },
  { value: "advisor", label: "Advisor — tax and financial only" },
] as const;

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: () => void;
}

export function AddMemberDialog({ open, onOpenChange, onAddMember }: AddMemberDialogProps) {
  const createMember = useCreateMember();

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<FamilyMember["relationship"]>("Spouse");
  const [role, setRole] = useState<(typeof ROLES)[number]["value"]>("adult");
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => {
      setName("");
      setRelationship("Spouse");
      setRole("adult");
      setDob("");
      setError(null);
    }, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createMember.mutateAsync({
        name: name.trim(),
        relation: relationship,
        role,
        dob: dob || null,
      });
      onAddMember();
      toast.success(`${name.trim()} added`);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add this person");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a family member</DialogTitle>
          <DialogDescription>
            They can connect their own WhatsApp number later from the WhatsApp tab.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="member-name">Full name</Label>
            <Input
              id="member-name"
              required
              placeholder="As printed on their documents"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use the spelling on their Aadhaar — we match documents to people by name.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="member-relationship">Relationship</Label>
              <Select
                value={relationship}
                onValueChange={(v) => setRelationship(v as FamilyMember["relationship"])}
              >
                <SelectTrigger id="member-relationship">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-dob">Date of birth</Label>
              <Input
                id="member-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-role">What can they see?</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger id="member-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMember.isPending || !name.trim()}>
              {createMember.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
