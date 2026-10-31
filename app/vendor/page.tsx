"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  RefreshCw,
  Send,
  Sparkles,
  UploadCloud,
  Wrench,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatUSDApprox, formatDate } from "@/lib/utils";
import type { Milestone, Project, User } from "@/lib/store";

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<User | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // Proof submission state per milestone
  const [proofInputs, setProofInputs] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [previousBalance, setPreviousBalance] = useState<number | null>(null);
  const [balanceHighlight, setBalanceHighlight] = useState(false);

  const fetchState = async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        const v = data.users.find((u: User) => u.role === "VENDOR");
        if (v) {
          // Detect balance increment for animation pulse
          if (previousBalance !== null && v.walletBalance > previousBalance) {
            setBalanceHighlight(true);
            setTimeout(() => setBalanceHighlight(false), 3000);
          }
          setPreviousBalance(v.walletBalance);
          setVendor(v);
        }
        setProject(data.project);
        setMilestones(data.milestones);
      }
    } catch (err) {
      console.error("Error fetching vendor state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    // Fast polling every 2.5 seconds to instantly reflect admin escrow releases!
    const interval = setInterval(fetchState, 2500);
    return () => clearInterval(interval);
  }, [previousBalance]);

  const handleProofInputChange = (milestoneId: string, value: string) => {
    setProofInputs((prev) => ({ ...prev, [milestoneId]: value }));
  };

  const handleQuickFill = (milestoneId: string, sampleUrl: string) => {
    setProofInputs((prev) => ({ ...prev, [milestoneId]: sampleUrl }));
  };

  const handleSubmitProof = async (milestoneId: string) => {
    const proofString = proofInputs[milestoneId];
    if (!proofString || proofString.trim() === "") {
      setNotification({
        type: "error",
        message: "Please provide a proof URL or audit reference before submitting.",
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    try {
      setSubmittingId(milestoneId);
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId,
          proofString: proofString.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setNotification({
          type: "error",
          message: result.error || "Failed to submit milestone proof.",
        });
      } else {
        setNotification({
          type: "success",
          message: "Proof submitted! Milestone is now AWAITING APPROVAL in the Oracle verification queue.",
        });
        // Refresh local state
        await fetchState();
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Network error occurred while uploading proof.",
      });
    } finally {
      setSubmittingId(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Vendor Operations Portal
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Field delivery submission, hardware verification evidence, and instant Anchor BaaS local settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchState}
            className="text-xs h-9 border-slate-800 hover:border-slate-700 text-slate-300"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>

          <div className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Local Contractor</div>
            <div className="text-xs font-semibold text-slate-200 truncate max-w-[220px]">
              {vendor?.name || "Kano Solar Dynamics Ltd"}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`rounded-xl border p-4 flex items-center justify-between transition-all ${
            notification.type === "success"
              ? "border-teal-500/40 bg-teal-950/40 text-teal-200"
              : "border-rose-500/40 bg-rose-950/40 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 uppercase font-mono ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* KPI Card 1: Wallet Balance (NGN) - Must instantly update on disbursement */}
        <Card
          className={`border-slate-800 bg-slate-900/60 shadow-lg relative overflow-hidden transition-all duration-500 ${
            balanceHighlight
              ? "ring-2 ring-teal-400 bg-teal-950/30 financial-pulse"
              : ""
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal-400" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-slate-300">
                Wallet Balance (NGN)
              </CardTitle>
              <span className="text-[11px] text-teal-400/90 font-mono">Live BaaS Disbursed Liquidity</span>
            </div>
            <div className="rounded-md bg-teal-500/10 p-2 text-teal-400 border border-teal-500/20">
              <Banknote className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
              <span className="text-teal-400">
                {formatCurrency(vendor?.walletBalance ?? 0, project?.currency ?? "NGN")}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Settled via Anchor BaaS
              </span>
              <span className="font-mono text-slate-400">
                ~ {formatUSDApprox(vendor?.walletBalance ?? 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI Card 2: Assigned Project */}
        <Card className="border-slate-800 bg-slate-900/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-slate-300">
                Contracted Deployment
              </CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">Active EPC Agreement</span>
            </div>
            <div className="rounded-md bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <Wrench className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white tracking-tight truncate">
              {project?.title || "Kano Solar Microgrid"}
            </div>
            <div className="mt-2 text-xs text-slate-400 space-y-1">
              <div>Capacity: <span className="text-slate-200">{project?.capacity}</span></div>
              <div className="truncate">Location: <span className="text-slate-300">{project?.location}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Card 3: Milestone Pipeline */}
        <Card className="border-slate-800 bg-slate-900/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-slate-300">
                Escrow Milestones
              </CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">Tranche Status Breakdown</span>
            </div>
            <div className="rounded-md bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex-1 rounded-lg bg-teal-500/10 border border-teal-500/20 p-2 text-center">
                <div className="font-bold text-teal-400 text-base">
                  {milestones.filter((m) => m.status === "DISBURSED").length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Disbursed</div>
              </div>

              <div className="flex-1 rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-center">
                <div className="font-bold text-amber-300 text-base">
                  {milestones.filter((m) => m.status === "AWAITING_APPROVAL").length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">In Review</div>
              </div>

              <div className="flex-1 rounded-lg bg-slate-800/60 border border-slate-700/60 p-2 text-center">
                <div className="font-bold text-slate-300 text-base">
                  {milestones.filter((m) => m.status === "PENDING").length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Component: Assigned Milestones List */}
      <Card className="border-slate-800 bg-slate-900/50">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                Assigned Execution Milestones
              </CardTitle>
              <CardDescription>
                Upload verified proof documents or IoT telemetry links to promote milestones for Oracle escrow release.
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit text-xs font-mono">
              Contract Currency: {project?.currency || "NGN"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {milestones.map((ms, index) => {
              const isPending = ms.status === "PENDING";
              const isAwaiting = ms.status === "AWAITING_APPROVAL";
              const isDisbursed = ms.status === "DISBURSED";
              const inputValue = proofInputs[ms.id] || "";
              const isSubmittingThis = submittingId === ms.id;

              return (
                <div
                  key={ms.id}
                  className={`rounded-xl border p-5 transition-all ${
                    isDisbursed
                      ? "border-teal-500/30 bg-teal-950/10"
                      : isAwaiting
                      ? "border-amber-500/30 bg-amber-950/10"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Milestone Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800 font-mono text-xs font-bold text-slate-300">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-white text-base">
                          {ms.title}
                        </h3>
                        <Badge status={ms.status} />
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {ms.description || "Operational hardware and telemetry milestone verification."}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                        <span className="font-mono text-teal-400 font-bold text-sm">
                          {formatCurrency(ms.payoutAmount, project?.currency || "NGN")}
                        </span>
                        <span className="text-slate-500">
                          (Approx. {formatUSDApprox(ms.payoutAmount)})
                        </span>
                        {ms.submittedAt && (
                          <span className="text-slate-400 font-mono text-[11px]">
                            Proof Submitted: {formatDate(ms.submittedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Pill for Right Side */}
                    <div className="shrink-0 text-right">
                      {isDisbursed && (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/20 border border-teal-500/40 px-3 py-1 text-xs font-semibold text-teal-300">
                            <CheckCircle2 className="h-4 w-4 text-teal-400" />
                            <span>Paid to Wallet</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            Tx: {ms.anchorTxId || "BaaS-Settled"}
                          </div>
                        </div>
                      )}

                      {isAwaiting && (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-semibold text-amber-300">
                          <Clock className="h-4 w-4 text-amber-400 animate-spin" />
                          <span>Under Oracle Review</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission form for PENDING milestones */}
                  {isPending && (
                    <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                          <UploadCloud className="h-4 w-4 text-teal-400" />
                          <span>Submit Operational Delivery Proof or Telemetry URL</span>
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Quick Presets:
                        </span>
                      </div>

                      {/* Quick presets buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickFill(
                              ms.id,
                              "https://telemetry.pulseclime.io/kano-grid/smart-meter-30day-kwh-stream.json"
                            )
                          }
                          className="text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-teal-300 px-2 py-1 border border-slate-700 transition-colors"
                        >
                          + 30-Day IoT Telemetry Stream
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickFill(
                              ms.id,
                              "https://storage.pulseclime.io/kano-grid/gps-inverter-commissioning-cert.pdf"
                            )
                          }
                          className="text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-amber-300 px-2 py-1 border border-slate-700 transition-colors"
                        >
                          + GPS Inverter Commissioning PDF
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickFill(
                              ms.id,
                              "https://storage.pulseclime.io/kano-grid/customs-invoicing-waybill.jpg"
                            )
                          }
                          className="text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 border border-slate-700 transition-colors"
                        >
                          + Equipment Waybill Photo
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <Input
                          placeholder="e.g. https://storage.pulseclime.io/kano/field-audit-gps-rev2.jpg"
                          value={inputValue}
                          onChange={(e) => handleProofInputChange(ms.id, e.target.value)}
                          className="text-xs font-mono"
                        />
                        <Button
                          onClick={() => handleSubmitProof(ms.id)}
                          loading={isSubmittingThis}
                          disabled={isSubmittingThis || !inputValue.trim()}
                          className="shrink-0 text-xs gap-1.5 h-10 px-5"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Proof</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Evidence Display for AWAITING_APPROVAL and DISBURSED */}
                  {(isAwaiting || isDisbursed) && ms.submittedProofUrl && (
                    <div className="mt-4 rounded-lg border border-slate-800/80 bg-slate-950/60 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs truncate">
                        <FileCheck2 className="h-4 w-4 text-teal-400 shrink-0" />
                        <span className="text-slate-400">Attached Proof:</span>
                        <a
                          href={ms.submittedProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-teal-400 hover:text-teal-300 truncate underline underline-offset-2 flex items-center gap-1"
                        >
                          <span>{ms.submittedProofUrl}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                      <Badge
                        variant={isDisbursed ? "disbursed" : "awaiting"}
                        className="text-[10px] w-fit shrink-0 py-0.5"
                      >
                        {isDisbursed ? "Audit Approved & Settled" : "Awaiting Oracle Authorization"}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
