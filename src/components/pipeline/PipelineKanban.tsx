"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/format";
import type { Client } from "@/types";

interface PipelineKanbanProps {
  clientsByStatus: Record<string, Client[]>;
}

const COLUMNS = [
  { status: "invited", title: "Invited", bgColor: "bg-purple-50" },
  { status: "kyc_pending", title: "Signed Up", bgColor: "bg-orange-50" },
  { status: "kyc_approved", title: "KYC Approved", bgColor: "bg-yellow-50" },
  { status: "first_deposit", title: "First Deposit", bgColor: "bg-blue-50" },
  { status: "active", title: "Active", bgColor: "bg-green-50" },
];

function getDaysInStage(client: Client): number {
  const joinDate = new Date(client.joinDate);
  const today = new Date();
  return Math.floor(
    (today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function PipelineKanban({ clientsByStatus }: PipelineKanbanProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">
        Pipeline stages
      </h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 md:gap-4 lg:gap-6 min-w-max">
          {COLUMNS.map((column, columnIndex) => {
            const clients = clientsByStatus[column.status] || [];
            return (
              <motion.div
                key={column.status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * columnIndex }}
                className={`flex-shrink-0 w-64 md:w-72 lg:w-80 ${column.bgColor} rounded-lg p-3 md:p-4`}
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-text-primary text-sm mb-1">
                    {column.title}
                  </h3>
                  <div className="text-xs text-text-muted">
                    {clients.length}{" "}
                    {clients.length === 1 ? "client" : "clients"}
                  </div>
                </div>
                <div className="space-y-3">
                  {clients.map((client, cardIndex) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * cardIndex }}
                      className="glass-card p-3 md:p-4"
                    >
                      <div className="mb-3">
                        <p className="font-medium text-text-primary text-sm">
                          {client.name}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {client.email}
                        </p>
                      </div>
                      <div className="mb-3 space-y-1 text-xs text-text-secondary">
                        <div>
                          Joined:{" "}
                          {new Date(client.joinDate).toLocaleDateString()}
                        </div>
                        <div>{getDaysInStage(client)} days in stage</div>
                        {client.aum > 0 && (
                          <div>AUM: {formatCurrency(client.aum)}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {column.status === "invited" && (
                          <button className="flex-1 text-xs px-3 py-2 bg-byzantine text-white rounded hover:bg-byzantine-dark transition-colors font-medium">
                            Resend
                          </button>
                        )}
                        {[
                          "kyc_pending",
                          "kyc_approved",
                          "first_deposit",
                        ].includes(column.status) && (
                          <button className="flex-1 text-xs px-3 py-2 bg-byzantine text-white rounded hover:bg-byzantine-dark transition-colors font-medium">
                            Remind
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {clients.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-xs text-text-muted">No clients</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cancelled */}
      {(clientsByStatus.cancelled?.length || 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 rounded-lg p-4"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-red-900 text-sm">
              Cancelled ({clientsByStatus.cancelled.length})
            </h3>
          </div>
          <div className="space-y-2">
            {clientsByStatus.cancelled.map((client) => (
              <div key={client.id} className="glass-card p-3">
                <p className="font-medium text-text-primary text-sm">
                  {client.name}
                </p>
                <p className="text-xs text-text-muted">{client.email}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
