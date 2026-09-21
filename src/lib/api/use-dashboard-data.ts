import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FamilyMember, VaultDocument } from "@/components/dashboard/dashboard-types";
import { memberNameMap, toFamilyMember, toVaultDocument } from "./adapters";
import { useAlerts, useDocuments, useFamily, useProcessingDocuments } from "./hooks";
import { ApiError } from "./client";

/**
 * One place that turns the three API reads the dashboard needs into the view
 * model its components already speak.
 *
 * Only `confirmed` documents are shown in the vault — anything still being read
 * or awaiting a human check belongs in the confirmation queue instead.
 */
export interface DashboardData {
  members: FamilyMember[];
  documents: VaultDocument[];
  memberNames: Map<string, string>;
  familyName: string;
  selfMemberId: string | null;
  pendingCount: number;
  isLoading: boolean;
  /** Documents still being read by the server. */
  processingCount: number;
  /** True when signed in but no family exists yet. */
  needsFamily: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useDashboardData(): DashboardData {
  const qc = useQueryClient();
  const family = useFamily();
  const confirmed = useDocuments({ status: "confirmed", limit: 200 });
  const pending = useDocuments({ status: "needs_confirmation", limit: 200 });
  const processing = useProcessingDocuments();
  const alerts = useAlerts("open");

  const apiMembers = useMemo(() => family.data?.members ?? [], [family.data]);
  const apiDocs = useMemo(() => confirmed.data ?? [], [confirmed.data]);
  const apiAlerts = useMemo(() => alerts.data ?? [], [alerts.data]);

  // The signed-in user is the family's owner.
  const selfMemberId = useMemo(
    () => apiMembers.find((m) => m.role === "owner")?.id ?? apiMembers[0]?.id ?? null,
    [apiMembers],
  );

  const memberNames = useMemo(() => memberNameMap(apiMembers), [apiMembers]);

  // Whenever an in-flight document finishes being read, pull everything again:
  // it has just moved into the confirmation queue and may have changed the
  // alert picture. Keyed on the count *falling* rather than reaching zero, so
  // that with several uploads in flight the first to finish shows up straight
  // away instead of waiting for the slowest one.
  const processingCount = processing.data?.length ?? 0;
  const wasProcessing = useRef(processingCount);
  useEffect(() => {
    if (processingCount < wasProcessing.current) {
      void qc.invalidateQueries({ queryKey: ["documents"] });
      void qc.invalidateQueries({ queryKey: ["alerts"] });
    }
    wasProcessing.current = processingCount;
  }, [processingCount, qc]);

  const documents = useMemo(
    () =>
      apiDocs.map((doc) =>
        toVaultDocument(doc, memberNames.get(doc.owner_member_id ?? "") ?? "Unassigned", apiAlerts),
      ),
    [apiDocs, memberNames, apiAlerts],
  );

  const members = useMemo(
    () => apiMembers.map((m) => toFamilyMember(m, apiDocs, apiAlerts, selfMemberId)),
    [apiMembers, apiDocs, apiAlerts, selfMemberId],
  );

  const familyError = family.error;
  const needsFamily =
    familyError instanceof ApiError && (familyError.needsFamily || familyError.status === 401);

  return {
    members,
    documents,
    memberNames,
    familyName: family.data?.name ?? "Your family",
    selfMemberId,
    // Counts documents still being read as well, so the badge responds the
    // moment an upload lands rather than after extraction completes.
    pendingCount: (pending.data?.length ?? 0) + processingCount,
    processingCount,
    isLoading: family.isLoading || confirmed.isLoading,
    needsFamily,
    error: needsFamily ? null : ((familyError as Error | null) ?? null),
    refresh: () => {
      void qc.invalidateQueries({ queryKey: ["family"] });
      void qc.invalidateQueries({ queryKey: ["documents"] });
      void qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  };
}
