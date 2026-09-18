import React, { useEffect, useState } from "react";
import { AlertCircle, CalendarClock, Check, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuildPacket, usePacketTemplates } from "@/lib/api/hooks";
import type { ApiPacketResponse } from "@/lib/api/types";
import type { FamilyMember } from "../dashboard-types";

/**
 * Document checklists for a life goal — "a home loan needs Aadhaar, PAN, salary
 * slips, Form 16, ITR, bank statement, property deed". The server decides what is
 * present, missing, expired or contradicted; this just renders the answer.
 */

const TEMPLATE_LABELS: Record<string, string> = {
  home_loan: "Home loan",
  passport: "Passport application",
  insurance_claim: "Insurance claim",
  school_admission: "School admission",
  itr: "Income tax return",
};

interface StatusStyle {
  icon: React.ReactNode;
  className: string;
  label: string;
}

const STATUS_STYLE: Record<string, StatusStyle> = {
  present: {
    icon: <Check className="h-4 w-4" />,
    className: "text-emerald-700 bg-emerald-50 border-emerald-200",
    label: "Ready",
  },
  missing: {
    icon: <X className="h-4 w-4" />,
    className: "text-muted-foreground bg-muted/50 border-border",
    label: "Missing",
  },
  expired: {
    icon: <CalendarClock className="h-4 w-4" />,
    className: "text-red-700 bg-red-50 border-red-200",
    label: "Expired",
  },
  mismatch: {
    icon: <AlertCircle className="h-4 w-4" />,
    className: "text-amber-700 bg-amber-50 border-amber-200",
    label: "Needs checking",
  },
};

const MISSING_STYLE: StatusStyle = {
  icon: <X className="h-4 w-4" />,
  className: "text-muted-foreground bg-muted/50 border-border",
  label: "Missing",
};

export function PacketsView({
  members,
  onUploadFor,
}: {
  members: FamilyMember[];
  onUploadFor?: (memberId: string | null) => void;
}) {
  const { data: templates, isLoading: templatesLoading } = usePacketTemplates();
  const build = useBuildPacket();

  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<ApiPacketResponse | null>(null);
  const [memberIds, setMemberIds] = useState<string[]>([]);

  useEffect(() => {
    const first = templates?.templates?.[0];
    if (!selected && first) setSelected(first.name);
  }, [templates, selected]);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    build
      .mutateAsync({ template: selected, member_ids: memberIds })
      .then((r) => {
        if (!cancelled) setResult(r);
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      });
    return () => {
      cancelled = true;
    };
    // `build` is a stable mutation object; re-running on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, memberIds]);

  const memberName = (id: string | null) =>
    id ? (members.find((m) => m.id === id)?.name ?? "Someone") : "Anyone";

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">Goals</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What you need for a life event, and what you&apos;re missing.
        </p>
      </header>

      {templatesLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {templates?.templates?.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setSelected(t.name)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                selected === t.name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted"
              }`}
            >
              {TEMPLATE_LABELS[t.name] ?? t.name.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      )}

      {members.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">For:</span>
          {members.map((m) => {
            const on = memberIds.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() =>
                  setMemberIds((prev) => (on ? prev.filter((id) => id !== m.id) : [...prev, m.id]))
                }
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  on ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                }`}
              >
                {m.name}
              </button>
            );
          })}
          {memberIds.length === 0 && (
            <span className="text-xs text-muted-foreground">(you, by default)</span>
          )}
        </div>
      )}

      {build.isPending && !result && (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      )}

      {result && (
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-medium">
              {TEMPLATE_LABELS[result.template] ?? result.template.replace(/_/g, " ")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {result.items.length - result.missing_count} ready, {result.missing_count} to go
            </p>
          </div>

          <ul className="mt-4 divide-y divide-border">
            {result.items.map((item, i) => {
              const style: StatusStyle = STATUS_STYLE[item.status] ?? MISSING_STYLE;
              return (
                <li
                  key={`${item.requirement}-${item.member_id}-${i}`}
                  className="flex items-center gap-3 py-3"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${style.className}`}
                  >
                    {style.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.requirement}</p>
                    <p className="text-xs text-muted-foreground">
                      {memberName(item.member_id)} · {style.label}
                    </p>
                  </div>
                  {item.status === "missing" && onUploadFor && (
                    <Button size="sm" variant="ghost" onClick={() => onUploadFor(item.member_id)}>
                      <Upload className="mr-1 h-3.5 w-3.5" />
                      Add
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
