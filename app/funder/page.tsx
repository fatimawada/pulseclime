"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Lock,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatUSDApprox, formatDate } from "@/lib/utils";
import type { Milestone, Project, User } from "@/lib/store";

export default function FunderDashboardPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [funder, setFunder] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>("prj_kano_01");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/state", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setMilestones(data.milestones);
        const f = data.users.find((u: User) => u.role === "FUNDER");
        if (f) setFunder(f);
      }
    } catch (error) {
      console.error("Failed to load funder portfolio state:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 4 seconds to catch real-time state mutations from vendor or admin actions
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalCommitted = (project?.totalLockedFunds || 0) + (project?.disbursedFunds || 0);
  const percentDisbursed =
    totalCommitted > 0 ? Math.round(((project?.disbursedFunds || 0) / totalCommitted) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Institutional Climate Portfolio
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Real-time capital routing, programmable escrow positions, and verifiable milestone disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="text-xs h-9 border-slate-800 hover:border-slate-700 text-slate-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-teal-400" : ""}`} />
            Sync Ledger
          </Button>

          <div className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Fund Account</div>
            <div className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
              {funder?.name || "Global Climate Catalyst Fund"}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* KPI Card 1: Total Capital Locked in Escrow */}
        <Card className="border-slate-800 bg-slate-900/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/80" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Capital Locked in Escrow
            </CardTitle>
            <div className="rounded-md bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <Lock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(project?.totalLockedFunds ?? 0, project?.currency ?? "NGN")}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Approx. {formatUSDApprox(project?.totalLockedFunds ?? 0)}</span>
              <span className="font-mono text-[11px] text-amber-400/90 font-medium">Secured in Smart Vault</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI Card 2: Capital Disbursed */}
        <Card className="border-slate-800 bg-slate-900/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Capital Disbursed
            </CardTitle>
            <div className="rounded-md bg-teal-500/10 p-2 text-teal-400 border border-teal-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 tracking-tight">
              {formatCurrency(project?.disbursedFunds ?? 0, project?.currency ?? "NGN")}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Approx. {formatUSDApprox(project?.disbursedFunds ?? 0)}</span>
              <span className="font-mono text-[11px] text-teal-400 font-semibold">{percentDisbursed}% of committed</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI Card 3: Active Projects */}
        <Card className="border-slate-800 bg-slate-900/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Active Projects
            </CardTitle>
            <div className="rounded-md bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              1 <span className="text-sm font-normal text-slate-400">Project Active</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{project?.capacity || "750 kWp Solar + BESS"}</span>
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 py-0">
                100% Operational Telemetry
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Component: Data Table of Active Projects */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                Active Climate Deployment Contracts
                <span className="text-xs font-normal text-slate-400">(Click row to inspect milestone pulse)</span>
              </CardTitle>
              <CardDescription>
                Funded decentralized solar and clean infrastructure tranches managed under programmatic escrow.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project & Location</TableHead>
                <TableHead>Local EPC Partner</TableHead>
                <TableHead>Total Committed</TableHead>
                <TableHead>Locked in Escrow</TableHead>
                <TableHead>Disbursed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project && (
                <>
                  <TableRow
                    className="cursor-pointer hover:bg-slate-800/60"
                    onClick={() =>
                      setExpandedProjectId(expandedProjectId === project.id ? null : project.id)
                    }
                  >
                    <TableCell>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {project.title}
                          <span className="text-xs font-mono text-slate-500">{project.id}</span>
                        </div>
                        <div className="text-xs text-slate-400">{project.location}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm text-slate-200">Kano Solar Dynamics Ltd</div>
                      <div className="text-xs text-slate-500">Tier-1 EPC Partner</div>
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-slate-100">
                        {formatCurrency(totalCommitted, project.currency)}
                      </div>
                      <div className="text-[11px] text-slate-500">{formatUSDApprox(totalCommitted)}</div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-1 font-mono text-amber-300 font-medium">
                        <Lock className="h-3 w-3" />
                        {formatCurrency(project.totalLockedFunds, project.currency)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-1 font-mono text-teal-400 font-semibold">
                        <Zap className="h-3 w-3" />
                        {formatCurrency(project.disbursedFunds, project.currency)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge status={project.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 text-xs gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedProjectId(expandedProjectId === project.id ? null : project.id);
                        }}
                      >
                        {expandedProjectId === project.id ? (
                          <>
                            <span>Collapse</span>
                            <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>The Pulse</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Milestone Timeline: The Pulse */}
                  {expandedProjectId === project.id && (
                    <TableRow className="bg-slate-950/70 border-b border-teal-500/20">
                      <TableCell colSpan={7} className="p-6">
                        <div className="space-y-6">
                          {/* Pulse Banner & Overall Progress */}
                          <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40">
                                  <Activity className="h-5 w-5 animate-pulse text-teal-400" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                                    The Pulse: Automated Milestone Escrow Stream
                                  </h4>
                                  <p className="text-xs text-slate-400">
                                    Capital unlocks tranche-by-tranche upon physical hardware delivery, GPS field verification, and IoT inverter telemetry.
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-400">Disbursement Completion</div>
                                <div className="text-lg font-mono font-bold text-teal-400">
                                  {percentDisbursed}% Complete
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                                style={{ width: `${percentDisbursed}%` }}
                              />
                            </div>
                          </div>

                          {/* Timeline Cards */}
                          <div className="space-y-4">
                            <h5 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                              Escrow Verification Tranches & Delivery Gates
                            </h5>

                            <div className="grid grid-cols-1 gap-4">
                              {milestones.map((ms, index) => {
                                const isDisbursed = ms.status === "DISBURSED";
                                const isAwaiting = ms.status === "AWAITING_APPROVAL";
                                const isPending = ms.status === "PENDING";

                                return (
                                  <div
                                    key={ms.id}
                                    className={`relative rounded-xl border p-4 transition-all ${
                                      isDisbursed
                                        ? "border-teal-500/40 bg-teal-950/10"
                                        : isAwaiting
                                        ? "border-amber-500/40 bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                                        : "border-slate-800 bg-slate-900/40"
                                    }`}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                      {/* Left Info */}
                                      <div className="flex items-start gap-3">
                                        <div
                                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${
                                            isDisbursed
                                              ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                                              : isAwaiting
                                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                              : "bg-slate-800 text-slate-400 border-slate-700"
                                          }`}
                                        >
                                          0{index + 1}
                                        </div>

                                        <div className="space-y-1">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold text-white text-sm">
                                              {ms.title}
                                            </span>
                                            <Badge status={ms.status} />
                                          </div>
                                          <p className="text-xs text-slate-400">
                                            {ms.description || "Operational hardware and telemetry milestone verification."}
                                          </p>

                                          {/* Proof / Audit Metadata */}
                                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                                            {ms.submittedProofUrl ? (
                                              <a
                                                href={ms.submittedProofUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 underline underline-offset-2"
                                              >
                                                <ExternalLink className="h-3 w-3" />
                                                <span>Audit Evidence / Telemetry Proof</span>
                                              </a>
                                            ) : (
                                              <span className="text-slate-500 italic">
                                                Proof submission pending installer action
                                              </span>
                                            )}

                                            {ms.submittedAt && (
                                              <span className="text-slate-400 font-mono text-[11px]">
                                                Submitted: {formatDate(ms.submittedAt)}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right Payout Amount & Settlement Info */}
                                      <div className="text-right sm:shrink-0 sm:min-w-[180px]">
                                        <div className="text-sm font-mono font-bold text-white">
                                          {formatCurrency(ms.payoutAmount, project.currency)}
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                          {formatUSDApprox(ms.payoutAmount)}
                                        </div>

                                        {isDisbursed && (
                                          <div className="mt-2 text-right">
                                            <div className="inline-flex items-center gap-1 rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-teal-300 border border-teal-500/30">
                                              <ShieldCheck className="h-3 w-3 text-teal-400" />
                                              <span>{ms.anchorTxId || "BaaS Settled"}</span>
                                            </div>
                                            {ms.disbursedAt && (
                                              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                                Settled {formatDate(ms.disbursedAt)}
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {isAwaiting && (
                                          <div className="mt-2 text-right">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300">
                                              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                                              In Oracle Review Queue
                                            </span>
                                          </div>
                                        )}

                                        {isPending && (
                                          <div className="mt-2 text-right">
                                            <span className="text-[11px] text-slate-500 font-mono">
                                              Escrow Reserved
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
