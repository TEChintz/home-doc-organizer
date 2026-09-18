import type { components } from "./schema";

/** Server shapes, re-exported with friendlier names. Generated from /openapi.json. */
export type ApiFamily = components["schemas"]["Family"];
export type ApiMember = components["schemas"]["Member"];
export type ApiDocument = components["schemas"]["Document"];
export type ApiDocumentWithUrl = components["schemas"]["DocumentWithDownloadUrl"];
export type ApiAlert = components["schemas"]["Alert"];
export type ApiAskResponse = components["schemas"]["AskResponse"];
export type ApiPacketResponse = components["schemas"]["PacketResponse"];
export type ApiPacketTemplates = components["schemas"]["PacketTemplates"];
export type ApiLinkCode = components["schemas"]["LinkCode"];

export type DocumentStatus = ApiDocument["status"];

/** Extracted fields the UI reads. Everything is nullable by design. */
export interface Extracted {
  holder_name?: string | null;
  father_or_spouse_name?: string | null;
  dob?: string | null;
  gender?: string | null;
  id_number?: string | null;
  issuer?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  policy_number?: string | null;
  sum_assured?: string | null;
  premium_amount?: string | null;
  premium_due_date?: string | null;
  nominee_name?: string | null;
  vehicle_number?: string | null;
  address?: string | null;
  language?: string | null;
  [key: string]: unknown;
}

export function extractedOf(doc: ApiDocument): Extracted {
  return (doc.extracted ?? {}) as Extracted;
}

/** The fields the confirmation screen lets a human correct. */
export const EDITABLE_FIELDS: { key: keyof Extracted; label: string }[] = [
  { key: "holder_name", label: "Name" },
  { key: "id_number", label: "Document number" },
  { key: "policy_number", label: "Policy number" },
  { key: "dob", label: "Date of birth" },
  { key: "issuer", label: "Issued by" },
  { key: "issue_date", label: "Issued on" },
  { key: "expiry_date", label: "Expires on" },
  { key: "premium_due_date", label: "Premium due" },
  { key: "nominee_name", label: "Nominee" },
  { key: "vehicle_number", label: "Vehicle number" },
];
