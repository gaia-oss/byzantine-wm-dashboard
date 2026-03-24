"use client";

import { useI18n } from "@/i18n/context";
import type { ClientStatus } from "@/types";

interface StatusBadgeProps {
  status: ClientStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();

  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          className: "badge badge-success",
          label: (t.funnel as any).active,
        };
      case "kyc_pending":
        return {
          className: "badge badge-warning",
          label: (t.funnel as any).kycPending,
        };
      case "kyc_approved":
        return {
          className: "badge badge-warning",
          label: (t.funnel as any).kycApproved,
        };
      case "first_deposit":
        return {
          className: "badge badge-info",
          label: (t.funnel as any).firstDeposit,
        };
      case "invited":
        return {
          className: "badge badge-purple",
          label: (t.funnel as any).invited,
        };
      case "cancelled":
        return {
          className: "badge badge-danger",
          label: (t.funnel as any).cancelled,
        };
      default:
        return {
          className: "badge badge-purple",
          label: status,
        };
    }
  };

  const config = getStatusConfig();

  return <span className={config.className}>{config.label}</span>;
}
