'use client';

import { usePathname } from 'next/navigation';
import { Bell, ChevronDown } from 'lucide-react';
import { useI18n } from '@/i18n/context';

const pageLabels: Record<string, string> = {
  '/': 'nav.overview',
  '/clients': 'nav.clients',
  '/commissions': 'nav.commissions',
  '/fees': 'nav.fees',
  '/pipeline': 'nav.pipeline',
  '/settings': 'nav.settings',
};

export function Header() {
  const pathname = usePathname();
  const { t } = useI18n();

  const labelKey = pageLabels[pathname] || 'nav.overview';
  const [section, key] = labelKey.split('.');
  const pageTitle = (t as any)[section]?.[key] || 'Overview';

  // Mock AUM value - in real app this would come from context/state
  const totalAUM = '€32.5M';

  return (
    <header className="border-b border-[var(--color-border)] bg-white px-8 py-4 flex items-center justify-between">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A0918]">{pageTitle}</h1>
      </div>

      {/* Right: AUM Badge, Notifications, User */}
      <div className="flex items-center gap-6">
        {/* AUM Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#F9F0F7] rounded-lg border border-[#E0B3D9]">
          <span className="text-xs font-medium text-[#6B5A70]">Total AUM</span>
          <span className="text-sm font-bold text-[#702963]">{totalAUM}</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-[#6B5A70] hover:bg-[#F3EFF5] rounded-lg transition-all">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full" />
        </button>

        {/* User Dropdown */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#F3EFF5] rounded-lg transition-all">
          <div className="w-8 h-8 bg-gradient-to-br from-[#702963] to-[#5A1F4F] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">J</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#1A0918]">John Doe</p>
            <p className="text-xs text-[#9B8FA0]">Wealth Manager</p>
          </div>
          <ChevronDown size={16} className="text-[#6B5A70]" />
        </button>
      </div>
    </header>
  );
}
