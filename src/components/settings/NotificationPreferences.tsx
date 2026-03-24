"use client";

import { useState } from "react";

interface NotificationConfig {
  key: string;
  title: string;
  description: string;
}

const NOTIFICATIONS: NotificationConfig[] = [
  {
    key: "newDeposits",
    title: "Email alerts for new client deposits",
    description: "Get notified when a client makes a deposit",
  },
  {
    key: "withdrawals",
    title: "Email alerts for client withdrawals",
    description: "Get notified when a client withdraws funds",
  },
  {
    key: "payoutNotifications",
    title: "Commission payout notifications",
    description: "Get notified when your quarterly commission is paid",
  },
  {
    key: "monthlySummary",
    title: "Monthly summary report",
    description: "Receive a comprehensive monthly overview of your pipeline",
  },
  {
    key: "weeklyPipeline",
    title: "Weekly pipeline digest",
    description: "Get a weekly update on your client pipeline progress",
  },
];

export function NotificationPreferences() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    newDeposits: true,
    withdrawals: true,
    payoutNotifications: true,
    monthlySummary: true,
    weeklyPipeline: true,
  });

  const toggle = (key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="glass-card p-4 md:p-6 lg:p-8 space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {NOTIFICATIONS.map(({ key, title, description }) => (
          <div
            key={key}
            className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-text-primary">{title}</p>
              <p className="text-sm text-text-secondary">{description}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled[key] ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled[key] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
