"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";

export function RevenueCalculator() {
  const [projectedAum, setProjectedAum] = useState(50_000_000);

  const projectedEarnings = useMemo(() => {
    const tiers = [
      { limit: 1_000_000, y1: 28, y2: 12, y3: 10 },
      { limit: 5_000_000, y1: 28, y2: 12, y3: 10 },
      { limit: 10_000_000, y1: 36, y2: 16, y3: 12 },
      { limit: Number.POSITIVE_INFINITY, y1: 40, y2: 20, y3: 15 },
    ];

    let remaining = projectedAum;
    let year1 = 0;
    let year2 = 0;
    let year3 = 0;
    let prevLimit = 50_000;

    for (const tier of tiers) {
      if (remaining <= 0) break;
      const tierAum = Math.min(remaining, tier.limit - prevLimit);
      year1 += (tierAum * tier.y1) / 10_000;
      year2 += (tierAum * tier.y2) / 10_000;
      year3 += (tierAum * tier.y3) / 10_000;
      remaining -= tierAum;
      prevLimit = tier.limit;
    }

    return { year1, year2, year3 };
  }, [projectedAum]);

  const chartData = [
    {
      name: "Projected Annual Earnings",
      "Year 1": Math.round(projectedEarnings.year1),
      "Year 2": Math.round(projectedEarnings.year2),
      "Year 3+": Math.round(projectedEarnings.year3),
    },
  ];

  const yearCards = [
    {
      label: "Year 1",
      value: projectedEarnings.year1,
      gradient: "from-[#16A34A] to-[#10B981]",
    },
    {
      label: "Year 2",
      value: projectedEarnings.year2,
      gradient: "from-[#F59E0B] to-[#FBBF24]",
    },
    {
      label: "Year 3+",
      value: projectedEarnings.year3,
      gradient: "from-[#2563EB] to-[#3B82F6]",
    },
  ];

  return (
    <div className="glass-card p-4 md:p-6">
      <h2 className="text-xl font-bold text-[#1A0918] mb-6">
        Revenue Projection Calculator
      </h2>

      <div className="space-y-6">
        {/* Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="aum-slider"
              className="text-sm font-medium text-[#1A0918]"
            >
              Expected Total AUM at Year End
            </label>
            <span className="text-2xl font-bold text-[#702963]">
              {formatCurrency(projectedAum)}
            </span>
          </div>
          <input
            id="aum-slider"
            type="range"
            min="1000000"
            max="100000000"
            step="1000000"
            value={projectedAum}
            onChange={(e) => setProjectedAum(Number(e.target.value))}
            className="w-full h-2 bg-[#E0B3D9] rounded-lg appearance-none cursor-pointer accent-[#702963]"
          />
          <div className="flex justify-between text-xs text-[#9B8FA0]">
            <span>€1M</span>
            <span>€100M</span>
          </div>
        </div>

        {/* Year Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {yearCards.map(({ label, value, gradient }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`bg-gradient-to-br ${gradient} rounded-lg p-4 md:p-6 text-white`}
            >
              <p className="text-sm font-medium opacity-90 mb-2">{label}</p>
              <p className="text-3xl font-bold">
                {formatCurrency(value).split(" ")[0]}
              </p>
              <p className="text-xs opacity-75 mt-2">
                Annualized at {label} rates
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="mt-4 md:mt-8 h-[200px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0B3D9" />
              <XAxis
                dataKey="name"
                stroke="#9B8FA0"
                style={{ fontSize: "0.875rem" }}
              />
              <YAxis stroke="#9B8FA0" style={{ fontSize: "0.875rem" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E0B3D9",
                  borderRadius: "8px",
                }}
                formatter={(value) => [
                  `€${(value as number).toLocaleString("fr-FR")}`,
                  "",
                ]}
              />
              <Legend />
              <Bar dataKey="Year 1" fill="#16A34A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Year 2" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Year 3+" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <p className="text-sm text-[#6B5A70] bg-[#F9F0F7] p-4 rounded-lg">
          If you bring{" "}
          <span className="font-bold text-[#702963]">
            {formatCurrency(projectedAum)}
          </span>{" "}
          in AUM by year-end, you&apos;ll earn{" "}
          <span className="font-bold text-[#16A34A]">
            {formatCurrency(projectedEarnings.year1)}
          </span>{" "}
          in Year 1 commission, declining to{" "}
          <span className="font-bold text-[#2563EB]">
            {formatCurrency(projectedEarnings.year3)}
          </span>{" "}
          in Year 3+.
        </p>
      </div>
    </div>
  );
}
