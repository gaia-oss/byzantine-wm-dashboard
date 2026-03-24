"use client";

import { useState } from "react";

interface InviteFormProps {
  referralLink: string;
  translations: {
    emailPlaceholder: string;
    namePlaceholder: string;
    send: string;
    referralLink: string;
    copy: string;
    copied: string;
  };
}

export function InviteForm({ referralLink, translations: t }: InviteFormProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Invite a new client
        </h2>
        <div className="grid grid-cols-12 gap-3 mb-4">
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            className="col-span-5 px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-byzantine focus:border-transparent"
          />
          <input
            type="text"
            placeholder={t.namePlaceholder}
            className="col-span-4 px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-byzantine focus:border-transparent"
          />
          <button className="col-span-3 bg-byzantine hover:bg-byzantine-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            {t.send}
          </button>
        </div>
        <textarea
          placeholder="Add a personal message (optional)"
          rows={3}
          className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-byzantine focus:border-transparent resize-none"
        />
      </div>

      {/* Referral Link */}
      <div className="pt-4 border-t border-border-light">
        <p className="text-sm text-text-secondary mb-3">{t.referralLink}</p>
        <div className="flex gap-3">
          <div className="flex-1 px-4 py-3 bg-surface-secondary border border-border rounded-lg text-text-primary text-sm font-mono break-all">
            {referralLink}
          </div>
          <button
            onClick={handleCopyLink}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              copyFeedback
                ? "bg-green-500 text-white"
                : "bg-byzantine text-white hover:bg-byzantine-dark"
            }`}
          >
            {copyFeedback ? t.copied : t.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
