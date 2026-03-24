"use client";

import { motion } from "framer-motion";
import type { WealthManagerProfile } from "@/types";

interface ProfileFormProps {
  profile: WealthManagerProfile;
  onChange: (field: keyof WealthManagerProfile, value: string) => void;
  onSave: () => void;
  saveMessage: string;
  translations: {
    profile: string;
    partnerSince: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    save: string;
  };
}

export function ProfileForm({
  profile,
  onChange,
  onSave,
  saveMessage,
  translations: t,
}: ProfileFormProps) {
  const formatPartnerSince = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const fields: {
    key: keyof WealthManagerProfile;
    label: string;
    type: string;
  }[] = [
    { key: "name", label: t.name, type: "text" },
    { key: "company", label: t.company, type: "text" },
    { key: "email", label: t.email, type: "email" },
    { key: "phone", label: t.phone, type: "tel" },
  ];

  return (
    <div className="glass-card p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          {t.profile}
        </h2>
        <p className="text-sm text-text-secondary">
          {t.partnerSince}: {formatPartnerSince(profile.partnerSince)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label
              htmlFor={`profile-${key}`}
              className="block text-sm font-medium text-text-primary mb-2"
            >
              {label}
            </label>
            <input
              id={`profile-${key}`}
              type={type}
              value={profile[key] as string}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-byzantine focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-light">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-byzantine hover:bg-byzantine-dark text-white font-semibold rounded-lg transition-colors"
        >
          {t.save}
        </button>
        {saveMessage && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-green-600 font-medium"
          >
            {saveMessage}
          </motion.span>
        )}
      </div>
    </div>
  );
}
