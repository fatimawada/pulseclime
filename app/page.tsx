import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Landmark,
  ShieldCheck,
  Wrench,
  Zap,
  Globe2,
  Layers,
  Banknote,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/10 blur-[130px] rounded-full" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300">
            <Activity className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
            <span>Next-Gen Climate Fintech & Deployment Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Bridging the Emerging Market{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
              Climate Capital Gap
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            In the Global South, the cost of capital can be 2–3× higher due to counterparty friction and lack of
            operational transparency. <strong className="text-white">Pulseclime</strong> provides automated,
            milestone-based escrow rails that securely route global institutional transition finance directly into
            decentralized African clean energy projects.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/funder">
              <Button size="lg" className="gap-2">
                Launch Interactive Prototype
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="#personas"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 px-6 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Select Persona Role
            </a>
          </div>
        </div>

        {/* Key Metrics / Value Prop Pill Bar */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-slate-800/80 py-6">
          <div className="flex items-start gap-3 p-3">
            <div className="rounded-lg bg-teal-500/10 p-2.5 text-teal-400 border border-teal-500/20">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">2–3× Cost of Capital Spread</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Mitigates perceived risk by replacing upfront speculative disbursements with verifiable milestones.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Automated Milestone Escrow</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Capital is locked programmatically. Tranches unlock only upon hardware delivery and telemetry proofs.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Anchor BaaS Local Rails</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Simulated 1.5s Banking-as-a-Service settlement directly to local contractor accounts in Nigerian Naira (NGN).
              </div>
            </div>
          </div>
        </div>

        {/* Role Selector Cards */}
        <div id="personas" className="mt-16 scroll-mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Select Your Role in the Escrow Loop
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl mx-auto">
              Follow a single tranche through the entire lifecycle: from proof submission by the local installer,
              to oracle verification, to real-time BaaS settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* View A: Funder Dashboard */}
            <Card className="relative flex flex-col justify-between border-slate-800 bg-slate-900/50 hover:border-teal-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-105 transition-transform">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-teal-300 border-teal-500/30">
                    Role: Funder
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-teal-300 transition-colors">
                  Institutional Portfolio
                </CardTitle>
                <CardDescription>
                  For DFIs, private credit, and blended climate funds allocating capital into emerging market pipelines.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Real-time KPI: Total Locked vs. Disbursed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Interactive project breakdown & "The Pulse" timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Verified delivery telemetry and audit trails</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Link href="/funder" className="w-full">
                  <Button variant="outline" className="w-full group-hover:border-teal-500 group-hover:text-teal-300">
                    Enter Funder Dashboard
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* View B: Vendor Dashboard */}
            <Card className="relative flex flex-col justify-between border-slate-800 bg-slate-900/50 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-amber-300 border-amber-500/30">
                    Role: Vendor / EPC
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-amber-300 transition-colors">
                  Vendor Operations Portal
                </CardTitle>
                <CardDescription>
                  For local solar mini-grid installers, contractors, and hardware equipment suppliers in Nigeria.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Live wallet balance (NGN) with instant disbursement sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Submit operational proof (customs waybill, inverter telemetry)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>State transitions from PENDING to AWAITING APPROVAL</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Link href="/vendor" className="w-full">
                  <Button variant="outline" className="w-full group-hover:border-amber-500 group-hover:text-amber-300">
                    Enter Vendor Portal
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* View C: Admin Controller */}
            <Card className="relative flex flex-col justify-between border-slate-800 bg-slate-900/50 hover:border-teal-500/50 hover:bg-slate-900/80 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-teal-300 border-teal-500/30">
                    Role: Escrow Oracle
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-teal-300 transition-colors">
                  Oracle Admin Controller
                </CardTitle>
                <CardDescription>
                  For the risk officers and automated oracles auditing hardware evidence and firing BaaS payouts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Pending approval queue with full audit evidence links</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Trigger payout button with 1.5s simulated BaaS delay</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>Simulated Anchor BaaS settlement ID (anch_tx_987654321)</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Link href="/admin" className="w-full">
                  <Button variant="outline" className="w-full group-hover:border-teal-500 group-hover:text-teal-300">
                    Enter Oracle Controller
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Interactive Walkthrough Guide */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-bold text-white">How to Test the End-to-End Escrow Lifecycle</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                The prototype maintains shared in-memory ledger state across all views and API route handlers.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs w-fit">
              Current Project: Kano Solar Microgrid (prj_kano_01)
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px]">
                  1
                </span>
                <span>Vendor Submits Proof</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Open the <strong className="text-slate-200">Vendor Portal</strong>. Find Phase 3 (PENDING), paste or select a
                proof URL, and click <strong className="text-slate-200">Submit Proof</strong>. The milestone status moves to{" "}
                <Badge variant="awaiting" className="text-[10px] py-0 px-1.5">AWAITING APPROVAL</Badge>.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/40 text-[11px]">
                  2
                </span>
                <span>Oracle Verifies & Releases</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Open the <strong className="text-slate-200">Oracle Admin Controller</strong>. Review Phase 2 or Phase 3 and click{" "}
                <strong className="text-teal-400">Verify & Trigger Payout</strong>. Watch the 1.5s simulated BaaS network latency
                and receive the settled transaction receipt.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px]">
                  3
                </span>
                <span>Instant Ledger Settlement</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Revisit the <strong className="text-slate-200">Vendor Portal</strong> to see the wallet balance immediately increase by the payout amount, and check the{" "}
                <strong className="text-slate-200">Funder Portfolio</strong> to see the updated capital timeline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
