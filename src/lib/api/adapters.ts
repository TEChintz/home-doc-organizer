import type {
  DocumentCategory,
  FamilyMember,
  VaultDocument,
} from "@/components/dashboard/dashboard-types";
import { extractedOf, type ApiAlert, type ApiDocument, type ApiMember } from "./types";

/**
 * Converts API rows into the view model the dashboard already speaks, so no
 * component had to be rewritten to take real data.
 */

/** The API's category names differ from the UI's in two places. */
const CATEGORY_MAP: Record<string, DocumentCategory> = {
  identity: "identity",
  financial: "finance",
  tax: "tax",
  insurance: "insurance",
  property: "property",
  education: "education",
  health: "health",
  vehicle: "vehicles",
  other: "other",
};

export function toCategory(apiCategory: string): DocumentCategory {
  return CATEGORY_MAP[apiCategory] ?? "other";
}

/** Reverse direction, for sending a filter back to the API. */
export function toApiCategory(category: DocumentCategory): string | undefined {
  if (category === "all") return undefined;
  const hit = Object.entries(CATEGORY_MAP).find(([, ui]) => ui === category);
  return hit?.[0];
}

const ICON_TYPES: VaultDocument["iconType"][] = ["stripes", "arc", "pinwheel", "crescent", "dots"];

const CATEGORY_COLOR: Record<string, string> = {
  identity: "#3b82f6",
  finance: "#0d9488",
  tax: "#8b5cf6",
  insurance: "#f59e0b",
  health: "#10b981",
  vehicles: "#ea580c",
  property: "#ec4899",
  education: "#06b6d4",
  other: "#64748b",
};

/** Stable hash so a document keeps the same icon between refetches. */
function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatSize(bytes: number | null | undefined): string | undefined {
  if (!bytes || bytes <= 0) return undefined;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function toVaultDocument(
  doc: ApiDocument,
  memberName: string,
  alerts: ApiAlert[] = [],
): VaultDocument {
  const extracted = extractedOf(doc);
  const category = toCategory(doc.category);

  const openAlerts = alerts.filter((a) => a.document_id === doc.id && a.status === "open");
  const isUrgent = openAlerts.some((a) => a.severity === "high");

  const dueDate = doc.due_date ?? doc.expiry_date;

  const view: VaultDocument = {
    id: doc.id,
    title: doc.title,
    category,
    memberId: doc.owner_member_id ?? "",
    memberName,
    documentNumber: extracted.id_number ?? extracted.policy_number ?? "—",
    issuingAuthority: extracted.issuer ?? "—",
    issuedDate: formatDate(extracted.issue_date),
    dueDate: dueDate ? `Due date: ${formatDate(dueDate)}` : "No renewal date",
    iconType: ICON_TYPES[hash(doc.doc_type) % ICON_TYPES.length] ?? "stripes",
    iconColor: CATEGORY_COLOR[category] ?? "#64748b",
    source:
      doc.source === "digilocker"
        ? "digilocker"
        : doc.source === "whatsapp"
          ? "whatsapp"
          : "upload",
    isUrgent,
    status: doc.status,
    error: doc.error,
  };

  // Optional keys are added only when present: the project enables
  // `exactOptionalPropertyTypes`, which rejects an explicit `undefined`.
  if (doc.expiry_date) view.expiryDate = formatDate(doc.expiry_date);
  const size = formatSize(doc.size_bytes);
  if (size) view.fileSize = size;

  return view;
}

const RELATIONSHIPS: FamilyMember["relationship"][] = [
  "Self",
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Other",
];

function toRelationship(relation: string | null, isSelf: boolean): FamilyMember["relationship"] {
  if (isSelf) return "Self";
  const match = RELATIONSHIPS.find((r) => r.toLowerCase() === (relation ?? "").toLowerCase());
  return match ?? "Other";
}

const AVATAR_BGS = [
  "bg-amber-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-rose-100",
  "bg-docket-blue/10",
];
const AVATAR_EMOJIS = ["🧑🏻", "👨🏼‍🦳", "👵🏼", "👩🏻‍💼", "👦🏻", "👧🏻", "🧓🏽"];

function ageFrom(dob: string | null): number | undefined {
  if (!dob) return undefined;
  const born = new Date(`${dob}T00:00:00Z`);
  if (Number.isNaN(born.getTime())) return undefined;
  const now = new Date();
  let age = now.getUTCFullYear() - born.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < born.getUTCMonth() ||
    (now.getUTCMonth() === born.getUTCMonth() && now.getUTCDate() < born.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function toFamilyMember(
  member: ApiMember,
  documents: ApiDocument[],
  alerts: ApiAlert[],
  selfMemberId: string | null,
): FamilyMember {
  const mine = documents.filter((d) => d.owner_member_id === member.id);
  const myAlerts = alerts.filter((a) => a.status === "open" && a.member_id === member.id);
  const urgent = myAlerts.find((a) => a.severity === "high") ?? myAlerts[0];

  // The API has no per-member DigiLocker flag; having an imported document is
  // the only honest signal available.
  const digilockerLinked = mine.some((d) => d.source === "digilocker");

  const status: FamilyMember["status"] =
    myAlerts.length === 0 ? "Completed" : urgent?.severity === "high" ? "Pending" : "In Progress";

  const statusText =
    myAlerts.length === 0
      ? mine.length === 0
        ? "No documents yet"
        : "All records up to date"
      : `${myAlerts.length} item${myAlerts.length === 1 ? "" : "s"} need attention`;

  const seed = hash(member.id);

  const view: FamilyMember = {
    id: member.id,
    name: member.name,
    relationship: toRelationship(member.relation, member.id === selfMemberId),
    statusText,
    status,
    avatarBg: AVATAR_BGS[seed % AVATAR_BGS.length] ?? "bg-muted",
    avatarEmoji: AVATAR_EMOJIS[seed % AVATAR_EMOJIS.length] ?? "🧑",
    digilockerLinked,
    documentsCount: mine.length,
    missingDocs: myAlerts.filter((a) => a.kind === "missing_nominee").map((a) => a.message),
  };

  if (member.phone) view.digilockerPhone = member.phone;
  const age = ageFrom(member.dob);
  if (age !== undefined) view.age = age;
  if (member.dob) view.dob = formatDate(member.dob);
  if (urgent?.message) view.urgentAlert = urgent.message;

  return view;
}

/** Members keyed by id, for resolving owner names cheaply. */
export function memberNameMap(members: ApiMember[]): Map<string, string> {
  return new Map(members.map((m) => [m.id, m.name]));
}
