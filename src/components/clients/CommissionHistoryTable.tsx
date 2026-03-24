"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/format";
import type { QuarterlyPayout } from "@/types";

interface CommissionHistoryTableProps {
  payouts: QuarterlyPayout[];
}

const STATUS_CLASSES: Record<string, string> = {
  paid: "bg-[#D4EDDA] text-[#155724]",
  pending: "bg-[#FFF3CD] text-[#856404]",
  processing: "bg-[#E8E0EC] text-[#6B5A70]",
};

export function CommissionHistoryTable({
  payouts,
}: CommissionHistoryTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-[#E8E0EC]">
        <h3 className="text-lg font-semibold text-[#1A0918]">
          Commission History
        </h3>
      </div>

      {payouts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout, index) => (
                <motion.tr
                  key={`${payout.quarter}-${payout.year}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="hover:bg-[#F3EFF5] transition-colors"
                >
                  <td className="font-medium text-[#1A0918]">
                    {payout.quarter} {payout.year}
                  </td>
                  <td className="text-sm text-[#6B5A70]">
                    {payout.paidDate
                      ? new Date(payout.paidDate).toLocaleDateString("fr-FR")
                      : "Pending"}
                  </td>
                  <td className="font-medium text-[#702963]">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${STATUS_CLASSES[payout.status] || ""}`}
                    >
                      {payout.status.charAt(0).toUpperCase() +
                        payout.status.slice(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-[#9B8FA0]">
          No commission history found
        </div>
      )}
    </div>
  );
}
