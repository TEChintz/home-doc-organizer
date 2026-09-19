import React from "react";
import { AlertTriangle, BellOff, Check, CircleAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAlerts, useUpdateAlert } from "@/lib/api/hooks";
import type { ApiAlert } from "@/lib/api/types";

/** Open alerts, worst first. Mirrors what the WhatsApp bot reports. */

const KIND_LABEL: Record<string, string> = {
  expiry: "Expiring",
  premium_due: "Premium due",
  missing_nominee: "No nominee",
  name_mismatch: "Name mismatch",
  dob_mismatch: "Date of birth mismatch",
};

const SEVERITY_RANK: Record<string, number> = { high: 0, warning: 1, info: 2 };

export function AlertsView({ memberNames }: { memberNames: Map<string, string> }) {
  const { data: alerts = [], isLoading } = useAlerts("open");
  const update = useUpdateAlert();

  const sorted = [...alerts].sort(
    (a, b) => (SEVERITY_RANK[a.severity] ?? 3) - (SEVERITY_RANK[b.severity] ?? 3),
  );

  async function act(alert: ApiAlert, status: "resolved" | "dismissed") {
    try {
      await update.mutateAsync({ id: alert.id, status });
      toast.success(status === "resolved" ? "Marked as sorted" : "Dismissed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">Renewals &amp; alerts</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Recalculated whenever a document is confirmed, and every night.
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-center">
          <Check className="h-6 w-6 text-emerald-600" />
          <p className="text-sm text-muted-foreground">Nothing needs attention right now.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((alert) => {
            const high = alert.severity === "high";
            return (
              <li
                key={alert.id}
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  high ? "border-red-200 bg-red-50" : "border-border bg-white"
                }`}
              >
                {high ? (
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {KIND_LABEL[alert.kind] ?? alert.kind}
                    </span>
                    {alert.member_id && memberNames.get(alert.member_id) && (
                      <span className="text-xs text-muted-foreground">
                        · {memberNames.get(alert.member_id)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm">{alert.message}</p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => act(alert, "resolved")}
                    disabled={update.isPending}
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Sorted
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => act(alert, "dismissed")}
                    disabled={update.isPending}
                  >
                    <BellOff className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
