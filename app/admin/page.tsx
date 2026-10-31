"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  Layers,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatUSDApprox, formatDate } from "@/lib/utils";
import type { Milestone, Project, User } from "@/lib/store";

interface SettlementReceipt {
  anchor_transaction_id: string;
  status: string;
  disbursed_amount: number;
  currency: string;
  milestoneTitle: string;
  projectId: string;
  vendorName: string;
  timestamp: string;
}

export default function AdminPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Payout action state
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [settlementReceipt, setSettlementReceipt] = useState<SettlementReceipt | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchState = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/state", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setMilestones(data.milestones);
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Error loading admin state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    // Poll every 3 seconds to catch any newly submitted proofs from the vendor
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, []);

  const awaitingMilestones = milestones.filter((m) => m.status === "AWAITING_APPROVAL");
  const disbursedMilestones = milestones.filter((m) => m.status === "DISBURSED");
  const vendor = users.find((u) => u.role === "VENDOR");

  const handleVerifyAndRelease = async (milestone: Milestone) => {
    if (!project || !vendor) return;

    try {
      setErrorMessage(null);
      setProcessingId(milestone.id);

      const res = await fetch("/api/escrow/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          milestoneId: milestone.id,
          vendorId: vendor.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to release escrow funds.");
      } else {
        // High visibility success receipt
        setSettlementReceipt({
          anchor_transaction_id: data.anchor_transaction_id,
          status: data.status,
          disbursed_amount: data.disbursed_amount,
          currency: data.currency,
          milestoneTitle: milestone.title,
          projectId: project.id,
          vendorName: vendor.name,
          timestamp: new Date().toISOString(),
        });

        // Refresh global state
        await fetchState();
      }
    } catch (error) {
      setErrorMessage("Network error occurred during BaaS escrow release.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-500/20 text-teal-400 border border-teal-500/40">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Escrow Oracle Verification
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Audit submitted delivery proofs, verify smart meter telemetry, and execute automated Anchor BaaS fiat payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchState}
            className="text-xs h-9 border-slate-800 hover:border-slate-700 text-slate-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-teal-400" : ""}`} />
            Refresh Queue
          </Button>

          <div className="rounded-lg bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-teal-400 font-semibold">
              Oracle Engine
            </div>
            <div className="text-xs font-mono text-slate-200">
              Anchor BaaS v2.4 (Mock Active)
            </div>
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 flex items-center justify-between text-rose-200 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs uppercase font-mono underline hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Modal / Toast Banner for Settled Transaction */}
      {settlementReceipt && (
        <div className="rounded-2xl border-2 border-teal-400 bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-900 p-6 shadow-2xl shadow-teal-500/20 animate-in fade-in-50 duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-teal-500/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/30">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
                    Anchor BaaS Webhook Disbursed
                  </span>
                  <Badge variant="disbursed" className="py-0.5 text-xs font-mono">
                    STATUS: {settlementReceipt.status}
                  </Badge>
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  Automated Escrow Payout Executed
                </h3>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettlementReceipt(null)}
              className="text-xs border-teal-500/40 text-teal-300 hover:bg-teal-500/20"
            >
              Close Receipt
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="rounded-lg bg-slate-950/80 p-3 border border-slate-800">
              <div className="text-slate-500 uppercase font-mono text-[10px]">Anchor Transaction ID</div>
              <div className="font-mono text-teal-300 font-bold text-sm mt-0.5 select-all">
                {settlementReceipt.anchor_transaction_id}
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/80 p-3 border border-slate-800">
              <div className="text-slate-500 uppercase font-mono text-[10px]">Disbursed Amount</div>
              <div className="font-mono text-white font-bold text-sm mt-0.5">
                {formatCurrency(settlementReceipt.disbursed_amount, settlementReceipt.currency)}
              </div>
              <div className="text-[10px] text-slate-400">
                {formatUSDApprox(settlementReceipt.disbursed_amount)}
              </div>
            </div>

            <div className="rounded-lg bg-slate-950/80 p-3 border border-slate-800">
              <div className="text-slate-500 uppercase font-mono text-[10px]">Recipient (Vendor)</div>
              <div className="font-semibold text-slate-200 truncate mt-0.5">
                {settlementReceipt.vendorName}
              </div>
              <div className="text-[10px] text-teal-400 font-mono">NIP Bank Settlement</div>
            </div>

            <div className="rounded-lg bg-slate-950/80 p-3 border border-slate-800">
              <div className="text-slate-500 uppercase font-mono text-[10px]">Settled Timestamp</div>
              <div className="font-mono text-slate-300 mt-0.5">
                {formatDate(settlementReceipt.timestamp)}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 bg-teal-950/20 rounded-lg p-2.5 border border-teal-500/20">
            <span>
              Milestone: <strong className="text-white">{settlementReceipt.milestoneTitle}</strong>
            </span>
            <span className="text-teal-400 font-mono text-[11px]">
              &bull; Financial Ledger Updated: Locked Funds Deducted &bull; Vendor Wallet Credited
            </span>
          </div>
        </div>
      )}

      {/* Oracle Queue Metric Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Pending Verification Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-2">
              <span>{awaitingMilestones.length}</span>
              <span className="text-xs font-normal text-slate-400">Tranches Awaiting Approval</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Capital in Approval Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(
                awaitingMilestones.reduce((acc, m) => acc + m.payoutAmount, 0),
                project?.currency || "NGN"
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Total Disbursed to Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-400">
              {formatCurrency(project?.disbursedFunds ?? 0, project?.currency ?? "NGN")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Component: Verification Queue */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                Escrow Verification Queue (AWAITING_APPROVAL)
              </CardTitle>
              <CardDescription>
                Milestones that have submitted operational proof and require Oracle verification before releasing funds.
              </CardDescription>
            </div>
            <Badge variant="awaiting" className="w-fit text-xs font-mono">
              {awaitingMilestones.length} Items Pending Action
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {awaitingMilestones.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                <CheckCircle2 className="h-6 w-6 text-teal-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">
                  Verification Queue is Currently Empty
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All submitted delivery proofs have been verified and disbursed, or are still pending installer proof submission.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/vendor">
                  <Button variant="outline" size="sm" className="gap-2 text-xs border-amber-500/40 text-amber-300">
                    Switch to Vendor Portal to Submit Phase 3 Proof
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {awaitingMilestones.map((ms) => {
                const isProcessingThis = processingId === ms.id;

                return (
                  <div
                    key={ms.id}
                    className="rounded-xl border-2 border-amber-500/40 bg-amber-950/10 p-6 shadow-lg shadow-amber-500/5 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* Left: Milestone & Project info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Badge variant="awaiting" className="text-xs font-mono">
                            AWAITING APPROVAL
                          </Badge>
                          <span className="text-xs font-mono text-slate-400">
                            Project: {project?.title} ({project?.id})
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white">
                          {ms.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                          {ms.description || "Operational hardware and telemetry milestone verification."}
                        </p>

                        {/* Audit Proof Link Box */}
                        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                              <FileCheck2 className="h-4 w-4 text-teal-400" />
                              <span>Submitted Proof Evidence:</span>
                            </span>
                            {ms.submittedAt && (
                              <span className="text-slate-400 font-mono text-[11px]">
                                Submitted: {formatDate(ms.submittedAt)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <a
                              href={ms.submittedProofUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2 truncate flex items-center gap-1.5"
                            >
                              <span>{ms.submittedProofUrl}</span>
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                              Verified Signatures
                            </span>
                          </div>
                        </div>

                        {/* Vendor recipient detail */}
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <div>
                            Contractor: <strong className="text-slate-200">{vendor?.name}</strong>
                          </div>
                          <div>&bull;</div>
                          <div>
                            Current Wallet:{" "}
                            <strong className="text-teal-400 font-mono">
                              {formatCurrency(vendor?.walletBalance ?? 0, project?.currency || "NGN")}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Right: High Visibility Action Button & Payout Amount */}
                      <div className="flex flex-col items-start lg:items-end justify-between gap-4 lg:min-w-[280px] border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                        <div className="text-left lg:text-right">
                          <div className="text-xs text-slate-400">Tranche Payout Amount</div>
                          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-teal-400">
                            {formatCurrency(ms.payoutAmount, project?.currency || "NGN")}
                          </div>
                          <div className="text-xs text-slate-500">
                            ~ {formatUSDApprox(ms.payoutAmount)}
                          </div>
                        </div>

                        {/* HIGH-VISIBILITY VERIFY & TRIGGER PAYOUT BUTTON */}
                        <div className="w-full space-y-2">
                          <Button
                            size="lg"
                            onClick={() => handleVerifyAndRelease(ms)}
                            loading={isProcessingThis}
                            disabled={isProcessingThis}
                            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/25 h-12 text-sm uppercase tracking-wide gap-2 transition-all hover:scale-[1.01]"
                          >
                            <Zap className="h-4 w-4 fill-slate-950" />
                            <span>Verify & Trigger Payout</span>
                          </Button>

                          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1 font-mono">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>1.5s simulated BaaS network latency</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disbursed History */}
      {disbursedMilestones.length > 0 && (
        <Card className="border-slate-800 bg-slate-900/40">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <span>Settled Escrow Tranches History</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {disbursedMilestones.map((ms) => (
              <div
                key={ms.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {ms.title}
                    <Badge variant="disbursed" className="text-[10px] py-0">
                      DISBURSED
                    </Badge>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                    Anchor Tx ID: <span className="text-teal-400">{ms.anchorTxId || "anch_tx_987654321"}</span> &bull;
                    Disbursed: {formatDate(ms.disbursedAt)}
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-slate-200">
                  {formatCurrency(ms.payoutAmount, project?.currency || "NGN")}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
