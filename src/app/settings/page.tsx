'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/context';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchProfile } from '@/lib/services';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { PayoutPreferences } from '@/components/settings/PayoutPreferences';
import { NotificationPreferences } from '@/components/settings/NotificationPreferences';
import type { WealthManagerProfile } from '@/types';

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const [saveMessage, setSaveMessage] = useState('');

  const { data: fetchedProfile } = useAsyncData(() => fetchProfile(), []);
  const [profile, setProfile] = useState<WealthManagerProfile | null>(null);

  // Use fetched profile as initial, but allow local edits
  const currentProfile = profile ?? fetchedProfile;

  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'byzantine_prime'>('bank_transfer');
  const [bankDetails, setBankDetails] = useState({ iban: '', bic: '', bankName: '' });

  // Sync fetched data once
  if (fetchedProfile && !profile) {
    setProfile(fetchedProfile);
    setPayoutMethod(fetchedProfile.payoutMethod);
    setBankDetails(fetchedProfile.bankDetails || { iban: '', bic: '', bankName: '' });
  }

  const handleProfileChange = (field: keyof WealthManagerProfile, value: string) => {
    if (!currentProfile) return;
    setProfile({ ...currentProfile, [field]: value } as WealthManagerProfile);
  };

  const handleSave = async () => {
    setSaveMessage('');
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveMessage(t.settings.saved);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (!currentProfile) return null;

  return (
    <div className="min-h-screen bg-surface-secondary p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{t.settings.title}</h1>
          <p className="text-text-secondary">{t.settings.subtitle}</p>
        </div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ProfileForm
            profile={currentProfile}
            onChange={handleProfileChange}
            onSave={handleSave}
            saveMessage={saveMessage}
            translations={t.settings}
          />
        </motion.div>

        {/* Payout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <PayoutPreferences
            payoutMethod={payoutMethod}
            onMethodChange={setPayoutMethod}
            bankDetails={bankDetails}
            onBankDetailsChange={(field, value) => setBankDetails(prev => ({ ...prev, [field]: value }))}
            translations={t.settings}
          />
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <NotificationPreferences />
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8 space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">{t.settings.language}</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['en', 'fr'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                  locale === lang
                    ? 'border-byzantine bg-byzantine-50 text-byzantine'
                    : 'border-border text-text-primary hover:border-byzantine-200'
                }`}
              >
                {lang === 'en' ? t.settings.english : t.settings.french}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Support */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-8 space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Support & Help</h2>
          <div className="space-y-4">
            <div className="p-4 bg-surface-secondary rounded-lg">
              <p className="text-sm text-text-muted mb-2">Support contact</p>
              <a href="mailto:support@byzantine.finance" className="text-byzantine hover:text-byzantine-dark font-semibold text-base transition-colors">
                support@byzantine.finance
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="p-4 border border-border rounded-lg hover:bg-surface-hover transition-colors group">
                <p className="font-medium text-text-primary mb-1 group-hover:text-byzantine transition-colors">Documentation</p>
                <p className="text-xs text-text-muted">View API & partner docs</p>
              </a>
              <a href="#" className="p-4 border border-border rounded-lg hover:bg-surface-hover transition-colors group">
                <p className="font-medium text-text-primary mb-1 group-hover:text-byzantine transition-colors">FAQ</p>
                <p className="text-xs text-text-muted">Common questions</p>
              </a>
            </div>
            <div className="pt-4 border-t border-border-light">
              <p className="text-sm text-text-muted mb-2">Your account manager</p>
              <p className="font-semibold text-text-primary">Gaia Ferrero Regis</p>
              <a href="mailto:gaia@byzantine.finance" className="text-byzantine hover:text-byzantine-dark text-sm transition-colors">
                gaia@byzantine.finance
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
