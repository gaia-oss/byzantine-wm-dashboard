"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AumChart } from "@/components/charts/AumChart";
import { CommissionHistoryTable } from "@/components/clients/CommissionHistoryTable";
import { CommissionTierCard } from "@/components/clients/CommissionTierCard";
import { FeeEditor } from "@/components/clients/FeeEditor";
import { TransactionTable } from "@/components/clients/TransactionTable";
import { KpiCard } from "@/components/ui/KpiCard";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useI18n } from "@/i18n/context";
import { formatCurrency, formatDate } from "@/lib/format";
import { fetchClientById, updateClientFee } from "@/lib/services";
import type { ClientDetail } from "@/types";

interface ClientDetailPageProps {
  params: { id: string };
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { t } = useI18n();
  const [clientOverride, setClientOverride] = useState<ClientDetail | null>(
    null
  );

  const {
    data: fetchedClient,
    loading,
    error,
  } = useAsyncData(() => fetchClientById(params.id), [params.id]);

  const client = clientOverride ?? fetchedClient;

  const handleSaveFee = async (newFee: number) => {
    if (!client) return;
    const updated = await updateClientFee(client.id, newFee);
    setClientOverride({ ...client, managementFee: updated.managementFee });
  };

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A0918] mb-2">
          {t.clients.name}
        </h1>
        <SkeletonTable />
      </div>
    );
  }

  if (error || !client) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 md:space-y-6"
      >
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-[#702963] hover:text-[#5A1F4F] font-medium"
        >
          <ArrowLeft size={18} /> Back to clients
        </Link>
        <div className="glass-card p-8 text-center">
          <p className="text-[#9B8FA0] text-lg">
            {error || "Client not found"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-[#702963] hover:text-[#5A1F4F] font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Back to clients
      </Link>

      {/* Client Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 md:p-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A0918] mb-2">
          {client.name}
        </h1>
        <p className="text-[#6B5A70] mb-4">{client.email}</p>
        <div className="flex flex-wrap gap-3">
          <span className="text-xs px-3 py-1.5 bg-[#F3EFF5] text-[#6B5A70] rounded capitalize font-medium">
            {client.type === "individual" ? "Individual" : "Business"}
          </span>
          <StatusBadge status={client.status} />
          <span className="text-xs px-3 py-1.5 bg-[#E8E0EC] text-[#6B5A70] rounded font-medium">
            Joined {formatDate(client.joinDate)}
          </span>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <KpiCard title="Current Balance" value={formatCurrency(client.aum)} />
        <KpiCard title="Avg Quarterly AUM" value={formatCurrency(client.aum)} />
        <KpiCard
          title="Commission Earned"
          value={formatCurrency(
            client.commissionHistory?.reduce((s, p) => s + p.amount, 0) || 0
          )}
        />
        <KpiCard
          title="Current Yield"
          value={`${(((client.managementFee || 0) / 10000) * 100).toFixed(2)}%`}
        />
      </motion.div>

      {/* Commission Tier */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CommissionTierCard commissionTier={client.commissionTier} />
      </motion.div>

      {/* Fee Editor */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <FeeEditor
          currentFee={client.managementFee}
          clientAum={client.aum}
          onSave={handleSaveFee}
        />
      </motion.div>

      {/* AUM Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AumChart data={client.aumHistory} />
      </motion.div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <TransactionTable transactions={client.transactions || []} />
      </motion.div>

      {/* Commission History */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CommissionHistoryTable payouts={client.commissionHistory || []} />
      </motion.div>
    </motion.div>
  );
}
