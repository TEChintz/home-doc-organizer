import React, { useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Plus,
  FileText,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Download,
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle2,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  FamilyMember,
  VaultDocument,
  DocumentCategory,
} from "./dashboard-types";
import { GeometricDocIcon } from "./geometric-doc-icon";

interface MemberVerticalViewProps {
  member: FamilyMember;
  documents: VaultDocument[];
  onBack: () => void;
  onOpenUpload: (memberId: string) => void;
  onOpenDocViewer: (doc: VaultDocument) => void;
  onConnectDigiLocker: (memberId: string) => void;
  onDeleteDoc?: (id: string) => void;
}

export function MemberVerticalView({
  member,
  documents,
  onBack,
  onOpenUpload,
  onOpenDocViewer,
  onConnectDigiLocker,
  onDeleteDoc,
}: MemberVerticalViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const memberDocs = documents.filter((d) => d.memberId === member.id);
  const filteredDocs =
    selectedCategory === "all"
      ? memberDocs
      : memberDocs.filter((d) => d.category === selectedCategory);

  const categories: { id: DocumentCategory; label: string }[] = [
    { id: "all", label: "All Records" },
    { id: "identity", label: "Identity" },
    { id: "health", label: "Health & Insurance" },
    { id: "vehicles", label: "Vehicles" },
    { id: "finance", label: "Finance & Tax" },
  ];

  const handleSyncDigiLocker = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert(`DigiLocker synchronized successfully for ${member.name}. All verified records are up to date.`);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer bg-white px-4 py-2 rounded-full border border-zinc-200/80 shadow-xs hover:bg-zinc-50"
        >
          <ArrowLeft className="size-3.5 text-docket-blue" />
          <span>Back to All Members</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Exporting ${member.name}'s encrypted vault as a password-protected bundle...`)}
            className="rounded-full text-xs font-bold h-9 border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 shadow-xs cursor-pointer gap-1.5"
          >
            <Download className="size-3.5 text-zinc-500" />
            <span>Export Vault</span>
          </Button>

          <Button
            size="sm"
            onClick={() => onOpenUpload(member.id)}
            className="rounded-full bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-bold h-9 px-4.5 shadow-xs cursor-pointer gap-1.5"
          >
            <Plus className="size-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* Member Profile Hero Card matching Donezo */}
      <div className="rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4.5">
          <div
            className={`size-16 rounded-2xl grid place-items-center text-3xl shadow-xs shrink-0 ${member.avatarBg}`}
          >
            <span>{member.avatarEmoji}</span>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
                {member.name}
              </h1>
              <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-bold text-zinc-700">
                {member.relationship}
              </span>
              {member.bloodGroup && (
                <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                  Blood: {member.bloodGroup}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400 font-medium mt-1">
              {member.age ? `${member.age} years` : ""}
              {member.dob ? ` • Born ${member.dob}` : ""}
              {" • "}
              <span className="font-semibold text-zinc-700">
                {memberDocs.length} {memberDocs.length === 1 ? "document" : "documents"} in vault
              </span>
            </p>
          </div>
        </div>

        {/* DigiLocker Status Hub on Hero Card */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {member.digilockerLinked ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-docket-blue/20 bg-docket-blue/[0.05] px-3.5 py-1.5 text-xs font-bold text-docket-blue">
                <ShieldCheck className="size-4 text-docket-blue" />
                <span>DigiLocker Linked ({member.digilockerAadhaarMasked})</span>
              </div>
              <button
                type="button"
                onClick={handleSyncDigiLocker}
                disabled={isSyncing}
                title="Sync latest records from DigiLocker"
                className="size-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 grid place-items-center text-zinc-600 shadow-xs cursor-pointer transition-colors"
              >
                <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin text-docket-blue" : ""}`} />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConnectDigiLocker(member.id)}
              className="rounded-full text-xs font-bold h-9 border-docket-blue/30 bg-docket-blue/[0.03] hover:bg-docket-blue/10 text-docket-blue shadow-xs cursor-pointer gap-1.5 px-4"
            >
              <Sparkles className="size-3.5 text-docket-blue" />
              <span>Connect DigiLocker Account</span>
            </Button>
          )}
        </div>
      </div>

      {/* Urgent Alerts or Missing Documents Banner */}
      {member.urgentAlert && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-amber-100 grid place-items-center text-amber-700 shrink-0">
              <AlertTriangle className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-amber-900">Attention Required</h4>
              <p className="text-[11px] text-amber-700">{member.urgentAlert}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => {
              if (!member.digilockerLinked) {
                onConnectDigiLocker(member.id);
              } else {
                alert(`Opening renewal assistance for ${member.name}...`);
              }
            }}
            className="rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-8 px-3.5 shrink-0 shadow-xs cursor-pointer"
          >
            Resolve Now
          </Button>
        </div>
      )}

      {/* Missing Essential Records Checklist */}
      {member.missingDocs && member.missingDocs.length > 0 && (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-zinc-400" />
              <h3 className="text-xs font-extrabold text-zinc-800">
                Missing Recommended Documents for {member.name.split(" ")[0]}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-zinc-400">
              {member.missingDocs.length} recommended
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {member.missingDocs.map((docName, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60"
              >
                <span className="text-xs font-semibold text-zinc-700 truncate">{docName}</span>
                <button
                  type="button"
                  onClick={() => onOpenUpload(member.id)}
                  className="text-[10px] font-bold text-docket-blue hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="size-3" /> Upload
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Segmented Control & Document List */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-zinc-900">
            Vault Documents ({memberDocs.length})
          </h2>

          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-full bg-zinc-200/60 border border-zinc-200 gap-1 overflow-x-auto">
            {categories.map((cat) => {
              const count =
                cat.id === "all"
                  ? memberDocs.length
                  : memberDocs.filter((d) => d.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-docket-blue text-white font-bold shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 font-medium"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Grouped Inset Document List */}
        {filteredDocs.length > 0 ? (
          <div className="rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-xs divide-y divide-zinc-100">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocViewer(doc)}
                className="flex items-center justify-between p-4 hover:bg-zinc-50/80 transition-colors cursor-pointer gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="grid size-10 place-items-center rounded-xl bg-zinc-50 border border-zinc-200/70 shrink-0">
                    <GeometricDocIcon type={doc.iconType} color={doc.iconColor} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-zinc-900 group-hover:text-docket-blue transition-colors truncate">
                        {doc.title}
                      </h3>
                      {doc.isUrgent && (
                        <span className="rounded-md bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[9px] font-bold text-rose-600">
                          Due Soon
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {doc.issuingAuthority} • <span className="font-mono">{doc.documentNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-medium text-zinc-400 hidden sm:inline">
                    {doc.expiryDate ? `Expires: ${doc.expiryDate}` : doc.issuedDate}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      doc.source === "digilocker"
                        ? "bg-docket-blue/[0.05] border border-docket-blue/20 text-docket-blue"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {doc.source === "digilocker" ? "DigiLocker" : "Uploaded"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDocViewer(doc);
                      }}
                      className="size-8 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 grid place-items-center cursor-pointer"
                      title="Inspect"
                    >
                      <Eye className="size-3.5" />
                    </button>
                    {onDeleteDoc && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove ${doc.title} from vault?`)) {
                            onDeleteDoc(doc.id);
                          }
                        }}
                        className="size-8 rounded-lg text-zinc-300 hover:text-rose-600 hover:bg-rose-50 grid place-items-center cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                  <ChevronRight className="size-4 text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-xs">
            <FileText className="mx-auto size-10 text-zinc-300 mb-2" />
            <p className="text-xs font-bold text-zinc-800">No documents in this category</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Upload a document or connect DigiLocker to keep {member.name.split(" ")[0]}'s vault complete.
            </p>
            <Button
              size="sm"
              onClick={() => onOpenUpload(member.id)}
              className="mt-4 rounded-full bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-bold px-4 h-9 cursor-pointer shadow-xs"
            >
              Upload Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
