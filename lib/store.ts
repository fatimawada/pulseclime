export type UserRole = 'FUNDER' | 'VENDOR' | 'ADMIN';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  walletBalance: number;
}

export type ProjectStatus = 'ACTIVE' | 'COMPLETED';

export interface Project {
  id: string;
  title: string;
  funderId: string;
  vendorId: string;
  totalLockedFunds: number;
  disbursedFunds: number;
  currency: string;
  status: ProjectStatus;
  location?: string;
  capacity?: string;
  description?: string;
}

export type MilestoneStatus = 'PENDING' | 'AWAITING_APPROVAL' | 'DISBURSED';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  payoutAmount: number;
  status: MilestoneStatus;
  submittedProofUrl: string | null;
  submittedAt?: string | null;
  disbursedAt?: string | null;
  anchorTxId?: string | null;
  description?: string;
}

export interface StoreState {
  users: User[];
  project: Project;
  milestones: Milestone[];
}

const createInitialState = (): StoreState => ({
  users: [
    {
      id: 'usr_funder_01',
      role: 'FUNDER',
      name: 'Global Climate Catalyst Fund (London / Zurich)',
      walletBalance: 250000000, // 250M NGN institutional capital pool
    },
    {
      id: 'usr_vendor_01',
      role: 'VENDOR',
      name: 'Kano Solar Dynamics Ltd (Local EPC & Installer)',
      walletBalance: 0, // initialized to 0 for vendor as required
    },
    {
      id: 'usr_admin_01',
      role: 'ADMIN',
      name: 'PulseClime Oracle & Risk Officer',
      walletBalance: 0,
    },
  ],
  project: {
    id: 'prj_kano_01',
    title: 'Kano Solar Microgrid',
    funderId: 'usr_funder_01',
    vendorId: 'usr_vendor_01',
    totalLockedFunds: 30000000, // 30,000,000 NGN remaining locked in escrow
    disbursedFunds: 15000000,   // 15,000,000 NGN already disbursed
    currency: 'NGN',
    status: 'ACTIVE',
    location: 'Kano State, Northern Nigeria',
    capacity: '750 kWp Solar PV + 1.2 MWh BESS',
    description: 'Decentralized commercial & mini-grid cluster powering 1,400 smallholder agro-processing businesses.',
  },
  milestones: [
    {
      id: 'ms_01',
      projectId: 'prj_kano_01',
      title: 'Phase 1: Tier-1 PV Modules & Inverter Customs Clearance',
      payoutAmount: 15000000, // 15,000,000 NGN
      status: 'DISBURSED',
      submittedProofUrl: 'https://storage.pulseclime.io/kano-grid/audit-customs-waybill-certified.pdf',
      submittedAt: '2026-10-15T09:30:00Z',
      disbursedAt: '2026-10-16T14:22:10Z',
      anchorTxId: 'anch_tx_102938475',
      description: 'Port offloading and customs verified shipment of 1,200 Tier-1 monocrystalline panels & inverter enclosures.',
    },
    {
      id: 'ms_02',
      projectId: 'prj_kano_01',
      title: 'Phase 2: On-Site Mounting, Battery Rack & Electrical Balance of System (BOS)',
      payoutAmount: 18000000, // 18,000,000 NGN
      status: 'AWAITING_APPROVAL',
      submittedProofUrl: 'https://storage.pulseclime.io/kano-grid/telemetry-inverter-gps-field-report-rev4.jpg',
      submittedAt: '2026-10-31T18:45:00Z',
      disbursedAt: null,
      anchorTxId: null,
      description: 'Physical racking completed, battery management system connected, and inverter telemetry test ping verified.',
    },
    {
      id: 'ms_03',
      projectId: 'prj_kano_01',
      title: 'Phase 3: Microgrid Handshake, Smart Meter Telemetry & 30-Day Sustained Generation',
      payoutAmount: 12000000, // 12,000,000 NGN
      status: 'PENDING',
      submittedProofUrl: null,
      submittedAt: null,
      disbursedAt: null,
      anchorTxId: null,
      description: 'Distribution line energization, smart prepaid meter integration, and 30 consecutive days of sustained kWh telemetry.',
    },
  ],
});

// Attach in-memory store to globalThis for Next.js App Router hot reloading and route handlers
const globalForStore = globalThis as unknown as {
  __pulseclimeStore?: StoreState;
};

if (!globalForStore.__pulseclimeStore) {
  globalForStore.__pulseclimeStore = createInitialState();
}

export const store = globalForStore.__pulseclimeStore;

export function getStore(): StoreState {
  if (!globalForStore.__pulseclimeStore) {
    globalForStore.__pulseclimeStore = createInitialState();
  }
  return globalForStore.__pulseclimeStore;
}

export function resetStore(): StoreState {
  globalForStore.__pulseclimeStore = createInitialState();
  return globalForStore.__pulseclimeStore;
}

export function getProject(projectId?: string): Project | undefined {
  const current = getStore();
  if (!projectId) return current.project;
  return current.project.id === projectId ? current.project : undefined;
}

export function getUser(userId: string): User | undefined {
  const current = getStore();
  return current.users.find((u) => u.id === userId);
}

export function getMilestones(projectId?: string): Milestone[] {
  const current = getStore();
  if (!projectId) return current.milestones;
  return current.milestones.filter((m) => m.projectId === projectId);
}

export function getMilestone(milestoneId: string): Milestone | undefined {
  const current = getStore();
  return current.milestones.find((m) => m.id === milestoneId);
}

export function updateMilestoneProof(
  milestoneId: string,
  proofUrl: string
): { success: boolean; milestone?: Milestone; error?: string } {
  const current = getStore();
  const milestone = current.milestones.find((m) => m.id === milestoneId);

  if (!milestone) {
    return { success: false, error: `Milestone with ID ${milestoneId} not found` };
  }

  if (milestone.status !== 'PENDING') {
    return {
      success: false,
      error: `Milestone proof can only be uploaded when status is PENDING. Current status: ${milestone.status}`,
    };
  }

  milestone.status = 'AWAITING_APPROVAL';
  milestone.submittedProofUrl = proofUrl;
  milestone.submittedAt = new Date().toISOString();

  return { success: true, milestone };
}

export function releaseMilestoneFunds(
  projectId: string,
  milestoneId: string,
  vendorId: string,
  anchorTxId: string = 'anch_tx_987654321'
): {
  success: boolean;
  anchor_transaction_id?: string;
  status?: string;
  disbursed_amount?: number;
  currency?: string;
  error?: string;
} {
  const current = getStore();

  const project = current.project.id === projectId ? current.project : undefined;
  if (!project) {
    return { success: false, error: `Project ${projectId} not found` };
  }

  const milestone = current.milestones.find((m) => m.id === milestoneId && m.projectId === projectId);
  if (!milestone) {
    return { success: false, error: `Milestone ${milestoneId} not found for project ${projectId}` };
  }

  if (milestone.status !== 'AWAITING_APPROVAL') {
    return {
      success: false,
      error: `Milestone must be exactly AWAITING_APPROVAL to release escrow funds. Current status is ${milestone.status}`,
    };
  }

  const vendor = current.users.find((u) => u.id === vendorId);
  if (!vendor) {
    return { success: false, error: `Vendor user with ID ${vendorId} not found` };
  }

  const amount = milestone.payoutAmount;

  // Financial Transaction Ledger Execution
  // 1. Deduct milestone.payoutAmount from Project.totalLockedFunds
  project.totalLockedFunds = Math.max(0, project.totalLockedFunds - amount);

  // 2. Add milestone.payoutAmount to User.walletBalance (where id === vendorId)
  vendor.walletBalance += amount;

  // 3. Update milestone status to DISBURSED
  milestone.status = 'DISBURSED';
  milestone.disbursedAt = new Date().toISOString();
  milestone.anchorTxId = anchorTxId;

  // 4. Update Project.disbursedFunds
  project.disbursedFunds += amount;

  // Check if all project milestones are disbursed
  const allDisbursed = current.milestones.every((m) => m.status === 'DISBURSED');
  if (allDisbursed) {
    project.status = 'COMPLETED';
  }

  return {
    success: true,
    anchor_transaction_id: anchorTxId,
    status: 'SETTLED',
    disbursed_amount: amount,
    currency: project.currency,
  };
}
