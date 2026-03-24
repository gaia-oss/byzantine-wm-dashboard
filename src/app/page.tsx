"use client";

import { motion } from "framer-motion";
import { ArrowUpDown, Calendar, Coins, TrendingUp, Users } from "lucide-react";
import { AumChart } from "@/components/charts/AumChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { FunnelPills } from "@/components/ui/FunnelPills";
import { KpiCard } from "@/components/ui/KpiCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useI18n } from "@/i18n/context";
import { formatCurrency, getNextPayoutDate } from "@/lib/format";
import {
  fetchAumHistory,
  fetchClientFunnel,
  fetchDashboardKPIs,
  fetchProfile,
  fetchTransactions,
} from "@/lib/services";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function DashboardHome() {
  const { t } = useI18n();

  const { data, loading } = useAsyncData(
    () =>
      Promise.all([
        fetchDashboardKPIs(),
        fetchProfile(),
        fetchClientFunnel(),
        fetchTransactions(10),
        fetchAumHistory(),
      ]).then(([kpis, profile, funnel, transactions, aumHistory]) => ({
        kpis,
        profile,
        funnel,
        transactions,
        aumHistory,
      })),
    []
  );

  const kpis = data?.kpis;
  const profile = data?.profile;
  const funnel = data?.funnel;
  const transactions = data?.transactions ?? [];
  const aumHistory = data?.aumHistory ?? [];

  const kpiCards = kpis
    ? [
        {
          title: t.overview.totalAum,
          value: formatCurrency(kpis.totalAum),
          change: kpis.totalAumChange,
          trend: "up" as const,
          icon: <TrendingUp size={20} />,
        },
        {
          title: t.overview.activeClients,
          value: `${kpis.activeClients} / ${kpis.totalClients}`,
          subtitle: "of total clients",
          icon: <Users size={20} />,
        },
        {
          title: t.overview.estimatedCommission,
          value: formatCurrency(kpis.estimatedQuarterlyCommission),
          subtitle: "Running estimate",
          icon: <Coins size={20} />,
        },
        {
          title: "Next Payout",
          value: getNextPayoutDate(),
          subtitle: "Date countdown",
          icon: <Calendar size={20} />,
        },
        {
          title: "Net Deposits Q1",
          value: formatCurrency(
            kpis.totalDepositsThisMonth - kpis.totalWithdrawalsThisMonth
          ),
          change:
            kpis.totalDepositsThisMonth - kpis.totalWithdrawalsThisMonth > 0
              ? 5.2
              : -2.1,
          trend: (kpis.totalDepositsThisMonth - kpis.totalWithdrawalsThisMonth >
          0
            ? "up"
            : "down") as "up" | "down",
          icon: <ArrowUpDown size={20} />,
        },
      ]
    : [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 md:space-y-6 lg:space-y-8"
    >
      {/* Welcome */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A0918] mb-1">
          {t.overview.welcome}, {profile?.name || "Marc"}.
        </h1>
        <p className="text-[#9B8FA0]">{t.overview.subtitle}</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <SkeletonCard />
              </motion.div>
            ))
          : kpiCards.map((card) => (
              <motion.div key={card.title} variants={itemVariants}>
                <KpiCard {...card} />
              </motion.div>
            ))}
      </motion.div>

      {/* AUM Chart */}
      <motion.div variants={itemVariants}>
        {loading ? (
          <div className="glass-card p-8 h-96 flex items-center justify-center">
            <div className="animate-pulse text-[#9B8FA0]">
              {t.common.loading}
            </div>
          </div>
        ) : (
          <AumChart data={aumHistory} />
        )}
      </motion.div>

      {/* Pipeline + Activity */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-[#1A0918] mb-4">
            {t.overview.clientFunnel}
          </h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            funnel && <FunnelPills data={funnel} />
          )}
        </div>

        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-[#1A0918] mb-4">
            {t.overview.recentActivity}
          </h3>
          <ActivityFeed transactions={transactions} loading={loading} />
        </div>
      </motion.div>
    </motion.div>
  );
}
