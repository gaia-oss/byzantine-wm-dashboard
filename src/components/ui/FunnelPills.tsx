"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import type { ClientFunnelData } from "@/types";

interface FunnelPillsProps {
  data: ClientFunnelData;
  onFilterChange?: (stage: string | null) => void;
}

export function FunnelPills({ data, onFilterChange }: FunnelPillsProps) {
  const { t } = useI18n();
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const stages = [
    {
      key: "total",
      value: data.total,
      color: "bg-[#F3EFF5] text-[#6B5A70] border-[#E8E0EC]",
    },
    {
      key: "invited",
      value: data.invited,
      color: "bg-[#F9F0F7] text-[#702963] border-[#E0B3D9]",
    },
    {
      key: "kycPending",
      value: data.kycPending,
      color: "bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]",
    },
    {
      key: "kycApproved",
      value: data.kycApproved,
      color: "bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]",
    },
    {
      key: "firstDeposit",
      value: data.firstDeposit,
      color: "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
    },
    {
      key: "active",
      value: data.active,
      color: "bg-[#DCFCE7] text-[#16A34A] border-[#86EFAC]",
    },
    {
      key: "cancelled",
      value: data.cancelled,
      color: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]",
    },
  ];

  const handleStageClick = (stage: string) => {
    const newStage = activeStage === stage ? null : stage;
    setActiveStage(newStage);
    onFilterChange?.(newStage);
  };

  const getLabel = (key: string) => {
    return (t.funnel as any)[key] || key;
  };

  return (
    <div className="flex flex-wrap gap-3">
      {stages.map((stage) => (
        <button
          key={stage.key}
          onClick={() => handleStageClick(stage.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
            stage.color
          } ${
            activeStage === stage.key
              ? "ring-2 ring-offset-2 ring-[#702963]"
              : "hover:shadow-md"
          }`}
        >
          <span className="font-semibold">{stage.value}</span>
          <span className="mx-1 opacity-75">•</span>
          <span className="opacity-80">{getLabel(stage.key)}</span>
        </button>
      ))}
    </div>
  );
}
