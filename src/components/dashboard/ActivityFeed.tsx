"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useI18n } from "@/i18n/context";
import type { Transaction } from "@/types";

interface ActivityFeedProps {
  transactions: Transaction[];
  loading?: boolean;
}

type FilterType = "all" | "deposits" | "withdrawals";

export function ActivityFeed({
  transactions,
  loading = false,
}: ActivityFeedProps) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTransactions = useMemo(() => {
    if (filter === "all") return transactions;
    if (filter === "deposits")
      return transactions.filter((tx) => tx.type === "deposit");
    return transactions.filter((tx) => tx.type === "withdrawal");
  }, [transactions, filter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const filters: { label: string; value: FilterType }[] = [
    { label: t.overview.all || "All", value: "all" },
    { label: t.common.deposit || "Deposits", value: "deposits" },
    { label: t.common.withdrawal || "Withdrawals", value: "withdrawals" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filter === f.value
                ? "bg-[#702963] text-white"
                : "bg-[#F3EFF5] text-[#6B5A70] hover:bg-[#E8E0EC]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="glass-card p-8 flex flex-col items-center justify-center h-64">
          <Clock size={32} className="text-[#9B8FA0] mb-3" />
          <p className="text-[#9B8FA0]">{t.common.noData}</p>
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              variants={{
                hidden: { opacity: 0, x: -8 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.2 }}
              className="glass-card p-4 flex items-center justify-between hover:bg-[#F9F0F7] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-lg ${
                    tx.type === "deposit" ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]"
                  }`}
                >
                  {tx.type === "deposit" ? (
                    <ArrowDownLeft size={18} className="text-[#16A34A]" />
                  ) : (
                    <ArrowUpRight size={18} className="text-[#DC2626]" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A0918]">
                    {tx.clientName}
                  </p>
                  <p className="text-xs text-[#9B8FA0]">{tx.product}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === "deposit"
                        ? "text-[#16A34A]"
                        : "text-[#DC2626]"
                    }`}
                  >
                    {tx.type === "deposit" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-[#9B8FA0]">
                    {formatDate(tx.date)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
