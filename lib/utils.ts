import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "NGN",
  options?: { compact?: boolean; hideDecimals?: boolean }
): string {
  if (options?.compact && amount >= 1_000_000) {
    return `${currency} ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (options?.compact && amount >= 1_000) {
    return `${currency} ${(amount / 1_000).toFixed(0)}K`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: options?.hideDecimals !== false ? 0 : 2,
  })
    .format(amount)
    .replace("NGN", "₦");
}

export function formatUSDApprox(ngnAmount: number, rate: number = 1550): string {
  const usd = ngnAmount / rate;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
