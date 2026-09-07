import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  CalendarClock,
  Car,
  Check,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  Fingerprint,
  Folder,
  HeartPulse,
  Home,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Tag,
  UploadCloud,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const documents = [
  {
    title: "Car Insurance",
    detail: "Policy • State Farm",
    date: "Renews Aug 18",
    icon: Car,
    tone: "bg-docket-blue text-docket-blue-foreground",
  },
  {
    title: "Pediatrician Report",
    detail: "Medical • Annual",
    date: "Added today",
    icon: HeartPulse,
    tone: "bg-docket-mint text-docket-mint-foreground",
  },
  {
    title: "Home Warranty",
    detail: "Coverage • Kitchen",
    date: "Expires Dec 4",
    icon: Home,
    tone: "bg-docket-gold text-docket-gold-foreground",
  },
  {
    title: "Tax Records",
    detail: "Finance • 2026",
    date: "Locked",
    icon: FileCheck2,
    tone: "bg-docket-lilac text-docket-lilac-foreground",
  },
];

const categories = ["Insurance", "Medical", "Vehicle", "Warranty"];

const extractedFields = [
  ["Issuer", "State Farm"],
  ["Policy", "Auto Protect Plus"],
  ["Renewal", "Aug 18, 2026"],
  ["VIN", "•••• •••• 4381"],
];

const timeline = [
  { label: "Home Warranty", status: "Reviewed", when: "Today", urgent: false },
  { label: "Vehicle Registration", status: "Expires in 14 Days", when: "Sep 21", urgent: true },
  { label: "Dental Insurance", status: "Renews soon", when: "Oct 02", urgent: false },
  { label: "Passport Copies", status: "Secure", when: "Nov 12", urgent: false },
];

const household = [
  { name: "Maya", role: "Owner", initials: "M", icon: ShieldCheck },
  { name: "Arun", role: "Adult", initials: "A", icon: UsersRound },
  { name: "Nina", role: "Viewer", initials: "N", icon: LockKeyhole },
];

function GoogleMark() {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-background text-xs font-black text-brand shadow-inner-soft">
      G
    </span>
  );
}

function BrandMark() {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-brand/20 bg-background shadow-soft">
        <Folder className="size-5 text-brand" aria-hidden="true" />
      </span>
      <span className="text-base font-extrabold tracking-normal text-foreground">Docket</span>
    </div>
  );
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold shadow-inner-soft",
        dark
          ? "border-security-line bg-security-panel text-security-muted"
          : "border-border bg-background/80 text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-5xl animate-fade-in">
      <div className="absolute left-1/2 top-7 h-20 w-20 -translate-x-1/2 rounded-full bg-brand/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-background/85 shadow-dashboard backdrop-blur-xl">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border/70 bg-surface/80 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-brand">
              <Folder className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-foreground">Family Vault</p>
              <p className="truncate text-xs font-semibold text-muted-foreground">32 documents organized</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-bold text-muted-foreground sm:flex">
            <span className="size-2 rounded-full bg-docket-mint" />
            Live sync
          </div>
        </div>

        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="hidden rounded-3xl border border-border bg-surface/70 p-4 lg:block">
            <p className="mb-4 text-xs font-extrabold uppercase text-muted-foreground">Categories</p>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={category}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-bold",
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground",
                  )}
                >
                  <span>{category}</span>
                  <span className="rounded-full bg-surface/35 px-2 py-0.5 text-xs">{index + 4}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="min-w-0">
                <p className="truncate text-xl font-black text-foreground">Documents</p>
                <p className="truncate text-sm font-medium text-muted-foreground">Sorted by what needs attention</p>
              </div>
              <div className="rounded-full bg-brand-soft px-3 py-2 text-xs font-black text-brand">
                4 alerts
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {documents.map((document) => {
                const Icon = document.icon;
                return (
                  <article
                    key={document.title}
                    className="group rounded-3xl border border-border bg-background p-4 shadow-soft transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                      <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", document.tone)}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-extrabold text-foreground">{document.title}</h3>
                        <p className="truncate text-xs font-semibold text-muted-foreground">{document.detail}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-muted-foreground">{document.date}</span>
                      <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-black text-brand">
                        Vaulted
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyPaper() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-background p-5 shadow-glass">
      <div className="scan-line absolute inset-x-5 top-24 z-10 h-1 rounded-full bg-brand shadow-brand" />
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs font-black uppercase text-muted-foreground">Auto policy</p>
          <h3 className="text-lg font-black text-foreground">Insurance statement</h3>
        </div>
        <FileText className="size-9 text-brand" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-5/6 rounded-full bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-3 w-4/5 rounded-full bg-muted" />
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="h-16 rounded-2xl border border-border bg-surface" />
          <div className="h-16 rounded-2xl border border-border bg-surface" />
        </div>
        <div className="h-3 w-11/12 rounded-full bg-muted" />
        <div className="h-3 w-3/4 rounded-full bg-muted" />
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-surface p-4">
          <div className="h-3 w-1/2 rounded-full bg-muted" />
          <div className="mt-3 h-3 w-2/3 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

function ExtractedCard() {
  return (
    <div className="rounded-[1.75rem] border border-border bg-background/90 p-5 shadow-dashboard backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-brand">Extracted</p>
          <h3 className="text-lg font-black text-foreground">Clean record</h3>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
      </div>
      <div className="space-y-3">
        {extractedFields.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-3">
            <span className="text-xs font-bold text-muted-foreground">{label}</span>
            <span className="text-right text-sm font-black text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineWidget() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-background/90 p-5 shadow-dashboard backdrop-blur-xl sm:p-7">
      <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-foreground">Renewal timeline</p>
          <p className="truncate text-xs font-semibold text-muted-foreground">All household deadlines</p>
        </div>
        <Bell className="size-5 shrink-0 text-brand" aria-hidden="true" />
      </div>
      <div className="relative space-y-4 before:absolute before:left-4 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-border sm:before:left-5">
        {timeline.map((item) => (
          <div key={item.label} className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
            <span
              className={cn(
                "z-10 grid size-8 shrink-0 place-items-center rounded-full border bg-background sm:size-10",
                item.urgent ? "border-docket-red text-docket-red" : "border-border text-brand",
              )}
            >
              {item.urgent ? <Clock3 className="size-4" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
            </span>
            <div
              className={cn(
                "min-w-0 rounded-2xl border p-4",
                item.urgent ? "border-docket-red/40 bg-docket-red-soft" : "border-border bg-surface",
              )}
            >
              <p className="truncate text-sm font-black text-foreground">{item.label}</p>
              <p className={cn("truncate text-xs font-bold", item.urgent ? "text-docket-red" : "text-muted-foreground")}>{item.status}</p>
            </div>
            <span className="shrink-0 text-xs font-black text-muted-foreground">{item.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HouseholdPanel() {
  return (
    <div className="relative rounded-[2rem] border border-border/80 bg-background/60 p-5 shadow-dashboard backdrop-blur-xl sm:p-7">
      <div className="absolute -right-4 -top-4 grid size-16 place-items-center rounded-3xl border border-border bg-surface shadow-soft">
        <UsersRound className="size-7 text-brand" aria-hidden="true" />
      </div>
      <div className="mb-6">
        <p className="text-xs font-black uppercase text-muted-foreground">Household access</p>
        <h3 className="text-xl font-black text-foreground">Shared vault</h3>
      </div>
      <div className="space-y-3">
        {household.map((person) => {
          const Icon = person.icon;
          return (
            <div key={person.name} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-background/85 p-3 shadow-soft">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-black text-brand">
                {person.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-foreground">{person.name}</p>
                <p className="truncate text-xs font-semibold text-muted-foreground">Family member</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-black text-foreground">
                <Icon className="size-3.5 text-brand" aria-hidden="true" />
                {person.role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LockVisual() {
  return (
    <div className="relative mx-auto grid size-64 place-items-center sm:size-80">
      <div className="absolute inset-0 rounded-full bg-security-glow blur-3xl" />
      <div className="lock-shackle absolute top-10 h-32 w-40 rounded-t-full border-[18px] border-b-0 border-security-metal shadow-metal sm:h-40 sm:w-52" />
      <div className="relative mt-20 grid h-36 w-48 place-items-center rounded-[2rem] border border-security-line bg-security-metal shadow-metal sm:h-44 sm:w-60">
        <div className="absolute inset-x-8 top-5 h-px bg-security-highlight" />
        <div className="grid size-16 place-items-center rounded-full border border-security-line bg-security-panel text-security-foreground shadow-inner-soft">
          <Fingerprint className="size-8" aria-hidden="true" />
        </div>
        <div className="absolute bottom-5 flex gap-2">
          <span className="h-2 w-8 rounded-full bg-security-highlight" />
          <span className="h-2 w-5 rounded-full bg-security-line" />
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <section className="relative min-h-screen overflow-hidden border-b border-border bg-grid-fade px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-6 rounded-[2rem] border border-border/70" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

        <nav className="relative z-10 mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-full border border-border/80 bg-background/75 px-3 py-3 shadow-glass backdrop-blur-xl sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-4">
          <BrandMark />
          <div className="hidden items-center gap-8 text-sm font-bold text-muted-foreground sm:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#security" className="transition-colors hover:text-foreground">
              Security
            </a>
          </div>
          <div className="flex justify-end">
            <Button className="h-10 rounded-full px-5 text-sm font-extrabold shadow-brand">Sign In</Button>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5.5rem)] max-w-6xl flex-col justify-between pt-16 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <SectionLabel>Secure family vault</SectionLabel>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              Your family's life. Organized.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">
              Insurance, warranties, medical reports, and vehicle papers in one secure vault.
            </p>
            <div className="mt-8 flex justify-center">
              <Button className="h-12 rounded-full px-5 text-sm font-black shadow-brand sm:px-7">
                <GoogleMark />
                Sign In with Google
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="mt-12 translate-y-10 sm:mt-16 sm:translate-y-16">
            <DashboardMockup />
          </div>
        </div>
      </section>

      <section id="features" className="relative overflow-hidden bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="max-w-xl">
            <SectionLabel>Auto-Extraction</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight text-foreground sm:text-5xl">Drop it in. We do the reading.</h2>
            <p className="mt-4 text-base font-medium leading-7 text-muted-foreground sm:text-lg">
              Upload any document. The vault instantly extracts the issuer, title, and critical dates while you do nothing.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PolicyPaper />
            <ExtractedCard />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <SectionLabel>Expiry Tracking</SectionLabel>
          <h2 className="mt-5 text-4xl font-black leading-tight text-foreground sm:text-5xl">Never miss a renewal.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">
            Automatic alerts before your policies, warranties, or registrations lapse. Peace of mind, built in.
          </p>
        </div>
        <div className="mt-12">
          <TimelineWidget />
        </div>
      </section>

      <section className="relative overflow-hidden bg-grid-fade px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="order-2 lg:order-1">
            <HouseholdPanel />
          </div>
          <div className="order-1 max-w-xl lg:order-2 lg:ml-auto">
            <SectionLabel>Role-Based Access</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight text-foreground sm:text-5xl">Shared with the house. Controlled by you.</h2>
            <p className="mt-4 text-base font-medium leading-7 text-muted-foreground sm:text-lg">
              Invite family members with a single tap. Give everyone the access they need, and nothing they don't.
            </p>
          </div>
        </div>
      </section>

      <section id="security" className="relative overflow-hidden bg-security px-4 py-24 text-security-foreground sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-security-grid opacity-70" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="max-w-xl">
            <SectionLabel dark>Privacy & Security</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">Private by design.</h2>
            <p className="mt-5 text-base font-medium leading-7 text-security-muted sm:text-lg">
              Sensitive identifiers are instantly locked and masked. Your family's data never leaves your control.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-security-line bg-security-panel p-4">
                <Tag className="mb-4 size-5 text-brand-bright" aria-hidden="true" />
                <p className="text-sm font-black">Masked IDs</p>
                <p className="mt-1 text-xs font-semibold text-security-muted">Aadhaar, VIN, and policy numbers stay hidden.</p>
              </div>
              <div className="rounded-3xl border border-security-line bg-security-panel p-4">
                <Mail className="mb-4 size-5 text-brand-bright" aria-hidden="true" />
                <p className="text-sm font-black">Private alerts</p>
                <p className="mt-1 text-xs font-semibold text-security-muted">Only the right household members are notified.</p>
              </div>
            </div>
          </div>
          <LockVisual />
        </div>
      </section>

      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Ready in seconds</SectionLabel>
          <h2 className="mt-5 text-4xl font-black leading-tight text-foreground sm:text-6xl">Take control of the paperwork.</h2>
          <div className="mt-8 flex justify-center">
            <Button className="h-12 rounded-full px-5 text-sm font-black shadow-brand sm:px-7">
              <GoogleMark />
              Sign In with Google
            </Button>
          </div>
          <p className="mt-5 text-sm font-semibold text-muted-foreground">No separate account required. Setup takes seconds.</p>
        </div>
      </section>

      <footer className="border-t border-border bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 text-sm font-semibold text-muted-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <p>© 2026 Docket. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#security" className="transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Docket — Family Document Vault" },
      {
        name: "description",
        content: "Docket organizes insurance, warranties, medical reports, and vehicle papers in one secure family vault.",
      },
      { property: "og:title", content: "Docket — Family Document Vault" },
      {
        property: "og:description",
        content: "Insurance, warranties, medical reports, and vehicle papers in one secure vault.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Docket — Family Document Vault" },
      {
        name: "twitter:description",
        content: "Insurance, warranties, medical reports, and vehicle papers in one secure vault.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});
