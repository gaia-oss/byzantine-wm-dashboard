"use client";

import { motion } from "framer-motion";
import { InvitationsTable } from "@/components/pipeline/InvitationsTable";
import { InviteForm } from "@/components/pipeline/InviteForm";
import { PipelineKanban } from "@/components/pipeline/PipelineKanban";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useI18n } from "@/i18n/context";
import { fetchClients, fetchInvitations, fetchProfile } from "@/lib/services";

export default function PipelinePage() {
  const { t } = useI18n();

  const { data, loading } = useAsyncData(
    () =>
      Promise.all([fetchClients(), fetchInvitations(), fetchProfile()]).then(
        ([clients, invitations, profile]) => ({ clients, invitations, profile })
      ),
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#9B8FA0]">{t.common.loading}</p>
      </div>
    );
  }

  const clients = data?.clients ?? [];
  const invitations = data?.invitations ?? [];
  const profile = data?.profile;

  const referralLink = `https://app.byzantine.fi/ref/${(profile?.name || "USER").split(" ").join("-").toUpperCase()}-2025`;

  const totalInvited = clients.filter((c) => c.status === "invited").length;
  const totalActive = clients.filter((c) => c.status === "active").length;
  const conversionRate =
    totalInvited > 0 ? Math.round((totalActive / totalInvited) * 100) : 0;

  const clientsByStatus: Record<string, typeof clients> = {
    invited: clients.filter((c) => c.status === "invited"),
    kyc_pending: clients.filter((c) => c.status === "kyc_pending"),
    kyc_approved: clients.filter((c) => c.status === "kyc_approved"),
    first_deposit: clients.filter((c) => c.status === "first_deposit"),
    active: clients.filter((c) => c.status === "active"),
    cancelled: clients.filter((c) => c.status === "cancelled"),
  };

  return (
    <div className="min-h-screen bg-surface-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {t.invite.title}
          </h1>
          <p className="text-text-secondary">{t.invite.subtitle}</p>
        </div>

        {/* Invite Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <InviteForm referralLink={referralLink} translations={t.invite} />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              label: "Conversion rate",
              value: `${conversionRate}%`,
              sub: "Invited → Active",
            },
            {
              label: "Avg. time to first deposit",
              value: "12 days",
              sub: "From KYC approval",
            },
            {
              label: "Pipeline status",
              value: `${totalActive}`,
              sub: `Active / ${totalInvited} Invited`,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="glass-card p-6"
            >
              <div className="text-text-secondary text-sm mb-2">
                {stat.label}
              </div>
              <div className="text-3xl font-bold text-byzantine mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-text-muted">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Kanban */}
        <PipelineKanban clientsByStatus={clientsByStatus} />

        {/* Invitations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <InvitationsTable invitations={invitations} translations={t.invite} />
        </motion.div>
      </div>
    </div>
  );
}
