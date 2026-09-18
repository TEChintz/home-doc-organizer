export type DocumentCategory =
  | "all"
  | "identity"
  | "health"
  | "vehicles"
  | "finance"
  | "education"
  // Added to match the API's taxonomy. Without these, a Form 16 or an insurance
  // policy would be filtered out of every view instead of merely uncategorised.
  | "tax"
  | "insurance"
  | "property"
  | "other";

/** Categories shown as filter chips, in order. `all` is handled separately. */
export const DOCUMENT_CATEGORIES: Exclude<DocumentCategory, "all">[] = [
  "identity",
  "finance",
  "tax",
  "insurance",
  "health",
  "vehicles",
  "property",
  "education",
  "other",
];

export interface FamilyMember {
  id: string;
  name: string;
  relationship: "Self" | "Spouse" | "Father" | "Mother" | "Son" | "Daughter" | "Other";
  statusText: string;
  status: "Completed" | "In Progress" | "Pending";
  avatarBg: string;
  avatarEmoji: string;
  digilockerLinked: boolean;
  digilockerAadhaarMasked?: string;
  digilockerPhone?: string;
  digilockerLastSync?: string;
  documentsCount: number;
  age?: number;
  dob?: string;
  bloodGroup?: string;
  missingDocs?: string[];
  urgentAlert?: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  memberId: string;
  memberName: string;
  documentNumber: string;
  issuingAuthority: string;
  issuedDate: string;
  expiryDate?: string;
  dueDate: string;
  iconType: "stripes" | "arc" | "pinwheel" | "crescent" | "dots";
  iconColor: string;
  source: "digilocker" | "upload" | "whatsapp";
  fileSize?: string;
  isUrgent?: boolean;
  /** Server-side pipeline state; only `confirmed` documents drive alerts. */
  status?: "uploading" | "processing" | "needs_confirmation" | "confirmed" | "failed";
  /** Why extraction failed, when status is `failed`. */
  error?: string | null;
}
