"use client";

import { motion } from "framer-motion";

interface PayoutPreferencesProps {
  payoutMethod: "bank_transfer" | "byzantine_prime";
  onMethodChange: (method: "bank_transfer" | "byzantine_prime") => void;
  bankDetails: { iban: string; bic: string; bankName: string };
  onBankDetailsChange: (
    field: "iban" | "bic" | "bankName",
    value: string
  ) => void;
  translations: {
    payoutPreferences: string;
    payoutMethod: string;
    bankTransfer: string;
    iban: string;
    bic: string;
    bankName: string;
  };
}

export function PayoutPreferences({
  payoutMethod,
  onMethodChange,
  bankDetails,
  onBankDetailsChange,
  translations: t,
}: PayoutPreferencesProps) {
  return (
    <div className="glass-card p-8 space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">
        {t.payoutPreferences}
      </h2>

      <div className="space-y-4">
        <span className="block text-sm font-medium text-text-primary mb-3">
          {t.payoutMethod}
        </span>

        <div className="space-y-3">
          <div
            className="flex items-start gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface-hover transition-colors"
            onClick={() => onMethodChange("bank_transfer")}
          >
            <div className="flex items-center mt-1">
              <input
                type="radio"
                name="payoutMethod"
                checked={payoutMethod === "bank_transfer"}
                onChange={() => onMethodChange("bank_transfer")}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-text-primary">{t.bankTransfer}</p>
              <p className="text-sm text-text-secondary">
                Direct transfer to your bank account
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-surface-hover transition-colors"
            onClick={() => onMethodChange("byzantine_prime")}
          >
            <div className="flex items-center mt-1">
              <input
                type="radio"
                name="payoutMethod"
                checked={payoutMethod === "byzantine_prime"}
                onChange={() => onMethodChange("byzantine_prime")}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-text-primary">
                Byzantine Prime Account
              </p>
              <p className="text-sm text-text-secondary">
                Credit to your Byzantine Prime account for instant reinvestment
              </p>
            </div>
          </div>
        </div>
      </div>

      {payoutMethod === "bank_transfer" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="pt-6 border-t border-border-light space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="payout-iban"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t.iban}
              </label>
              <input
                id="payout-iban"
                type="text"
                value={bankDetails.iban}
                onChange={(e) => onBankDetailsChange("iban", e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-byzantine focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="payout-bic"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t.bic}
              </label>
              <input
                id="payout-bic"
                type="text"
                value={bankDetails.bic}
                onChange={(e) => onBankDetailsChange("bic", e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-byzantine focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="payout-bank-name"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              {t.bankName}
            </label>
            <input
              id="payout-bank-name"
              type="text"
              value={bankDetails.bankName}
              onChange={(e) => onBankDetailsChange("bankName", e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-byzantine focus:border-transparent"
            />
          </div>
          <div className="mt-6 p-4 bg-surface-secondary rounded-lg border border-border-light">
            <p className="text-xs text-text-muted uppercase tracking-wide font-semibold mb-2">
              Preview
            </p>
            <p className="text-sm text-text-primary">
              Your next commission payment of{" "}
              <span className="font-semibold">€18,275</span> will be sent via
              bank transfer to{" "}
              <span className="font-semibold">
                {bankDetails.bankName || "your bank"}
              </span>
            </p>
          </div>
        </motion.div>
      )}

      {payoutMethod === "byzantine_prime" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="pt-6 border-t border-border-light"
        >
          <div className="p-4 bg-surface-secondary rounded-lg border border-border-light">
            <p className="text-sm text-text-primary">
              Your next commission payment of{" "}
              <span className="font-semibold">€18,275</span> will be credited to
              your Byzantine Prime account and can be reinvested immediately.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
