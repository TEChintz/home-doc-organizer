import React from "react";
import { FileText } from "lucide-react";
import type { VaultDocument } from "./dashboard-types";

export function GeometricDocIcon({
  type,
  color,
  className = "size-5 shrink-0",
}: {
  type?: VaultDocument["iconType"];
  color?: string;
  className?: string;
}) {
  const c = color || "#1956e3"; // Fallback hex matching docket blue
  switch (type) {
    case "stripes":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <line x1="4" y1="20" x2="20" y2="4" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="22" x2="22" y2="10" stroke={c} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "arc":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M4 18a8 8 0 0 1 16 0" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M7 18a5 5 0 0 1 10 0" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "pinwheel":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="9" r="4" fill="#3b82f6" />
          <circle cx="15" cy="9" r="4" fill="#10b981" />
          <circle cx="15" cy="15" r="4" fill="#f59e0b" />
          <circle cx="9" cy="15" r="4" fill="#ef4444" />
        </svg>
      );
    case "crescent":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8A9.04 9.04 0 0 0 12 3z"
            fill={c}
          />
        </svg>
      );
    case "dots":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="8" cy="8" r="3.5" fill={c} />
          <circle cx="16" cy="8" r="3.5" fill={c} />
          <circle cx="12" cy="16" r="3.5" fill={c} />
        </svg>
      );
    default:
      return <FileText className={`${className} text-zinc-500`} />;
  }
}
