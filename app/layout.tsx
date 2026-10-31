import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardNav } from "@/components/dashboards/nav";

export const metadata: Metadata = {
  title: "Pulseclime | Climate Fintech Escrow Rails for Emerging Markets",
  description:
    "Securing global transition capital and routing automated milestone-based payouts to local installers in the Global South via Banking-as-a-Service rails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <DashboardNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Pulseclime Climate Escrow Protocol &bull; Prototype Environment &bull; Mock Anchor BaaS Rail
            </div>
            <div className="font-mono text-slate-400">
              Contract Currency: <span className="text-teal-400 font-semibold">NGN (Nigerian Naira)</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
