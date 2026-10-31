import * as React from "react";
import { cn } from "@/lib/utils";
import { MilestoneStatus } from "@/lib/store";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "pending" | "awaiting" | "disbursed";
  status?: MilestoneStatus | string;
}

export function Badge({ className, variant = "default", status, children, ...props }: BadgeProps) {
  // If status is passed directly, prioritize the specific required milestone styling
  let resolvedVariant = variant;
  if (status) {
    if (status === "PENDING") resolvedVariant = "pending";
    else if (status === "AWAITING_APPROVAL") resolvedVariant = "awaiting";
    else if (status === "DISBURSED") resolvedVariant = "disbursed";
  }

  const variantStyles = {
    // Exact requirement: Gray outline for PENDING
    pending:
      "border border-slate-600 text-slate-300 bg-slate-900/60 hover:bg-slate-900",
    // Exact requirement: Amber/Yellow background for AWAITING_APPROVAL
    awaiting:
      "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25",
    // Exact requirement: Electric Teal/Green background for DISBURSED
    disbursed:
      "bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/25",
    default:
      "bg-teal-500/10 text-teal-400 border border-teal-500/20",
    secondary:
      "bg-slate-800 text-slate-200 border border-slate-700",
    outline:
      "border border-slate-700 text-slate-300 bg-transparent",
  };

  const displayText = children ?? (status ? formatStatus(status) : null);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variantStyles[resolvedVariant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {resolvedVariant === "pending" && <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse" />}
      {resolvedVariant === "awaiting" && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />}
      {resolvedVariant === "disbursed" && <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />}
      {displayText}
    </div>
  );
}

function formatStatus(status: string): string {
  switch (status) {
    case "PENDING":
      return "PENDING";
    case "AWAITING_APPROVAL":
      return "AWAITING APPROVAL";
    case "DISBURSED":
      return "DISBURSED";
    case "ACTIVE":
      return "ACTIVE";
    case "COMPLETED":
      return "COMPLETED";
    default:
      return status.replace(/_/g, " ");
  }
}
