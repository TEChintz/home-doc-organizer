import React, { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useDashboardData, type DashboardData } from "@/lib/api/use-dashboard-data";
import { CreateFamily } from "@/components/dashboard/create-family";
import { AlertsView } from "@/components/dashboard/views/alerts-view";
import { AskView } from "@/components/dashboard/views/ask-view";
import { PacketsView } from "@/components/dashboard/views/packets-view";
import { WhatsAppView } from "@/components/dashboard/views/whatsapp-view";
import { ConfirmQueueView } from "@/components/dashboard/views/confirm-queue-view";
import { useAlerts, useDeleteDocument } from "@/lib/api/hooks";
import {
  Search,
  Mail,
  Bell,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  Pause,
  Square,
  Play,
  Menu,
  FileText,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Lock,
  Download,
  Filter,
  Users2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  HeartPulse,
  Car,
  FileBadge,
  Check,
  Eye,
  Trash2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  type FamilyMember,
  type VaultDocument,
  DOCUMENT_CATEGORIES,
  type DocumentCategory,
} from "@/components/dashboard/dashboard-types";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { MemberVerticalView } from "@/components/dashboard/member-vertical-view";
import { AddMemberDialog } from "@/components/dashboard/add-member-dialog";
import { UploadDocumentDialog } from "@/components/dashboard/upload-document-dialog";
import { DocumentViewerDialog } from "@/components/dashboard/document-viewer-dialog";
import { ConnectDigiLockerDialog } from "@/components/dashboard/connect-digilocker-dialog";
import { GeometricDocIcon } from "@/components/dashboard/geometric-doc-icon";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
});

/** Auth gate: sign-in, then first-run family creation, then the dashboard. */
function DashboardRoute() {
  const { session, loading, configured } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && configured && !session) void navigate({ to: "/login" });
  }, [loading, configured, session, navigate]);

  if (loading) return <FullScreenSpinner />;
  if (configured && !session) return <FullScreenSpinner />;
  return <DashboardGate />;
}

function DashboardGate() {
  const data = useDashboardData();
  const { session } = useAuth();

  if (data.needsFamily) {
    const suggested =
      (session?.user.user_metadata?.["full_name"] as string | undefined) ??
      session?.user.email?.split("@")[0];
    return suggested ? <CreateFamily defaultName={suggested} /> : <CreateFamily />;
  }
  if (data.isLoading) return <FullScreenSpinner />;
  if (data.error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <p className="text-sm font-medium">Could not reach your vault</p>
          <p className="mt-1 text-sm text-zinc-500">{data.error.message}</p>
        </div>
      </div>
    );
  }
  return <DashboardPage data={data} />;
}

function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="size-5 animate-spin text-zinc-400" />
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  identity: "Identity",
  finance: "Finance",
  tax: "Tax",
  insurance: "Insurance",
  health: "Health",
  vehicles: "Vehicles",
  property: "Property",
  education: "Education",
  other: "Other",
};

const CATEGORY_PILLS: { id: DocumentCategory; label: string }[] = [
  { id: "all", label: "All Records" },
  ...DOCUMENT_CATEGORIES.map((id) => ({ id, label: CATEGORY_LABELS[id] ?? id })),
];

const ALERT_TITLES: Record<string, string> = {
  expiry: "Expiring soon",
  premium_due: "Premium due",
  missing_nominee: "No nominee on file",
  name_mismatch: "Name doesn't match",
  dob_mismatch: "Date of birth doesn't match",
};

function DashboardPage({ data }: { data: DashboardData }) {
  const { members, documents, memberNames, pendingCount, refresh } = data;

  // Active view states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  // Defaults to the signed-in member. A literal id here (it used to be the mock
  // "mem-1") never matches a real uuid, which left the panel silently empty.
  const [dashboardInlineMemberId, setDashboardInlineMemberId] = useState<string | null>(null);
  const inlineMemberId = dashboardInlineMemberId ?? data.selfMemberId ?? members[0]?.id ?? null;

  const { data: openAlerts = [] } = useAlerts("open");

  const selfMember = members.find((m) => m.id === data.selfMemberId);
  const firstName = (selfMember?.name ?? "there").split(" ")[0];
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  // Headline numbers, all derived from what is actually in the vault.
  const stats = useMemo(() => {
    const fromDigiLocker = documents.filter((d) => d.source === "digilocker").length;
    const fromWhatsApp = documents.filter((d) => d.source === "whatsapp").length;
    const insurance = documents.filter(
      (d) => d.category === "insurance" || d.category === "health",
    ).length;
    const urgent = documents.filter((d) => d.isUrgent).length;
    return { total: documents.length, fromDigiLocker, fromWhatsApp, insurance, urgent };
  }, [documents]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("all");

  // Collapsible sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal dialog states
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const [uploadForMemberId, setUploadForMemberId] = useState<string | null>(null);
  const [inspectingDoc, setInspectingDoc] = useState<VaultDocument | null>(null);
  const [connectDlTargetMember, setConnectDlTargetMember] = useState<FamilyMember | null>(null);

  // Notification and sync state
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Vault timer removed per redesign

  const activeMember = useMemo(
    () => (selectedMemberId ? members.find((m) => m.id === selectedMemberId) : null),
    [selectedMemberId, members],
  );

  // Search filter
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === "all" || doc.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [documents, searchQuery, selectedCategory]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      return (
        searchQuery === "" ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.relationship.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.statusText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [members, searchQuery]);

  const deleteDocument = useDeleteDocument();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    void signOut().then(() => navigate({ to: "/" }));
  };

  // The server is the source of truth now: every mutation refetches rather than
  // patching local arrays, so alert counts and member totals stay consistent.
  const handleAddMember = () => refresh();
  const handleUploadSuccess = () => refresh();
  const handleConnectDigiLockerSuccess = () => refresh();

  const handleDeleteDoc = (id: string) => {
    deleteDocument.mutate(id, {
      onSuccess: () => refresh(),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Could not delete"),
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-zinc-900 flex antialiased selection:bg-docket-blue/20 selection:text-docket-blue">
      {/* 1. DESKTOP COLLAPSIBLE SIDEBAR matching Donezo */}
      <div
        className={`hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-300 z-30 ${
          isSidebarCollapsed ? "w-[72px]" : "w-60 xl:w-64"
        }`}
      >
        <DashboardSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSelectedMemberId(null);
          }}
          onOpenAddMember={() => setAddMemberOpen(true)}
          pendingCount={pendingCount}
          onSignOut={handleSignOut}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* 2. MOBILE RESPONSIVE DRAWER */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <DashboardSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setSelectedMemberId(null);
              setMobileSidebarOpen(false);
            }}
            onOpenAddMember={() => {
              setMobileSidebarOpen(false);
              setAddMemberOpen(true);
            }}
            pendingCount={pendingCount}
            onSignOut={handleSignOut}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            isCollapsed={false}
          />
        </SheetContent>
      </Sheet>

      {/* 3. MAIN CANVAS */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching Donezo */}
        <header className="sticky top-0 z-20 px-5 sm:px-8 pt-4 pb-3 space-y-4 md:space-y-0 border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden size-9 rounded-full bg-white border border-zinc-200 grid place-items-center text-zinc-600 hover:text-zinc-900 shadow-xs cursor-pointer shrink-0"
                aria-label="Open navigation"
              >
                <Menu className="size-4.5" />
              </button>

              <div className="md:hidden flex items-center gap-2">
                <div className="size-8 rounded-lg bg-docket-blue text-white grid place-items-center font-bold text-sm shadow-xs">
                  D
                </div>
                <span className="font-extrabold text-zinc-900 tracking-tight text-lg">Docket</span>
              </div>

              <div className="hidden md:block">
                <h2 className="text-xl font-black tracking-tight text-zinc-900">
                  {greeting}, {firstName} 👋
                </h2>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                  Here's the latest from your secure family vault.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Search input for desktop */}
              <div className="relative hidden md:block w-64 lg:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search documents, members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-full bg-white border border-zinc-200/80 pl-10 pr-12 text-xs font-medium text-zinc-800 placeholder:text-zinc-400 shadow-xs focus:outline-none focus:ring-1 focus:ring-docket-blue"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-400">
                  ⌘ F
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("calendar")}
                className="size-10 rounded-full bg-white border border-zinc-200/80 grid place-items-center text-zinc-700 hover:bg-zinc-50 shadow-xs transition-colors cursor-pointer"
                title="Messages"
              >
                <Mail className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowNotificationToast(!showNotificationToast)}
                className="relative size-10 rounded-full bg-white border border-zinc-200/80 grid place-items-center text-zinc-700 hover:bg-zinc-50 shadow-xs transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-docket-blue ring-2 ring-white" />
              </button>

              {/* User Profile Chip matching Totok Michael in Donezo */}
              <div
                onClick={() => {
                  setSelectedMemberId(data.selfMemberId);
                  setActiveTab("dashboard");
                }}
                className="flex items-center gap-2.5 pl-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                title="View your vault"
              >
                <div className="size-9.5 rounded-full overflow-hidden border border-zinc-200 bg-amber-100 grid place-items-center text-sm font-bold shrink-0 shadow-xs">
                  <span>👨🏻‍💻</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="relative md:hidden w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents, members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full bg-zinc-100 border-none pl-10 pr-4 text-xs font-medium text-zinc-800 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-docket-blue"
            />
          </div>
          {/* Notification Toast Dropdown */}
          {showNotificationToast && (
            <div className="absolute right-5 sm:right-8 top-full mt-2 w-[calc(100%-40px)] sm:w-auto max-w-sm z-30">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
                  <span className="text-xs font-bold text-zinc-900">Vault Notifications</span>
                  <span className="text-[10px] text-docket-blue font-bold cursor-pointer">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {openAlerts.length === 0 ? (
                    <p className="p-2 text-[11px] text-zinc-500">
                      Nothing needs your attention right now.
                    </p>
                  ) : (
                    openAlerts.slice(0, 4).map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-2.5 p-2 rounded-xl ${
                          alert.severity === "high" ? "bg-amber-50/50" : "bg-emerald-50/50"
                        }`}
                      >
                        {alert.severity === "high" ? (
                          <Clock className="size-4 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="size-4 text-docket-blue shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-zinc-900">
                            {ALERT_TITLES[alert.kind] ?? "Needs attention"}
                          </p>
                          <p className="text-[11px] text-zinc-500">{alert.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main View Container */}
        <main className="flex-1 px-5 sm:px-8 py-4 space-y-6 max-w-7xl w-full mx-auto">
          {activeMember ? (
            /* Member Detailed Vertical */
            <MemberVerticalView
              member={activeMember}
              documents={documents}
              onBack={() => setSelectedMemberId(null)}
              onOpenUpload={(memId) => {
                setUploadForMemberId(memId);
                setUploadDocOpen(true);
              }}
              onOpenDocViewer={(doc) => setInspectingDoc(doc)}
              onConnectDigiLocker={(memId) => {
                const target = members.find((m) => m.id === memId);
                if (target) setConnectDlTargetMember(target);
              }}
              onDeleteDoc={handleDeleteDoc}
            />
          ) : activeTab === "tasks" ? (
            /* Dedicated Documents Vault View */
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                    Documents Vault
                  </h1>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    All authenticated, encrypted family records in one place.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setUploadForMemberId(null);
                    setUploadDocOpen(true);
                  }}
                  className="h-10 rounded-full bg-docket-blue hover:bg-[docket-blue/90] text-white text-xs font-bold px-5 shadow-xs cursor-pointer gap-1.5"
                >
                  <Plus className="size-4" />
                  <span>Upload Document</span>
                </Button>
              </div>

              {/* Category Pills */}
              <div className="inline-flex p-1 rounded-full bg-white border border-zinc-200 gap-1 overflow-x-auto shadow-xs">
                {/* Driven by the shared category list, so a tax or property
                    document is filterable rather than invisible. */}
                {CATEGORY_PILLS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-docket-blue text-white font-bold shadow-xs"
                        : "text-zinc-600 hover:text-docket-blue hover:bg-docket-blue/5"
                    }`}
                  >
                    {cat.label} (
                    {cat.id === "all"
                      ? documents.length
                      : documents.filter((d) => d.category === cat.id).length}
                    )
                  </button>
                ))}
              </div>

              {/* Documents List */}
              <div className="rounded-3xl border border-black/[0.06] bg-white overflow-hidden shadow-xs divide-y divide-zinc-100">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setInspectingDoc(doc)}
                    className="flex items-center justify-between p-4 hover:bg-zinc-50/80 transition-colors cursor-pointer gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="grid size-10 place-items-center rounded-xl bg-zinc-50 border border-zinc-200/70 shrink-0">
                        <GeometricDocIcon type={doc.iconType} color={doc.iconColor} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-zinc-900 group-hover:text-docket-blue transition-colors truncate">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {doc.memberName} • {doc.issuingAuthority} •{" "}
                          <span className="font-mono">{doc.documentNumber}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-medium text-zinc-500 hidden sm:inline">
                        {doc.dueDate}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          doc.source === "digilocker"
                            ? "bg-blue-50 border border-blue-200 text-docket-blue"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {doc.source === "digilocker" ? "DigiLocker" : "Uploaded"}
                      </span>
                      <ArrowUpRight className="size-4 text-zinc-300 group-hover:text-zinc-600 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "calendar" ? (
            <AlertsView memberNames={memberNames} />
          ) : activeTab === "analytics" ? (
            <PacketsView
              members={members}
              onUploadFor={(memId) => {
                setUploadForMemberId(memId);
                setUploadDocOpen(true);
              }}
            />
          ) : activeTab === "ask" ? (
            <AskView
              onOpenDocument={(docId) => {
                const hit = documents.find((d) => d.id === docId);
                if (hit) setInspectingDoc(hit);
              }}
            />
          ) : activeTab === "whatsapp" ? (
            <WhatsAppView />
          ) : activeTab === "review" ? (
            <ConfirmQueueView />
          ) : activeTab === "team" ? (
            /* Dedicated Family Members Grid View */
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                    Family Vault Members
                  </h1>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    Manage DigiLocker accounts, passports, health insurance, and records for
                    everyone.
                  </p>
                </div>

                <Button
                  onClick={() => setAddMemberOpen(true)}
                  className="h-10 rounded-full bg-docket-blue hover:bg-[docket-blue/90] text-white text-xs font-bold px-5 shadow-xs cursor-pointer gap-1.5"
                >
                  <Plus className="size-4" />
                  <span>Add Family Member</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-xs hover:border-docket-blue/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[170px]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Clean uniform avatar */}
                        <div className="size-12 rounded-2xl grid place-items-center text-xl shrink-0 border border-zinc-200/60 bg-zinc-50 shadow-sm">
                          <span>{member.avatarEmoji}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-zinc-900">{member.name}</h3>
                          <span className="inline-block text-[11px] font-semibold text-zinc-400">
                            {member.relationship}
                          </span>
                        </div>
                      </div>

                      {/* Clean unified status badge */}
                      <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[9px] font-bold text-zinc-600 flex items-center gap-1.5 shadow-sm">
                        <div
                          className={`size-1.5 rounded-full ${
                            member.status === "Completed"
                              ? "bg-emerald-500"
                              : member.status === "In Progress"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                        />
                        {member.status}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-zinc-500 font-medium truncate">
                        Status:{" "}
                        <span className="font-semibold text-zinc-800">{member.statusText}</span>
                      </p>
                      {member.urgentAlert && (
                        <p className="text-[11px] text-amber-600 font-bold mt-1 truncate">
                          ⚠️ {member.urgentAlert}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-medium">
                        {member.digilockerLinked ? (
                          <span className="text-docket-blue font-bold flex items-center gap-1">
                            <ShieldCheck className="size-3.5" /> DigiLocker Synced
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConnectDlTargetMember(member);
                            }}
                            className="text-docket-blue font-bold hover:underline"
                          >
                            + Connect DigiLocker
                          </button>
                        )}
                      </span>
                      <span className="font-bold text-zinc-800">
                        {documents.filter((d) => d.memberId === member.id).length} documents ↗
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Main Dashboard Overview customized 100% to Family Vault & DigiLocker */
            <>
              {/* Dashboard Title & Action Buttons Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                    Family Document Vault
                  </h1>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    Organize, verify, and track expiry dates for your entire family.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  {/* + Add Family Member Primary Green Button */}
                  <Button
                    onClick={() => setAddMemberOpen(true)}
                    className="h-10 rounded-full bg-docket-blue hover:bg-docket-blue/90 text-white text-xs font-bold px-5 shadow-xs cursor-pointer gap-1.5"
                  >
                    <Plus className="size-4" />
                    <span>Add Family Member</span>
                  </Button>

                  {/* Upload Document Outline Button */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadForMemberId(null);
                      setUploadDocOpen(true);
                    }}
                    className="h-10 rounded-full border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold px-5 shadow-xs cursor-pointer gap-1.5"
                  >
                    <Upload className="size-3.5" />
                    <span>Upload Document</span>
                  </Button>
                </div>
              </div>

              {/* 4 Metric Cards Row matching Donezo */}
              <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-3 lg:gap-4 scrollbar-hide">
                {/* Card 1: Total Documents (Deep Green Hero Card) */}
                <div
                  onClick={() => setActiveTab("tasks")}
                  className="min-w-[220px] sm:min-w-[240px] lg:min-w-0 shrink-0 lg:shrink rounded-3xl bg-docket-blue text-white p-4 lg:p-5 flex flex-col justify-between shadow-xs min-h-[110px] lg:min-h-[145px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/90">Total Documents</span>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-full bg-white text-zinc-900 shadow-xs cursor-pointer transition-all group-hover:scale-105 group-hover:text-docket-blue"
                    >
                      <ArrowUpRight className="size-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                      {stats.total}
                    </h3>
                    <div className="mt-1 lg:mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-200">
                      <span>
                        {stats.fromWhatsApp > 0
                          ? `${stats.fromWhatsApp} arrived via WhatsApp`
                          : "Confirmed and searchable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: DigiLocker Synced */}
                <div
                  onClick={() => setActiveTab("tasks")}
                  className="min-w-[220px] sm:min-w-[240px] lg:min-w-0 shrink-0 lg:shrink rounded-3xl bg-white border border-black/[0.06] p-4 lg:p-5 flex flex-col justify-between shadow-xs min-h-[110px] lg:min-h-[145px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-700">DigiLocker Synced</span>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-xs cursor-pointer transition-all group-hover:scale-105 group-hover:text-docket-blue group-hover:border-docket-blue/30"
                    >
                      <ArrowUpRight className="size-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900">
                      {stats.fromDigiLocker}
                    </h3>
                    <div className="mt-1 lg:mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
                      <span>Imported straight from the issuer</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Active Policies */}
                <div
                  onClick={() => setActiveTab("tasks")}
                  className="min-w-[220px] sm:min-w-[240px] lg:min-w-0 shrink-0 lg:shrink rounded-3xl bg-white border border-black/[0.06] p-4 lg:p-5 flex flex-col justify-between shadow-xs min-h-[110px] lg:min-h-[145px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-700">Active Policies</span>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-xs cursor-pointer transition-all group-hover:scale-105 group-hover:text-docket-blue group-hover:border-docket-blue/30"
                    >
                      <ArrowUpRight className="size-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900">
                      {stats.insurance}
                    </h3>
                    <div className="mt-1 lg:mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
                      <span>Health and insurance cover</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Expiring Soon */}
                <div
                  onClick={() => setActiveTab("calendar")}
                  className="min-w-[220px] sm:min-w-[240px] lg:min-w-0 shrink-0 lg:shrink rounded-3xl bg-white border border-black/[0.06] p-4 lg:p-5 flex flex-col justify-between shadow-xs min-h-[110px] lg:min-h-[145px] cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-700">Expiring Soon</span>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-xs cursor-pointer transition-all group-hover:scale-105 group-hover:text-docket-blue group-hover:border-docket-blue/30"
                    >
                      <ArrowUpRight className="size-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900">
                      {stats.urgent}
                    </h3>
                    <p className="mt-1 lg:mt-2 text-[10px] font-semibold text-amber-600">
                      {stats.urgent === 0
                        ? "Nothing needs attention"
                        : documents
                            .filter((d) => d.isUrgent)
                            .slice(0, 2)
                            .map((d) => d.title)
                            .join(" • ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Unified Workspace: Quick Actions, Members, Documents */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Panel 1: Quick Actions - 3 cols */}
                <div className="lg:col-span-3 rounded-3xl bg-white border border-black/[0.06] p-5 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-extrabold text-zinc-900">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2 lg:gap-3 flex-1 pb-2 lg:pb-0">
                    <button
                      type="button"
                      onClick={() => setAddMemberOpen(true)}
                      className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1.5 lg:gap-3 w-full lg:min-w-0 h-20 lg:h-auto px-2 lg:px-0 rounded-2xl border border-zinc-200 lg:border-none bg-white lg:bg-transparent hover:bg-zinc-50 lg:hover:bg-transparent transition-colors text-[10px] leading-tight lg:text-sm font-bold text-zinc-700 shadow-xs lg:shadow-none cursor-pointer"
                    >
                      <div className="grid size-8 lg:size-8 place-items-center rounded-full bg-zinc-100 text-zinc-500 lg:group-hover:bg-zinc-200 transition-colors">
                        <Plus className="size-4 lg:size-4" />
                      </div>
                      <span className="text-center lg:text-left">
                        Add
                        <br className="lg:hidden" />
                        Member
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadForMemberId(null);
                        setUploadDocOpen(true);
                      }}
                      className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1.5 lg:gap-3 w-full lg:min-w-0 h-20 lg:h-auto px-2 lg:px-0 rounded-2xl border border-zinc-200 lg:border-none bg-white lg:bg-transparent hover:bg-zinc-50 lg:hover:bg-transparent transition-colors text-[10px] leading-tight lg:text-sm font-bold text-zinc-700 shadow-xs lg:shadow-none cursor-pointer"
                    >
                      <div className="grid size-8 lg:size-8 place-items-center rounded-full bg-zinc-100 text-zinc-500 lg:group-hover:bg-zinc-200 transition-colors">
                        <Upload className="size-4 lg:size-4" />
                      </div>
                      <span className="text-center lg:text-left">
                        Upload
                        <br className="lg:hidden" />
                        Doc
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const target = members.find((m) => !m.digilockerLinked) || members[0];
                        if (target) setConnectDlTargetMember(target);
                      }}
                      className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-1.5 lg:gap-3 w-full lg:min-w-0 h-20 lg:h-auto px-2 lg:px-0 rounded-2xl border border-docket-blue/20 lg:border-none bg-docket-blue lg:bg-transparent text-white lg:text-docket-blue hover:bg-docket-blue/90 lg:hover:bg-transparent transition-colors text-[10px] leading-tight lg:text-sm font-bold shadow-xs lg:shadow-none cursor-pointer"
                    >
                      <div className="grid size-8 lg:size-8 place-items-center rounded-full bg-white/20 lg:bg-docket-blue/10 text-white lg:text-docket-blue lg:group-hover:bg-docket-blue/20 transition-colors">
                        <ShieldCheck className="size-4 lg:size-4" />
                      </div>
                      <span className="text-center lg:text-left">
                        Sync
                        <br className="lg:hidden" />
                        DL
                      </span>
                    </button>
                  </div>
                </div>
                {/* Left Column: Family Members List - 4 cols */}
                <div className="lg:col-span-4 rounded-3xl bg-white border border-black/[0.06] p-5 shadow-xs flex flex-col max-h-[500px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-extrabold text-zinc-900">Family Members</h3>
                    <button
                      type="button"
                      onClick={() => setAddMemberOpen(true)}
                      className="rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 px-3 py-1 text-[10px] font-bold text-zinc-700 cursor-pointer"
                    >
                      + Add Member
                    </button>
                  </div>

                  <div className="flex overflow-x-auto lg:flex-col gap-3 lg:gap-0 lg:space-y-1.5 overflow-y-hidden lg:overflow-y-auto pr-1 flex-1 scrollbar-hide">
                    {members.map((member) => {
                      const isSelected = inlineMemberId === member.id;
                      return (
                        <div
                          key={member.id}
                          onClick={() => setDashboardInlineMemberId(member.id)}
                          className={`flex flex-col lg:flex-row items-center lg:justify-between gap-3 p-3 lg:p-2 rounded-2xl cursor-pointer transition-all border min-w-[120px] lg:min-w-0 snap-start shrink-0 relative lg:static ${
                            isSelected
                              ? "bg-docket-blue/[0.03] border-docket-blue/20 shadow-sm"
                              : "bg-transparent border-transparent hover:bg-zinc-50/50"
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-2.5 min-w-0 text-center lg:text-left w-full">
                            {/* Unified clean avatar background */}
                            <div className="size-12 lg:size-9 rounded-full bg-zinc-100 border border-zinc-200/60 grid place-items-center text-lg lg:text-sm shrink-0">
                              <span>{member.avatarEmoji}</span>
                            </div>
                            <div className="min-w-0 w-full px-1">
                              <h4
                                className={`text-xs font-bold truncate ${isSelected ? "text-docket-blue" : "text-zinc-900"}`}
                              >
                                {member.name}
                              </h4>
                              <p className="text-[10px] text-zinc-400 truncate mt-0.5 flex flex-col lg:block">
                                <span className="lg:hidden">Status:</span>
                                <span className="hidden lg:inline">Status: </span>
                                <span className="font-semibold text-zinc-600 truncate">
                                  {member.statusText}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Clean Status Dot */}
                          <div className="shrink-0 flex items-center pr-1 absolute top-3 right-3 lg:static">
                            {member.status === "Completed" && (
                              <div
                                className="size-2 lg:size-1.5 rounded-full bg-emerald-500"
                                title="Completed"
                              />
                            )}
                            {member.status === "In Progress" && (
                              <div
                                className="size-2 lg:size-1.5 rounded-full bg-amber-500"
                                title="In Progress"
                              />
                            )}
                            {member.status === "Pending" && (
                              <div
                                className="size-2 lg:size-1.5 rounded-full bg-rose-500"
                                title="Pending"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Panel 3: Member Documents - 5 cols */}
                <div className="lg:col-span-5 rounded-3xl bg-white border border-black/[0.06] p-5 shadow-xs flex flex-col max-h-[500px]">
                  {(() => {
                    const inlineMember = members.find((m) => m.id === inlineMemberId);
                    const inlineDocs = documents.filter((d) => d.memberId === inlineMember?.id);
                    if (!inlineMember) return null;

                    return (
                      <>
                        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-zinc-100 border border-zinc-200/60 grid place-items-center text-sm">
                              <span>{inlineMember.avatarEmoji}</span>
                            </div>
                            <div>
                              <h3 className="text-sm font-extrabold text-zinc-900">
                                {inlineMember.name}'s Documents
                              </h3>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                {inlineDocs.length} items found
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedMemberId(inlineMember.id)}
                            className="rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 px-3 py-1.5 text-[10px] font-bold text-zinc-700 cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors"
                          >
                            <Eye className="size-3" /> View Full Profile
                          </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                          {inlineDocs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2">
                              <FileText className="size-8 opacity-20" />
                              <p className="text-xs font-medium">No documents yet</p>
                            </div>
                          ) : (
                            inlineDocs.map((doc) => (
                              <div
                                key={doc.id}
                                onClick={() => setInspectingDoc(doc)}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 rounded-2xl transition-all cursor-pointer group shadow-sm gap-3 sm:gap-0"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="grid size-10 place-items-center rounded-xl bg-white border border-zinc-200/70 shrink-0">
                                    <GeometricDocIcon type={doc.iconType} color={doc.iconColor} />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-bold text-zinc-900 group-hover:text-docket-blue transition-colors truncate">
                                      {doc.title}
                                    </h5>
                                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                                      {doc.issuingAuthority} •{" "}
                                      <span className="font-mono">{doc.documentNumber}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-zinc-100 sm:border-0">
                                  <span className="text-[10px] font-medium text-zinc-500 sm:hidden">
                                    Due: {doc.dueDate}
                                  </span>
                                  <span className="text-[10px] font-medium text-zinc-500 hidden sm:inline">
                                    {doc.dueDate}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                      doc.source === "digilocker"
                                        ? "bg-blue-50 border border-blue-200 text-docket-blue"
                                        : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                                    }`}
                                  >
                                    {doc.source === "digilocker" ? "DigiLocker" : "Uploaded"}
                                  </span>
                                  <ChevronRight className="size-3.5 text-zinc-300 group-hover:text-zinc-600 transition-all" />
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddMemberDialog
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        onAddMember={handleAddMember}
      />

      <UploadDocumentDialog
        open={uploadDocOpen}
        onOpenChange={setUploadDocOpen}
        members={members}
        defaultMemberId={uploadForMemberId}
        onUploadSuccess={handleUploadSuccess}
      />

      <DocumentViewerDialog
        document={inspectingDoc}
        open={!!inspectingDoc}
        onOpenChange={(open) => !open && setInspectingDoc(null)}
        onDelete={handleDeleteDoc}
      />

      <ConnectDigiLockerDialog
        member={connectDlTargetMember}
        open={!!connectDlTargetMember}
        onOpenChange={(open) => !open && setConnectDlTargetMember(null)}
        onSuccess={handleConnectDigiLockerSuccess}
      />
    </div>
  );
}
