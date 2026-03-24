/**
 * Service layer for Byzantine Wealth Manager Dashboard
 *
 * This module provides a service interface structured for easy API replacement.
 * Each function simulates an async API call with a small delay.
 *
 * In production, replace the mock data returns with actual API calls:
 * - Replace with: fetch(`${API_BASE}/endpoint`)
 * - Parse JSON responses
 * - Handle authentication headers
 * - Implement proper error handling
 */

import {
  mockClients,
  mockFunnelData,
  mockTransactions,
  mockQuarterlyPayouts,
  mockCommissionBreakdown,
  mockAumHistory,
  mockDashboardKPIs,
  mockInvitations,
  mockProfile,
  COMMISSION_TIERS,
} from './mock-data';

import type {
  Client,
  ClientDetail,
  ClientFunnelData,
  Transaction,
  QuarterlyPayout,
  CommissionBreakdown,
  AumDataPoint,
  DashboardKPIs,
  Invitation,
  WealthManagerProfile,
  CommissionTier,
} from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API configuration - set via environment variable
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// ============================================================================
// DASHBOARD & OVERVIEW ENDPOINTS
// ============================================================================

/**
 * Fetch dashboard overview KPIs
 * GET /api/dashboard/overview
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/dashboard/overview`);
 * if (!response.ok) throw new Error('Failed to fetch dashboard KPIs');
 * return response.json();
 */
export async function fetchDashboardKPIs(): Promise<DashboardKPIs> {
  await delay(300);
  return mockDashboardKPIs;
}

// ============================================================================
// CLIENT ENDPOINTS
// ============================================================================

/**
 * Fetch all clients with basic information
 * GET /api/clients
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/clients`);
 * if (!response.ok) throw new Error('Failed to fetch clients');
 * return response.json();
 */
export async function fetchClients(): Promise<Client[]> {
  await delay(400);
  return mockClients;
}

/**
 * Fetch a specific client by ID with detailed information
 * GET /api/clients/:id
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/clients/${clientId}`);
 * if (!response.ok) throw new Error('Client not found');
 * return response.json();
 */
export async function fetchClientById(clientId: string): Promise<ClientDetail> {
  await delay(300);
  const client = mockClients.find(c => c.id === clientId);
  if (!client) throw new Error('Client not found');

  const clientTransactions = mockTransactions.filter(tx => tx.clientId === clientId);
  const clientCommissionHistory = mockQuarterlyPayouts; // In production, filter by client
  const clientAumHistory: AumDataPoint[] = mockAumHistory; // In production, filter by client

  return {
    ...client,
    transactions: clientTransactions,
    aumHistory: clientAumHistory,
    commissionHistory: clientCommissionHistory,
  };
}

/**
 * Fetch client funnel aggregation
 * GET /api/clients/funnel
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/clients/funnel`);
 * if (!response.ok) throw new Error('Failed to fetch funnel data');
 * return response.json();
 */
export async function fetchClientFunnel(): Promise<ClientFunnelData> {
  await delay(200);
  return mockFunnelData;
}

/**
 * Fetch transactions for a specific client
 * GET /api/clients/:id/transactions
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/clients/${clientId}/transactions`);
 * if (!response.ok) throw new Error('Failed to fetch client transactions');
 * return response.json();
 */
export async function fetchClientTransactions(clientId: string): Promise<Transaction[]> {
  await delay(300);
  return mockTransactions.filter(tx => tx.clientId === clientId);
}

// ============================================================================
// TRANSACTION ENDPOINTS
// ============================================================================

/**
 * Fetch recent transactions across all clients
 * GET /api/transactions
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/transactions?limit=${limit}`);
 * if (!response.ok) throw new Error('Failed to fetch transactions');
 * return response.json();
 */
export async function fetchTransactions(limit?: number): Promise<Transaction[]> {
  await delay(300);
  const txs = mockTransactions;
  return limit ? txs.slice(0, limit) : txs;
}

// ============================================================================
// PAYOUT & COMMISSION ENDPOINTS
// ============================================================================

/**
 * Fetch quarterly payout history
 * GET /api/payouts
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/payouts`);
 * if (!response.ok) throw new Error('Failed to fetch payouts');
 * return response.json();
 */
export async function fetchQuarterlyPayouts(): Promise<QuarterlyPayout[]> {
  await delay(300);
  return mockQuarterlyPayouts;
}

/**
 * Fetch per-client commission breakdown
 * GET /api/commissions/breakdown
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/commissions/breakdown`);
 * if (!response.ok) throw new Error('Failed to fetch commission breakdown');
 * return response.json();
 */
export async function fetchCommissionBreakdown(): Promise<CommissionBreakdown[]> {
  await delay(300);
  return mockCommissionBreakdown;
}

/**
 * Get commission tier structure
 * GET /api/commissions/tiers
 *
 * This is typically static reference data that can be cached client-side
 */
export function getCommissionTiers(): CommissionTier[] {
  return COMMISSION_TIERS;
}

// ============================================================================
// AUM & ANALYTICS ENDPOINTS
// ============================================================================

/**
 * Fetch AUM history for charting
 * GET /api/aum/history
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/aum/history`);
 * if (!response.ok) throw new Error('Failed to fetch AUM history');
 * return response.json();
 */
export async function fetchAumHistory(): Promise<AumDataPoint[]> {
  await delay(200);
  return mockAumHistory;
}

// ============================================================================
// INVITATION ENDPOINTS
// ============================================================================

/**
 * Fetch pending invitations
 * GET /api/invitations
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/invitations`);
 * if (!response.ok) throw new Error('Failed to fetch invitations');
 * return response.json();
 */
export async function fetchInvitations(): Promise<Invitation[]> {
  await delay(200);
  return mockInvitations;
}

/**
 * Send an invitation to a prospective client
 * POST /api/invitations
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/invitations`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, name })
 * });
 * if (!response.ok) throw new Error('Failed to send invitation');
 * return response.json();
 */
export async function sendInvitation(
  email: string,
  name: string
): Promise<Invitation> {
  await delay(800);

  // Generate a referral code in the format used
  const referralCode = `BYZ-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const newInvite: Invitation = {
    id: `inv-${Date.now()}`,
    email,
    name,
    sentDate: new Date().toISOString().split('T')[0],
    status: 'sent',
    referralCode,
  };

  return newInvite;
}

// ============================================================================
// PROFILE & SETTINGS ENDPOINTS
// ============================================================================

/**
 * Fetch wealth manager profile
 * GET /api/profile
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/profile`, {
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 * if (!response.ok) throw new Error('Failed to fetch profile');
 * return response.json();
 */
export async function fetchProfile(): Promise<WealthManagerProfile> {
  await delay(200);
  return mockProfile;
}

/**
 * Update wealth manager profile
 * PATCH /api/profile
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/profile`, {
 *   method: 'PATCH',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify(profile)
 * });
 * if (!response.ok) throw new Error('Failed to update profile');
 * return response.json();
 */
export async function updateProfile(
  profile: Partial<WealthManagerProfile>
): Promise<WealthManagerProfile> {
  await delay(500);
  return { ...mockProfile, ...profile };
}

// ============================================================================
// CLIENT MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * Update a client's management fee
 * PATCH /api/clients/:id/fee
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/clients/${clientId}/fee`, {
 *   method: 'PATCH',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify({ managementFee: newFee })
 * });
 * if (!response.ok) throw new Error('Failed to update client fee');
 * return response.json();
 */
export async function updateClientFee(
  clientId: string,
  newFee: number
): Promise<Client> {
  await delay(500);
  const client = mockClients.find(c => c.id === clientId);
  if (!client) throw new Error('Client not found');
  client.managementFee = newFee;
  return client;
}

/**
 * Approve a client's KYC
 * POST /api/clients/:id/kyc/approve
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/clients/${clientId}/kyc/approve`, {
 *   method: 'POST',
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 * if (!response.ok) throw new Error('Failed to approve KYC');
 * return response.json();
 */
export async function approveClientKyc(clientId: string): Promise<Client> {
  await delay(600);
  const client = mockClients.find(c => c.id === clientId);
  if (!client) throw new Error('Client not found');
  if (client.status !== 'kyc_pending') {
    throw new Error('Client KYC is not pending');
  }
  client.status = 'kyc_approved';
  client.kycCompletedDate = new Date().toISOString().split('T')[0];
  return client;
}

/**
 * Record a client's first deposit
 * POST /api/clients/:id/first-deposit
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/clients/${clientId}/first-deposit`, {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify({ amount })
 * });
 * if (!response.ok) throw new Error('Failed to record first deposit');
 * return response.json();
 */
export async function recordFirstDeposit(
  clientId: string,
  amount: number
): Promise<Client> {
  await delay(700);
  const client = mockClients.find(c => c.id === clientId);
  if (!client) throw new Error('Client not found');
  client.status = 'first_deposit';
  client.firstDepositDate = new Date().toISOString().split('T')[0];
  client.aum = amount;
  client.totalDeposits = amount;
  return client;
}

/**
 * Cancel a client's account
 * POST /api/clients/:id/cancel
 *
 * TODO: Replace with:
 * const response = await fetch(`${API_BASE}/clients/${clientId}/cancel`, {
 *   method: 'POST',
 *   headers: { 'Authorization': `Bearer ${token}` }
 * });
 * if (!response.ok) throw new Error('Failed to cancel client');
 * return response.json();
 */
export async function cancelClient(clientId: string): Promise<Client> {
  await delay(600);
  const client = mockClients.find(c => c.id === clientId);
  if (!client) throw new Error('Client not found');
  client.status = 'cancelled';
  client.aum = 0;
  return client;
}

// ============================================================================
// ERROR HANDLING PATTERNS
// ============================================================================

/**
 * Generic error handler for API responses
 */
export async function handleApiError(response: Response): Promise<never> {
  const contentType = response.headers.get('content-type');
  let errorMessage = `HTTP ${response.status}`;

  try {
    if (contentType?.includes('application/json')) {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } else {
      const text = await response.text();
      errorMessage = text || errorMessage;
    }
  } catch (e) {
    // Use default error message
  }

  throw new Error(errorMessage);
}

/**
 * Retry logic for transient failures
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        await delay(delayMs * Math.pow(2, attempt)); // exponential backoff
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}
