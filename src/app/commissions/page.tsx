'use client';

import { motion } from 'framer-motion';
import { KpiCard } from '@/components/ui/KpiCard';
import { RevenueCalculator } from '@/components/commissions/RevenueCalculator';
import { useI18n } from '@/i18n/context';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchDashboardKPIs, fetchCommissionBreakdown } from '@/lib/services';
import { COMMISSION_TIERS } from '@/lib/mock-data';
import { formatCurrency, formatBps } from '@/lib/format';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CommissionsPage() {
  const { t } = useI18n();

  const { data, loading } = useAsyncData(
    () =>
      Promise.all([fetchDashboardKPIs(), fetchCommissionBreakdown()]).then(([kpis, breakdown]) => ({
        kpis,
        breakdown,
      })),
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#9B8FA0]">{t.common.loading}</p>
      </div>
    );
  }

  const kpis = data?.kpis;
  const breakdown = data?.breakdown ?? [];

  const earningsCards = [
    { title: 'Total Earned (Lifetime)', value: formatCurrency(kpis?.lifetimeEarnings || 47575), subtitle: 'All-time earnings' },
    { title: 'Earned This Year', value: formatCurrency(kpis?.yearToDateEarnings || 36825), subtitle: 'Year-to-date' },
    { title: 'This Quarter (Running)', value: formatCurrency(kpis?.estimatedQuarterlyCommission || 18275), subtitle: 'Q1 2026 estimate' },
    { title: 'Projected Next Quarter', value: formatCurrency(kpis?.projectedNextQuarter || 22850), subtitle: 'Q2 2026 estimate' },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pt-8">
          <h1 className="text-3xl font-bold text-[#1A0918] mb-2">{t.commissions.title}</h1>
          <p className="text-[#6B5A70]">{t.commissions.subtitle}</p>
        </motion.div>

        {/* Earnings Summary */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {earningsCards.map(card => (
            <motion.div key={card.title} variants={item}>
              <KpiCard {...card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Client Breakdown */}
        <motion.div variants={item} initial="hidden" animate="show" className="glass-card p-6">
          <h2 className="text-xl font-bold text-[#1A0918] mb-4">{t.commissions.clientBreakdown}</h2>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>AUM Tier</th>
                  <th>Partnership Year</th>
                  <th>Applicable Rate</th>
                  <th>Quarterly Commission</th>
                  <th>Cumulative Earned</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map(row => (
                  <tr key={row.clientId}>
                    <td className="font-medium">{row.clientName}</td>
                    <td className="text-[#6B5A70]">{row.tier}</td>
                    <td className="text-[#6B5A70]">{[28, 36, 40].includes(row.bps) ? 'Year 1' : 'Year 2+'}</td>
                    <td className="font-semibold text-[#702963]">{formatBps(row.bps)}</td>
                    <td className="font-semibold">{formatCurrency(row.quarterlyEarning)}</td>
                    <td className="font-semibold text-[#16A34A]">{formatCurrency(row.annualizedEarning)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Tier Reference */}
        <motion.div variants={item} initial="hidden" animate="show" className="glass-card p-6">
          <h2 className="text-xl font-bold text-[#1A0918] mb-4">{t.commissions.commissionTiers}</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>{t.commissions.aumRange}</th>
                  <th>{t.commissions.year1}</th>
                  <th>{t.commissions.year2}</th>
                  <th>{t.commissions.year3}</th>
                </tr>
              </thead>
              <tbody>
                {COMMISSION_TIERS.map(tier => (
                  <tr key={tier.label}>
                    <td className="font-medium">{tier.label}</td>
                    <td className="text-[#16A34A] font-semibold">{formatBps(tier.year1Bps)}</td>
                    <td className="text-[#F59E0B] font-semibold">{formatBps(tier.year2Bps)}</td>
                    <td className="text-[#2563EB] font-semibold">{formatBps(tier.year3Bps)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#F9F0F7] border border-[#E0B3D9] rounded-lg p-4 space-y-2">
            <p className="text-sm text-[#6B5A70]"><span className="font-semibold">Commission calculated</span> on average daily AUM over the quarter</p>
            <p className="text-sm text-[#6B5A70]"><span className="font-semibold">Deposits in last 30 days</span> of quarter are pro-rated</p>
            <p className="text-sm text-[#6B5A70]"><span className="font-semibold">10M+ clients:</span> auto-renewed, no time limit</p>
            <p className="text-sm text-[#6B5A70]"><span className="font-semibold">Below 10M:</span> 36-month term, renewable</p>
            <p className="text-sm text-[#6B5A70]"><span className="font-semibold">Payment:</span> quarterly, via bank transfer or Byzantine Prime account</p>
          </div>
        </motion.div>

        {/* Revenue Calculator */}
        <RevenueCalculator />
      </div>
    </div>
  );
}
