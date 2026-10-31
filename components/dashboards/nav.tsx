"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, ShieldCheck, Wrench, Landmark, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DashboardNav() {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleReset = async () => {
    try {
      setResetting(true);
      const res = await fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        setResetMessage("State reset!");
        setTimeout(() => setResetMessage(null), 2500);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const navItems = [
    {
      href: "/funder",
      label: "Funder Portfolio",
      icon: Landmark,
      badge: "Institutional",
    },
    {
      href: "/vendor",
      label: "Vendor Portal",
      icon: Wrench,
      badge: "Local EPC",
    },
    {
      href: "/admin",
      label: "Oracle / Admin",
      icon: ShieldCheck,
      badge: "Escrow BaaS",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 group-hover:border-teal-400 group-hover:bg-teal-500/20 transition-all shadow-[0_0_15px_rgba(20,184,166,0.15)]">
              <Activity className="h-5 w-5 animate-pulse text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  Pulse<span className="text-teal-400">clime</span>
                </span>
                <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-300 border border-teal-500/30">
                  Escrow Rails
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Emerging Market Climate Finance Infrastructure
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-slate-800/80 text-teal-400 shadow-sm border border-slate-700/80"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-teal-400" : "text-slate-400")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-400">Anchor BaaS:</span>
            <span className="text-emerald-400 font-semibold">ONLINE (1.5s simulated lag)</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            loading={resetting}
            title="Reset in-memory mock state to initial seed"
            className="text-xs h-8 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1 text-slate-400" />
            {resetMessage || "Reset State"}
          </Button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 px-2 py-2 bg-slate-950">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md px-3 py-1 text-xs font-medium",
                isActive ? "text-teal-400 bg-slate-900" : "text-slate-400"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
