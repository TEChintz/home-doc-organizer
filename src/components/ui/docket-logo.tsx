import React from "react";

export function DocketLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="12" height="12" rx="3" />
      <rect x="9" y="9" width="12" height="12" rx="3" />
    </svg>
  );
}
