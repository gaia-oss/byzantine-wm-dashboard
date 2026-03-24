"use client";

import { motion } from "framer-motion";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatRelativeDate } from "@/lib/format";
import type { Client } from "@/types";

type SortField = "name" | "aum" | "tier" | "commission" | "lastActivity";
type SortDirection = "asc" | "desc";

export interface ClientWithCommission extends Client {
  quarterlyCommission: number;
  avgQuarterlyAum: number;
}

interface ClientTableProps {
  clients: ClientWithCommission[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  translations: {
    name: string;
    type: string;
    aum: string;
    lastActivity: string;
    noClients: string;
  };
}

function SortIndicator({
  field,
  active,
  direction,
}: {
  field: SortField;
  active: SortField;
  direction: SortDirection;
}) {
  if (active !== field) return null;
  return (
    <span className="ml-2 text-[#702963]">
      {direction === "asc" ? "↑" : "↓"}
    </span>
  );
}

export function ClientTable({
  clients,
  sortField,
  sortDirection,
  onSort,
  translations: t,
}: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="glass-card p-8 text-center text-[#9B8FA0]">
        {t.noClients}
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th
                onClick={() => onSort("name")}
                className="cursor-pointer hover:bg-[#F3EFF5] select-none"
              >
                {t.name}
                <SortIndicator
                  field="name"
                  active={sortField}
                  direction={sortDirection}
                />
              </th>
              <th>{t.type}</th>
              <th>Status</th>
              <th
                onClick={() => onSort("aum")}
                className="cursor-pointer hover:bg-[#F3EFF5] select-none"
              >
                {t.aum}
                <SortIndicator
                  field="aum"
                  active={sortField}
                  direction={sortDirection}
                />
              </th>
              <th>Avg Quarterly AUM</th>
              <th>Commission Tier</th>
              <th
                onClick={() => onSort("commission")}
                className="cursor-pointer hover:bg-[#F3EFF5] select-none"
              >
                Quarterly Commission
                <SortIndicator
                  field="commission"
                  active={sortField}
                  direction={sortDirection}
                />
              </th>
              <th
                onClick={() => onSort("lastActivity")}
                className="cursor-pointer hover:bg-[#F3EFF5] select-none"
              >
                {t.lastActivity}
                <SortIndicator
                  field="lastActivity"
                  active={sortField}
                  direction={sortDirection}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <motion.tr
                key={client.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="hover:bg-[#F3EFF5] cursor-pointer transition-colors"
                onClick={() => {
                  window.location.href = `/clients/${client.id}`;
                }}
              >
                <td className="font-medium">
                  <div className="font-semibold text-[#1A0918]">
                    {client.name}
                  </div>
                  <div className="text-xs text-[#9B8FA0]">{client.email}</div>
                </td>
                <td>
                  <span className="text-sm px-2 py-1 bg-[#F3EFF5] text-[#6B5A70] rounded capitalize">
                    {client.type === "individual" ? "Individual" : "Business"}
                  </span>
                </td>
                <td>
                  <StatusBadge status={client.status} />
                </td>
                <td className="font-medium text-[#1A0918]">
                  {client.aum > 0 ? formatCurrency(client.aum) : "—"}
                </td>
                <td className="text-[#6B5A70]">
                  {client.avgQuarterlyAum > 0
                    ? formatCurrency(client.avgQuarterlyAum)
                    : "—"}
                </td>
                <td>
                  <span className="text-xs px-2 py-1 bg-[#E0B3D9] text-[#702963] rounded font-medium">
                    Year {client.commissionTier}
                  </span>
                </td>
                <td className="font-medium text-[#702963]">
                  {client.quarterlyCommission > 0
                    ? formatCurrency(client.quarterlyCommission)
                    : "—"}
                </td>
                <td className="text-[#6B5A70] text-sm">
                  {formatRelativeDate(client.lastActivity)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
