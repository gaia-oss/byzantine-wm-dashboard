"use client";

import { motion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  icon?: ReactNode;
}

export function KpiCard({
  title,
  value,
  change,
  trend = "neutral",
  subtitle,
  icon,
}: KpiCardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "text-[#16A34A]";
    if (trend === "down") return "text-[#DC2626]";
    return "text-[#6B5A70]";
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp size={16} />;
    if (trend === "down") return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-4 md:p-5 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-auto">
        <p className="text-xs font-medium text-[#9B8FA0]">{title}</p>
        {icon && (
          <div className="text-[#702963] opacity-50 flex-shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-lg md:text-xl font-bold text-[#1A0918] leading-tight">
          {value}
        </p>
      </div>

      <div className="mt-2 h-5">
        {change !== undefined ? (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-xs font-semibold">
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        ) : subtitle ? (
          <p className="text-xs text-[#9B8FA0]">{subtitle}</p>
        ) : null}
      </div>
    </motion.div>
  );
}
