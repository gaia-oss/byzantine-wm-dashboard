// Client/Customer types
export type ClientStatus = 'invited' | 'kyc_pending' | 'kyc_approved' | 'first_deposit' | 'active' | 'cancelled';

export interface Client {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'business';
  status: ClientStatus;
  aum: number;
  currency: 'EUR' | 'USD';
  joinDate: string;
  kycCompletedDate?: string;
  firstDepositDate?: string;
  lastActivity: string;
  commissionTier: number; // year 1, 2, or 3
  monthsSinceSignup: number;
  totalDeposits: number;
  totalWithdrawals: number;
  currentApy: number;
  managementFee: number; // bps set by wealth manager
}

export interface ClientDetail extends Client {
  transactions: Transaction[];
  aumHistory: AumDataPoint[];
  commissionHistory: QuarterlyPayout[];
}

export interface ClientFunnelData {
  total: number;
  invited: number;
  kycPending: number;
  kycApproved: number;
  firstDeposit: number;
  active: number;
  cancelled: number;
}

// Commission types
export interface CommissionTier {
  minAum: number;
  maxAum: number | null;
  year1Bps: number;
  year2Bps: number;
  year3Bps: number;
  label: string;
}

export interface QuarterlyPayout {
  quarter: string;
  year: number;
  amount: number;
  averageAum: number;
  clientCount: number;
  status: 'paid' | 'pending' | 'processing';
  paidDate?: string;
}

export interface CommissionBreakdown {
  clientId: string;
  clientName: string;
  averageAum: number;
  tier: string;
  bps: number;
  quarterlyEarning: number;
  annualizedEarning: number;
}

// Transaction types
export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: 'EUR' | 'USD';
  date: string;
  product: string;
  status: 'completed' | 'pending' | 'processing';
}

// Dashboard KPI types
export interface ManagementFeeConfig {
  clientId: string;
  fee: number; // bps
  appliedDate: string;
}

export interface DashboardKPIs {
  totalAum: number;
  totalAumChange: number; // percentage
  totalClients: number;
  activeClients: number;
  totalDepositsThisMonth: number;
  totalWithdrawalsThisMonth: number;
  estimatedQuarterlyCommission: number;
  currentQuarterAverageAum: number;
  weightedAvgApy: number;
  lifetimeEarnings: number;
  yearToDateEarnings: number;
  projectedNextQuarter: number;
}

// AUM history for charts
export interface AumDataPoint {
  date: string;
  aum: number;
  clients: number;
}

// Invite types
export interface Invitation {
  id: string;
  email: string;
  name: string;
  sentDate: string;
  status: 'sent' | 'opened' | 'registered' | 'expired';
  referralCode: string;
}

// Settings types
export interface WealthManagerProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  partnerSince: string;
  payoutMethod: 'bank_transfer' | 'byzantine_prime';
  bankDetails?: {
    iban: string;
    bic: string;
    bankName: string;
  };
  language: 'en' | 'fr';
}

// i18n
export type Locale = 'en' | 'fr';
