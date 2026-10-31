# PulseClime System Architecture

## 1. High-Level Architecture Overview

PulseClime is structured into four decoupled, event-driven subsystem layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. CAPITAL & PORTFOLIO LAYER                    │
│   - Institutional Investor Portals (DFIs, Private Credit, Blended)     │
│   - Project Syndication & Tranche Tokenization                         │
│   - Multi-Currency Treasury (USD / EUR / Stablecoin Vaults)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        2. PROGRAMMATIC ESCROW LAYER                    │
│   - Milestone Finite State Machine (FSM)                               │
│   - Multi-Signatory & Automated Release Conditions                     │
│   - Dispute Resolution & Retention Withholding                         │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│       3. DISBURSEMENT RAILS          │  │   4. VERIFICATION ORACLE     │
│ - FX Conversion Engine               │  │ - IoT / Inverter Telemetry   │
│ - African Mobile Money (M-Pesa, MoMo)│  │ - Smart Generation Meters    │
│ - Local Bank Payouts (ACH / NIP)     │  │ - GPS / Timestamped Audits   │
│ - Hardware Supplier Direct Invoicing │  │ - Satellite & Weather Feeds  │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 2. Subsystem Specifications

### Subsystem 1: Capital Inflow & Treasury
- **Inflow Methods:** Bank Wire (SWIFT/SEPA), Corporate Credit Facilities, and Programmatic Stablecoin Escrows (USDC/EURC).
- **Tranche Allocation:** Automatically maps capital commitments to specific project portfolios (e.g., "Kenya Agricultural Cold Storage Pool A", "Nigeria C&I Solar Tranche 3").
- **Currency Hedging / FX Buffer:** Manages FX exposure between international commitment currency and local deployment currencies (KES, NGN, GHS, ZAR).

### Subsystem 2: Milestone Escrow Engine
The Escrow Engine enforces strict, conditional release criteria. Capital is never disbursed upfront without collateral or proof:

```
[DEPOSIT_COMMITTED]
       │
       ▼
   [FUNDED] ──────(Procurement Confirmed)─────► [TRANCHE_1_RELEASED]
       │                                             (30% Equipment Deposit)
       ▼
[INSTALLATION_PENDING]
       │
       ▼
[TELEMETRY_LINKED] ───(Inverter Handshake)────► [TRANCHE_2_RELEASED]
       │                                             (50% Commissioning)
       ▼
[OPERATIONAL_AUDIT] ──(30-Day Sustained kWh)──► [TRANCHE_3_RELEASED]
                                                     (20% Final / Retention)
```

### Subsystem 3: Verification & Telemetry Oracle
- **Supported Hardware Protocols:**
  - Modbus / SunSpec (Standard Solar Inverters: SolarEdge, Huawei, Victron, SMA)
  - Cellular / GSM IoT Gateways (4G/LTE Cat-M1 for remote mini-grids)
  - OpenPAYGO Tokenization & Telemetry (Pay-as-you-go solar systems)
- **Data Attestation:**
  - Device Signatures: Each inverter or meter cryptographically signs hourly generation telemetry packets.
  - Anomaly Detection: Compares generated kWh with expected regional irradiation data to prevent fraudulent meter simulation.

### Subsystem 4: Local Settlement & Disbursement Rails
- **Payment Adapters:**
  - Kenya: M-Pesa B2B / Daraja API, Equity Bank Jenga API.
  - Nigeria: NIP (NIBSS Instant Payment), Paystack, Flutterwave Transfers.
  - Ghana: MTN MoMo, Ghana Interbank Payment and Settlement Systems (GhIPSS).
- **Direct Supplier Settlement:**
  - Where possible, equipment tranches are disbursed directly to Tier-1 certified equipment manufacturers/distributors to eliminate local contractor diversion risk.

---

## 3. Data Model Summary

| Entity | Description | Key Attributes |
| :--- | :--- | :--- |
| `ClimateProject` | Deployment initiative | ID, Name, Category, Location (GeoJSON), Target Capacity (kW/kWh), Target Capital |
| `HardwareAsset` | Physical climate asset | Serial Number, OEM, Model, Mac Address, GPS, Telemetry Protocol, Status |
| `EscrowAccount` | Segregated funding escrow | ProjectID, FunderID, TotalCommitted, LockedBalance, ReleasedBalance, Currency |
| `Milestone` | Verification gateway | Step Number, RequiredEvidence, PayoutPercentage, Status, VerifiedAt |
| `TelemetryRecord`| Real-time hardware ping | AssetID, Timestamp, ActivePower (kW), CumulativeEnergy (kWh), StateOfCharge (%) |
