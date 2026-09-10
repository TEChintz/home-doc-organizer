import { createFileRoute, Link } from "@tanstack/react-router";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import {
  Bell,
  CalendarClock,
  Car,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Fingerprint,
  Folder,
  HeartPulse,
  Home,
  Landmark,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Tag,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { DocketLogo } from "@/components/ui/docket-logo";

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
      <DocketLogo className="size-8 text-brand drop-shadow-sm" />
      <span className="text-xl font-extrabold tracking-tight text-foreground">Docket</span>
    </div>
  );
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold shadow-inner-soft",
        dark
          ? "border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(255,255,255,0.05)]"
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
    <div className="relative flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-glass">
      <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4">
        <div>
          <p className="text-xs font-black uppercase text-muted-foreground">Auto policy</p>
          <h3 className="text-lg font-black text-foreground">Insurance statement</h3>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl bg-brand-soft text-brand">
          <FileText className="size-5" aria-hidden="true" />
        </div>
      </div>
      
      <div className="relative flex-1 bg-muted/30 p-4 sm:p-6 shadow-inner-soft">
        <div className="relative mx-auto aspect-[8.5/11] w-full max-w-[280px] overflow-hidden rounded-md border border-border/50 bg-background shadow-md">
          <div className="scan-line absolute inset-x-0 top-0 z-20 h-0.5 bg-brand shadow-[0_0_12px_2px_color-mix(in_oklab,var(--brand)_60%,transparent)]" />
          
          {/* Scaled High-Res Container */}
          <div className="absolute left-0 top-0 w-[200%] h-[200%] origin-top-left scale-50 flex flex-col px-10 py-12 text-sm text-foreground/80">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="text-2xl font-black text-brand tracking-tight">STATE FARM</p>
                <p className="text-base text-muted-foreground font-medium">Auto Insurance</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">DECLARATIONS PAGE</p>
                <p className="text-base font-medium">Policy: <span className="font-bold text-brand">Auto Protect Plus</span></p>
              </div>
            </div>
            
            <div className="mb-8 h-0.5 w-full bg-border/60" />
            
            {/* Insured Info */}
            <div className="mb-8 grid grid-cols-2 gap-8">
              <div>
                <p className="mb-2 text-xs font-bold tracking-wider text-foreground">NAMED INSURED</p>
                <div className="text-base leading-relaxed">
                  <p className="font-bold text-foreground">Maya Patel</p>
                  <p>123 Main Street</p>
                  <p>San Francisco, CA 94105</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold tracking-wider text-foreground">POLICY PERIOD</p>
                <div className="text-base leading-relaxed">
                  <p>Effective: Aug 18, 2025</p>
                  <p className="mt-1 whitespace-nowrap font-bold text-brand">
                    Renewal: Aug 18, 2026
                  </p>
                </div>
              </div>
            </div>

            {/* Covered Vehicles */}
            <div className="mb-8 rounded-xl border-2 border-border/40 bg-surface/30 p-5">
              <p className="mb-3 text-xs font-bold tracking-wider text-foreground">COVERED VEHICLE</p>
              <div className="flex justify-between text-base font-medium">
                <span className="text-foreground">2026 Tesla Model 3</span>
                <span className="font-mono text-muted-foreground">VIN: <span className="font-bold text-brand">•••• •••• 4381</span></span>
              </div>
            </div>
            
            {/* Coverages */}
            <div className="mb-8">
              <p className="mb-3 border-b-2 border-border/40 pb-2 text-xs font-bold tracking-wider text-foreground">
                COVERAGES & LIMITS
              </p>
              <div className="space-y-3 pt-2 text-base">
                <div className="flex justify-between">
                  <span>Bodily Injury Liability</span>
                  <span className="font-medium text-foreground">$250k / $500k</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Damage</span>
                  <span className="font-medium text-foreground">$100k</span>
                </div>
                <div className="flex justify-between">
                  <span>Comprehensive (Ded.)</span>
                  <span className="font-medium text-foreground">$500</span>
                </div>
                <div className="flex justify-between">
                  <span>Collision (Ded.)</span>
                  <span className="font-medium text-foreground">$500</span>
                </div>
              </div>
            </div>
            
            {/* Premium */}
            <div className="mt-auto flex items-end justify-between border-t-2 border-border/60 pt-6">
              <div>
                <p className="mb-1 text-xs font-bold tracking-wider text-foreground">TOTAL PREMIUM</p>
                <p className="text-sm font-medium text-muted-foreground">6 Month Policy</p>
              </div>
              <p className="text-4xl font-black text-foreground tracking-tight">$846.00</p>
            </div>
            
            {/* Fine print */}
            <div className="mt-8 text-center text-xs text-muted-foreground/60 font-medium">
              <p>This is a summary of coverages. Please refer to your actual policy for complete details.</p>
              <p className="mt-1">Page 1 of 4 • Document ID: SF-8492-AX</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function ExtractedCard() {
  return (
    <div className="relative flex h-full flex-col justify-center py-4 lg:pl-6">
      <div className="mb-6 flex items-center justify-between gap-3 lg:pl-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-brand">Data Extracted</p>
          <h3 className="text-lg font-black text-foreground">Clean record</h3>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl bg-brand-soft text-brand">
          <FileCheck2 className="size-5" aria-hidden="true" />
        </div>
      </div>

      {/* Unified container for the extracted fields */}
      <div className="relative rounded-[1.5rem] border border-border/60 bg-surface/40 p-2 shadow-inner-soft backdrop-blur-md">
        
        <div className="relative flex flex-col gap-1">
          {/* Wavy Connection Lines */}
          <div className="pointer-events-none absolute -left-16 top-0 bottom-0 hidden w-16 lg:block">
            <svg className="h-full w-full overflow-visible text-brand/60" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="currentColor" />
                </marker>
              </defs>
              <path d="M 0 50 C 40 50, 60 12.5, 100 12.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" markerEnd="url(#arrow)" />
              <path d="M 0 50 C 40 50, 60 37.5, 100 37.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" markerEnd="url(#arrow)" />
              <path d="M 0 50 C 40 50, 60 62.5, 100 62.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" markerEnd="url(#arrow)" />
              <path d="M 0 50 C 40 50, 60 87.5, 100 87.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" markerEnd="url(#arrow)" />
            </svg>
          </div>

          {extractedFields.map(([label, value]) => (
            <div
              key={label}
              className="relative flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-background/90 p-3 shadow-sm transition-colors duration-300 hover:border-brand/40"
            >
              <span className="text-xs font-bold text-muted-foreground pl-2">{label}</span>
              <span className="text-right text-sm font-black text-foreground pr-1">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DigiLockerVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[450px] overflow-visible">
      {/* Connection Wires */}
      <svg className="absolute inset-0 h-full w-full text-brand/60" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        {/* Top Left (Aadhaar) */}
        <path d="M 50 50 C 50 20, 37 20, 24 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        {/* Top Right (PAN) */}
        <path d="M 50 50 C 50 20, 63 20, 76 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        {/* Bottom Left (Driving) */}
        <path d="M 50 50 C 50 80, 37 80, 24 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        {/* Bottom Right (RC) */}
        <path d="M 50 50 C 50 80, 63 80, 76 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Central DigiLocker Node */}
      <div className="absolute left-[50%] top-[50%] z-20 flex w-36 sm:w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[2rem] border border-border bg-background p-5 sm:p-6 shadow-dashboard backdrop-blur-xl">
        <div className="mb-2 grid h-10 w-28 sm:h-12 sm:w-32 place-items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/DigiLocker.svg" alt="DigiLocker" className="h-full w-full object-contain" />
        </div>
        <div className="absolute -bottom-3 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 shadow-sm">
          <div className="size-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Connected</span>
        </div>
      </div>

      {/* Aadhaar Card (TL) */}
      <div className="absolute left-[24%] top-[20%] z-10 flex w-36 sm:w-44 -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:gap-3 rounded-2xl border border-border/80 bg-background/80 p-2 sm:p-3 shadow-glass backdrop-blur-md">
        <div className="grid size-8 sm:size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1 sm:p-1.5 shadow-sm">
          <img src="https://upload.wikimedia.org/wikipedia/en/c/cf/Aadhaar_Logo.svg" alt="Aadhaar" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] sm:text-xs font-black text-foreground">Aadhaar Card</p>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase text-blue-500">Verified</p>
        </div>
      </div>

      {/* PAN Card (TR) */}
      <div className="absolute left-[76%] top-[20%] z-10 flex w-36 sm:w-40 -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:gap-3 rounded-2xl border border-border/80 bg-background/80 p-2 sm:p-3 shadow-glass backdrop-blur-md">
        <div className="grid size-8 sm:size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1 sm:p-1.5 shadow-sm">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Logo_of_Income_Tax_Department_India.png" alt="Income Tax" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] sm:text-xs font-black text-foreground">PAN Card</p>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase text-orange-500">Verified</p>
        </div>
      </div>

      {/* Driving License (BL) */}
      <div className="absolute left-[24%] top-[80%] z-10 flex w-40 sm:w-48 -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:gap-3 rounded-2xl border border-border/80 bg-background/80 p-2 sm:p-3 shadow-glass backdrop-blur-md">
        <div className="grid size-8 sm:size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1 sm:p-1.5 shadow-sm">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Government of India" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] sm:text-xs font-black text-foreground">Driving License</p>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase text-green-500">Verified</p>
        </div>
      </div>

      {/* Vehicle RC (BR) */}
      <div className="absolute left-[76%] top-[80%] z-10 flex w-36 sm:w-44 -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:gap-3 rounded-2xl border border-border/80 bg-background/80 p-2 sm:p-3 shadow-glass backdrop-blur-md">
        <div className="grid size-8 sm:size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1 sm:p-1.5 shadow-sm">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Government of India" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] sm:text-xs font-black text-foreground">Vehicle RC</p>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase text-purple-500">Verified</p>
        </div>
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
      <div className="absolute inset-0 rounded-full bg-brand/10 blur-3xl" />
      <div className="lock-shackle absolute top-6 h-36 w-44 rounded-t-full border-[14px] border-b-0 border-zinc-800 bg-gradient-to-b from-transparent to-zinc-950/50 shadow-2xl sm:h-44 sm:w-56" />
      <div className="relative mt-20 grid h-40 w-56 place-items-center rounded-[2.5rem] border border-white/10 bg-zinc-900/60 shadow-[0_0_50px_-12px_rgba(0,0,0,1)] backdrop-blur-xl sm:h-48 sm:w-64">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative grid size-20 place-items-center rounded-full border border-white/10 bg-zinc-950 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
          <Fingerprint className="relative z-10 size-10 text-brand" aria-hidden="true" />
          <div className="absolute inset-0 rounded-full bg-brand/20 blur-xl" />
        </div>
        <div className="absolute bottom-6 flex gap-2">
          <span className="h-1.5 w-10 rounded-full bg-zinc-700" />
          <span className="h-1.5 w-6 rounded-full bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen overflow-hidden bg-background font-sans text-foreground">
      <section className="relative min-h-screen overflow-hidden border-b border-border bg-grid-fade px-4 pb-20 pt-5 sm:px-6 lg:px-8 sm:pb-32">
        <div className="pointer-events-none absolute inset-6 rounded-[2rem] border border-border/70" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

        <nav className="fixed left-4 right-4 top-4 z-50 mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-full border border-border/80 bg-background/75 px-3 py-3 shadow-glass backdrop-blur-xl sm:left-6 sm:right-6 sm:top-6 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-4">
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
            <Button asChild className="h-10 rounded-full px-5 text-sm font-extrabold shadow-brand cursor-pointer">
              <Link to="/dashboard">Sign In</Link>
            </Button>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex flex-col items-center pt-24 sm:pt-32">
          <ContainerScroll
            titleComponent={
              <div className="mx-auto max-w-4xl text-center mb-8">
                <SectionLabel>Secure family vault</SectionLabel>
                <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                  Your family's life. Organized.
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">
                  Insurance, warranties, medical reports, and vehicle papers in one secure vault.
                </p>
                <div className="mt-8 flex justify-center">
                  <Button asChild className="h-12 rounded-full px-5 text-sm font-black shadow-brand sm:px-7 cursor-pointer">
                    <Link to="/dashboard">
                      <GoogleMark />
                      Sign In with Google
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            }
          >
            <DashboardMockup />
          </ContainerScroll>
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
          <div className="relative grid gap-4 sm:grid-cols-2 lg:gap-10">
            <div className="relative z-10">
              <PolicyPaper />
            </div>
            <div className="relative z-10">
              <ExtractedCard />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8 border-y border-border/50">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          {/* Visual Side (Left) */}
          <div className="order-2 lg:order-1">
            <DigiLockerVisual />
          </div>
          
          {/* Text Side (Right) */}
          <div className="order-1 max-w-xl lg:order-2">
            <SectionLabel>Government Integrations</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight text-foreground sm:text-5xl">Sync with DigiLocker.</h2>
            <p className="mt-4 text-base font-medium leading-7 text-muted-foreground sm:text-lg">
              Automatically pull your Aadhaar, PAN, Driving License, and vehicle registrations directly from the government vault. Always verified, always up to date.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-24 sm:px-6 lg:px-8">
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

      <section id="security" className="relative overflow-hidden bg-black px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="max-w-xl">
            <SectionLabel dark>Privacy & Security</SectionLabel>
            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">Private by design.</h2>
            <p className="mt-5 text-base font-medium leading-7 text-zinc-400 sm:text-lg">
              Sensitive identifiers are instantly locked and masked. Your family's data never leaves your control.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/60">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-white/5 bg-zinc-950 shadow-inner">
                    <Tag className="size-5 text-brand" aria-hidden="true" />
                  </div>
                  <p className="text-lg font-bold text-white">Masked IDs</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">Aadhaar, VIN, and policy numbers stay hidden behind military-grade encryption.</p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/60">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-white/5 bg-zinc-950 shadow-inner">
                    <Mail className="size-5 text-brand" aria-hidden="true" />
                  </div>
                  <p className="text-lg font-bold text-white">Private alerts</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-400">Only the right household members are notified. Data never leaves your control.</p>
                </div>
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
            <Button asChild className="h-12 rounded-full px-5 text-sm font-black shadow-brand sm:px-7 cursor-pointer">
              <Link to="/dashboard">
                <GoogleMark />
                Sign In with Google
              </Link>
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
