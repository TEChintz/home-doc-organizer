import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocketLogo } from "@/components/ui/docket-logo";
import { useCreateFamily } from "@/lib/api/hooks";

/**
 * First run. A signed-in user with no member row can call exactly one endpoint —
 * POST /v1/families — so this step cannot be skipped.
 */
export function CreateFamily({ defaultName }: { defaultName?: string }) {
  const createFamily = useCreateFamily();
  const [ownerName, setOwnerName] = useState(defaultName ?? "");
  const [familyName, setFamilyName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createFamily.mutateAsync({
        owner_name: ownerName.trim(),
        family_name: familyName.trim() || `${ownerName.trim().split(" ")[0]}'s family`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your family");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <DocketLogo />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Set up your vault</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You can add the rest of your family afterwards.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="owner-name">Your full name</Label>
            <Input
              id="owner-name"
              required
              placeholder="As printed on your documents"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We match documents to people by name, so use the spelling on your Aadhaar.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="family-name">Family name (optional)</Label>
            <Input
              id="family-name"
              placeholder="The Sharmas"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={createFamily.isPending || !ownerName.trim()}
          >
            {createFamily.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create my vault
          </Button>
        </form>
      </div>
    </div>
  );
}
