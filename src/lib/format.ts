/**
 * Shared formatting utilities for the Byzantine WM Dashboard.
 */

export function formatCurrency(amount: number, locale = 'fr-FR', currency = 'EUR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatBps(value: number): string {
  return `${value} bps`;
}

export function formatDate(dateStr: string, locale = 'fr-FR'): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 7) return `${daysAgo}d ago`;
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}w ago`;
  if (daysAgo < 365) return `${Math.floor(daysAgo / 30)}m ago`;
  return `${Math.floor(daysAgo / 365)}y ago`;
}

/**
 * Calculate next quarterly payout date.
 * Q1 Jan-Mar → payout April 1
 * Q2 Apr-Jun → payout July 1
 * Q3 Jul-Sep → payout Oct 1
 * Q4 Oct-Dec → payout Jan 1
 */
export function getNextPayoutDate(): string {
  const now = new Date();
  const month = now.getMonth();

  let nextPayout: Date;
  if (month < 3) {
    nextPayout = new Date(now.getFullYear(), 3, 1);
  } else if (month < 6) {
    nextPayout = new Date(now.getFullYear(), 6, 1);
  } else if (month < 9) {
    nextPayout = new Date(now.getFullYear(), 9, 1);
  } else {
    nextPayout = new Date(now.getFullYear() + 1, 0, 1);
  }

  return nextPayout.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get commission tier bps based on AUM bracket and partnership year.
 */
export function getTierBps(aum: number, year: number): number {
  if (aum < 1_000_000) {
    return year === 1 ? 28 : year === 2 ? 12 : 10;
  } else if (aum < 5_000_000) {
    return year === 1 ? 28 : year === 2 ? 12 : 10;
  } else if (aum < 10_000_000) {
    return year === 1 ? 36 : year === 2 ? 16 : 12;
  }
  return year === 1 ? 40 : year === 2 ? 20 : 15;
}

/**
 * Calculate annual fee income from AUM and fee in bps.
 */
export function calculateAnnualFee(aum: number, feeBps: number): number {
  return (aum * feeBps) / 10_000;
}
