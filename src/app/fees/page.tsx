"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useI18n } from "@/i18n/context";
import { formatBps, formatCurrency } from "@/lib/format";
import {
  fetchClients,
  fetchDashboardKPIs,
  updateClientFee,
} from "@/lib/services";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function FeesPage() {
  const { t } = useI18n();
  const [defaultFee, setDefaultFee] = useState(40);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [clientFees, setClientFees] = useState<Record<string, number>>({});
  const [selectedFee, setSelectedFee] = useState(40);

  const { data, loading } = useAsyncData(
    () =>
      Promise.all([fetchDashboardKPIs(), fetchClients()]).then(
        ([kpis, allClients]) => {
          const activeClients = allClients.filter(
            (c) => c.status === "active" || c.status === "first_deposit"
          );
          const fees: Record<string, number> = {};
          activeClients.forEach((c) => {
            fees[c.id] = c.managementFee || 40;
          });
          setClientFees(fees);
          return { kpis, clients: activeClients };
        }
      ),
    []
  );

  const clients = data?.clients ?? [];

  const totalActiveAum = useMemo(
    () => clients.reduce((sum, c) => sum + (c.aum || 0), 0),
    [clients]
  );
  const feeIncome = useMemo(
    () => (totalActiveAum * selectedFee) / 10_000,
    [totalActiveAum, selectedFee]
  );

  const clientFeeIncomes = useMemo(
    () =>
      clients.map((c) => ({
        ...c,
        annualFeeIncome: (c.aum * (clientFees[c.id] || defaultFee)) / 10_000,
      })),
    [clients, clientFees, defaultFee]
  );

  const handleSaveFee = async (clientId: string, newFee: number) => {
    await updateClientFee(clientId, newFee);
    setClientFees((prev) => ({ ...prev, [clientId]: newFee }));
    setEditingClientId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#9B8FA0]">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A0918] mb-2">
            Management Fees
          </h1>
          <p className="text-[#6B5A70]">
            Configure and monitor management fees for your clients
          </p>
        </motion.div>

        {/* Default Fee */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-[#1A0918] mb-6">
            Default Management Fee
          </h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label
                htmlFor="default-fee-input"
                className="block text-sm font-medium text-[#1A0918] mb-2"
              >
                Fee Rate (bps)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="default-fee-input"
                  type="number"
                  min="0"
                  max="200"
                  value={defaultFee}
                  onChange={(e) =>
                    setDefaultFee(
                      Math.max(0, Math.min(200, Number(e.target.value)))
                    )
                  }
                  className="flex-1 px-4 py-3 border border-[#E0B3D9] rounded-lg text-[#1A0918] font-semibold focus:outline-none focus:ring-2 focus:ring-[#702963]"
                />
                <span className="text-lg font-semibold text-[#702963]">
                  bps/year
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#6B5A70] bg-[#F9F0F7] p-3 rounded-lg mt-4">
            <span className="font-semibold">Note:</span> This fee is applied to
            all new clients unless overridden individually.
          </p>
        </motion.div>

        {/* Per-Client Overrides */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-[#1A0918] mb-4">
            Per-Client Fee Overrides
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Current AUM</th>
                  <th>Management Fee</th>
                  <th>Annual Fee Income</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {clientFeeIncomes.map((client) => (
                  <tr key={client.id}>
                    <td className="font-medium">{client.name}</td>
                    <td className="text-[#6B5A70]">
                      {formatCurrency(client.aum)}
                    </td>
                    <td>
                      {editingClientId === client.id ? (
                        <input
                          type="number"
                          min="0"
                          max="200"
                          defaultValue={clientFees[client.id]}
                          autoFocus
                          onBlur={(e) =>
                            handleSaveFee(
                              client.id,
                              Math.max(0, Math.min(200, Number(e.target.value)))
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleSaveFee(
                                client.id,
                                Math.max(
                                  0,
                                  Math.min(
                                    200,
                                    Number((e.target as HTMLInputElement).value)
                                  )
                                )
                              );
                            if (e.key === "Escape") setEditingClientId(null);
                          }}
                          className="w-20 px-2 py-1 border border-[#702963] rounded text-[#1A0918] font-semibold focus:outline-none"
                        />
                      ) : (
                        <span className="font-semibold text-[#702963]">
                          {formatBps(clientFees[client.id] || defaultFee)}
                        </span>
                      )}
                    </td>
                    <td className="font-semibold text-[#16A34A]">
                      {formatCurrency(client.annualFeeIncome)}
                    </td>
                    <td>
                      <button
                        onClick={() => setEditingClientId(client.id)}
                        disabled={editingClientId === client.id}
                        className="text-sm px-3 py-1 rounded bg-[#F0D9EC] text-[#702963] font-medium hover:bg-[#E0B3D9] disabled:opacity-50 transition-colors"
                      >
                        {editingClientId === client.id ? "Saving..." : "Edit"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Impact Calculator */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-[#1A0918] mb-6">
            Fee Income Impact Calculator
          </h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="fee-slider"
                  className="text-sm font-medium text-[#1A0918]"
                >
                  Management Fee
                </label>
                <span className="text-2xl font-bold text-[#702963]">
                  {formatBps(selectedFee)}
                </span>
              </div>
              <input
                id="fee-slider"
                type="range"
                min="0"
                max="200"
                step="1"
                value={selectedFee}
                onChange={(e) => setSelectedFee(Number(e.target.value))}
                className="w-full h-2 bg-[#E0B3D9] rounded-lg appearance-none cursor-pointer accent-[#702963]"
              />
              <div className="flex justify-between text-xs text-[#9B8FA0]">
                <span>0 bps</span>
                <span>200 bps</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#702963] to-[#8B3A7F] rounded-lg p-6 text-white">
              <p className="text-sm font-medium opacity-90 mb-2">
                Annual Fee Income
              </p>
              <p className="text-3xl font-bold">{formatCurrency(feeIncome)}</p>
              <p className="text-sm opacity-75">
                Total active AUM:{" "}
                <span className="font-semibold">
                  {formatCurrency(totalActiveAum)}
                </span>{" "}
                × {selectedFee} bps = {formatCurrency(feeIncome)}/year
              </p>
            </div>

            <div className="space-y-3 bg-[#F9F0F7] border border-[#E0B3D9] rounded-lg p-4">
              <p className="text-sm text-[#6B5A70]">
                <span className="font-semibold">
                  Your fees on top of yield:
                </span>{" "}
                Management fees are charged in addition to Byzantine
                Prime&apos;s yield (currently 4-6%)
              </p>
              <p className="text-sm text-[#6B5A70]">
                <span className="font-semibold">Client earnings:</span> Your
                clients still earn the full Byzantine yield minus your
                management fee
              </p>
              <p className="text-sm text-[#6B5A70]">
                <span className="font-semibold">Effective date:</span> Fee
                changes take effect on the next billing cycle
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info + Summary */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-[#1A0918] mb-4">
            Fee Schedule Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-[#702963]">
                How Management Fees Work
              </h3>
              <p className="text-sm text-[#6B5A70]">
                Management fees are charged annually as basis points (bps) of
                the client&apos;s average AUM. These fees are separate from
                Byzantine Prime&apos;s 4-6% yield and represent your
                compensation for client acquisition and management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#702963]">Billing Cycle</h3>
              <p className="text-sm text-[#6B5A70]">
                Fees are calculated quarterly on the average daily AUM. Changes
                to management fees take effect on the next billing cycle
                (approximately 2 weeks after modification).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#702963]">Client Example</h3>
              <div className="bg-[#F9F0F7] p-3 rounded text-sm text-[#6B5A70]">
                <p>
                  <span className="font-semibold">Client AUM:</span> €1,000,000
                </p>
                <p>
                  <span className="font-semibold">Your fee:</span> 40 bps
                </p>
                <p>
                  <span className="font-semibold">Annual fee income:</span>{" "}
                  €1,000,000 × 0.40% = €4,000/year (€1,000/quarter)
                </p>
                <p className="mt-2 text-xs opacity-75">
                  Plus: Client receives full Byzantine yield (4-6%) on their
                  €1,000,000
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-[#9B8FA0] mb-2">
              Total Active AUM
            </h3>
            <p className="text-3xl font-bold text-[#1A0918]">
              {formatCurrency(totalActiveAum)}
            </p>
            <p className="text-xs text-[#6B5A70] mt-2">
              Across {clients.length} active clients
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-[#9B8FA0] mb-2">
              Annual Fee Income (Current Fees)
            </h3>
            <p className="text-3xl font-bold text-[#16A34A]">
              {formatCurrency(
                clientFeeIncomes.reduce((s, c) => s + c.annualFeeIncome, 0)
              )}
            </p>
            <p className="text-xs text-[#6B5A70] mt-2">
              Based on individual client fee settings
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
