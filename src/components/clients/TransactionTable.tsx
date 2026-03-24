'use client';

import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Transaction } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
}

const STATUS_CLASSES: Record<string, string> = {
  completed: 'bg-[#D4EDDA] text-[#155724]',
  pending: 'bg-[#FFF3CD] text-[#856404]',
  processing: 'bg-[#F8D7DA] text-[#721C24]',
};

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-[#E8E0EC]">
        <h3 className="text-lg font-semibold text-[#1A0918]">Transaction History</h3>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="hover:bg-[#F3EFF5] transition-colors"
                >
                  <td className="text-sm text-[#6B5A70]">{formatDate(tx.date)}</td>
                  <td>
                    <span className="text-sm font-medium capitalize">{tx.type}</span>
                  </td>
                  <td className="font-medium text-[#1A0918]">{formatCurrency(tx.amount)}</td>
                  <td>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${STATUS_CLASSES[tx.status] || ''}`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-xs text-[#9B8FA0] font-mono">{tx.id}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-[#9B8FA0]">No transactions found</div>
      )}
    </div>
  );
}
