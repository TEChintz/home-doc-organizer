import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "./client";
import type {
  ApiAlert,
  ApiAskResponse,
  ApiDocument,
  ApiDocumentWithUrl,
  ApiFamily,
  ApiLinkCode,
  ApiPacketResponse,
  ApiPacketTemplates,
} from "./types";

/**
 * React Query hooks over the Docket API.
 *
 * Confirming a document runs the alert rules server-side, so anything that can
 * change a document invalidates alerts too — otherwise the alerts panel silently
 * goes stale after an upload.
 */

export const qk = {
  family: ["family"] as const,
  documents: (filter?: unknown) => ["documents", filter ?? {}] as const,
  document: (id: string) => ["document", id] as const,
  alerts: (status?: string) => ["alerts", status ?? "all"] as const,
  packetTemplates: ["packet-templates"] as const,
};

function invalidateFamilyData(qc: QueryClient): void {
  void qc.invalidateQueries({ queryKey: ["documents"] });
  void qc.invalidateQueries({ queryKey: ["alerts"] });
  void qc.invalidateQueries({ queryKey: qk.family });
}

/* ---------------------------------------------------------------- family --- */

export function useFamily() {
  return useQuery({
    queryKey: qk.family,
    queryFn: () => apiFetch<ApiFamily>("/v1/family"),
    retry: (count, error) => !(error instanceof ApiError && error.status === 401) && count < 2,
  });
}

export function useCreateFamily() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { family_name: string; owner_name: string; phone?: string }) =>
      apiFetch<ApiFamily>("/v1/families", { method: "POST", body }),
    onSuccess: () => invalidateFamilyData(qc),
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      name: string;
      relation?: string | null;
      dob?: string | null;
      phone?: string | null;
      role?: "owner" | "adult" | "viewer" | "advisor";
    }) => apiFetch("/v1/members", { method: "POST", body }),
    onSuccess: () => invalidateFamilyData(qc),
  });
}

/* ------------------------------------------------------------- documents --- */

export interface DocumentFilter {
  status?: string;
  type?: string;
  category?: string;
  member_id?: string;
  q?: string;
  limit?: number;
}

function toQuery(filter: DocumentFilter): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filter)) {
    if (v !== undefined && v !== "" && v !== null) params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function useDocuments(filter: DocumentFilter = {}) {
  return useQuery({
    queryKey: qk.documents(filter),
    queryFn: () =>
      apiFetch<{ documents: ApiDocument[] }>(`/v1/documents${toQuery(filter)}`).then(
        (r) => r.documents,
      ),
  });
}

/** Single document, including a signed download URL valid for 300 seconds. */
export function useDocument(id: string | null) {
  return useQuery({
    queryKey: qk.document(id ?? ""),
    queryFn: () => apiFetch<ApiDocumentWithUrl>(`/v1/documents/${id}`),
    enabled: Boolean(id),
  });
}

/**
 * Upload and then watch the document until extraction settles. The API answers
 * 202 with `processing` and does the LLM work in the background.
 */
export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { file: File; ownerMemberId?: string | null }) => {
      const form = new FormData();
      form.set("file", input.file);
      if (input.ownerMemberId) form.set("owner_member_id", input.ownerMemberId);
      return apiFetch<ApiDocument>("/v1/documents", { method: "POST", formData: form });
    },
    onSuccess: () => invalidateFamilyData(qc),
  });
}

/**
 * Documents being read right now.
 *
 * Extraction happens after the 202, so a freshly uploaded document is neither
 * `confirmed` (not in the vault) nor `needs_confirmation` (not in the queue) —
 * it is invisible until something refetches. This polls while anything is in
 * flight so the UI notices the moment the server finishes.
 */
export function useProcessingDocuments() {
  return useQuery({
    queryKey: qk.documents({ status: "processing" }),
    queryFn: () =>
      apiFetch<{ documents: ApiDocument[] }>("/v1/documents?status=processing&limit=50").then(
        (r) => r.documents,
      ),
    refetchInterval: (query) => ((query.state.data?.length ?? 0) > 0 ? 3000 : false),
  });
}

export function usePatchDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      id: string;
      title?: string;
      doc_type?: string;
      owner_member_id?: string | null;
      extracted?: Record<string, unknown>;
    }) => {
      const { id, ...body } = input;
      return apiFetch<ApiDocument>(`/v1/documents/${id}`, { method: "PATCH", body });
    },
    onSuccess: (doc) => {
      void qc.invalidateQueries({ queryKey: qk.document(doc.id) });
      invalidateFamilyData(qc);
    },
  });
}

export function useConfirmDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ document: ApiDocument; alerts_opened: number; alerts_resolved: number }>(
        `/v1/documents/${id}/confirm`,
        { method: "POST" },
      ),
    onSuccess: () => invalidateFamilyData(qc),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ deleted: boolean }>(`/v1/documents/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateFamilyData(qc),
  });
}

/* ---------------------------------------------------------------- alerts --- */

export function useAlerts(status: "open" | "resolved" | "dismissed" | undefined = "open") {
  return useQuery({
    queryKey: qk.alerts(status),
    queryFn: () =>
      apiFetch<{ alerts: ApiAlert[] }>(`/v1/alerts${status ? `?status=${status}` : ""}`).then(
        (r) => r.alerts,
      ),
  });
}

export function useUpdateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; status: "resolved" | "dismissed" }) =>
      apiFetch<ApiAlert>(`/v1/alerts/${input.id}`, {
        method: "PATCH",
        body: { status: input.status },
      }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

/* ------------------------------------------------------------- ask/packets - */

export function useAsk() {
  return useMutation({
    mutationFn: (question: string) =>
      apiFetch<ApiAskResponse>("/v1/ask", { method: "POST", body: { question } }),
  });
}

export function usePacketTemplates() {
  return useQuery({
    queryKey: qk.packetTemplates,
    queryFn: () => apiFetch<ApiPacketTemplates>("/v1/packets/templates"),
    staleTime: 60 * 60 * 1000, // static server-side data
  });
}

export function useBuildPacket() {
  return useMutation({
    mutationFn: (input: { template: string; member_ids?: string[] }) =>
      apiFetch<ApiPacketResponse>("/v1/packets", {
        method: "POST",
        body: { template: input.template, member_ids: input.member_ids ?? [] },
      }),
  });
}

/* ------------------------------------------------- whatsapp + digilocker --- */

export function useCreateLinkCode() {
  return useMutation({
    mutationFn: () => apiFetch<ApiLinkCode>("/v1/link-codes", { method: "POST" }),
  });
}

export function useCreateDigiLockerRequest() {
  return useMutation({
    mutationFn: (docTypes: string[] = []) =>
      apiFetch<{ id: string; url: string; valid_upto: string }>("/v1/digilocker/requests", {
        method: "POST",
        body: { doc_types: docTypes },
      }),
  });
}

export function useDigiLockerStatus(id: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["digilocker", id],
    queryFn: () => apiFetch<{ id: string; status: string }>(`/v1/digilocker/requests/${id}`),
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) => {
      const data = query.state.data as { status: string } | undefined;
      return data?.status === "authenticated" ? false : 2000;
    },
  });
}

export function useImportDigiLocker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ imported: { document_id: string; title: string }[]; skipped: number }>(
        `/v1/digilocker/requests/${id}/import`,
        { method: "POST" },
      ),
    onSuccess: () => invalidateFamilyData(qc),
  });
}
