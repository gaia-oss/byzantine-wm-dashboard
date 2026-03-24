'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Coins, Percent, GitPullRequest, Settings } from 'lucide-react';
import { useI18n } from '@/i18n/context';

const navItems = [
  { href: '/', label: 'nav.overview', icon: LayoutDashboard },
  { href: '/clients', label: 'nav.clients', icon: Users },
  { href: '/commissions', label: 'nav.commissions', icon: Coins },
  { href: '/fees', label: 'nav.fees', icon: Percent },
  { href: '/pipeline', label: 'nav.pipeline', icon: GitPullRequest },
  { href: '/settings', label: 'nav.settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();

  const getNavLabel = (labelKey: string) => {
    const [section, key] = labelKey.split('.');
    return (t as any)[section]?.[key] || labelKey;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-[var(--color-border)] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#702963] to-[#5A1F4F] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-bold text-lg text-[#702963]">byzantine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all relative ${
                    isActive
                      ? 'bg-[#F9F0F7] text-[#702963]'
                      : 'text-[#6B5A70] hover:bg-[#F3EFF5]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#702963] rounded-r-sm" />
                  )}
                  <Icon size={18} />
                  <span className="text-sm font-medium">
                    {getNavLabel(item.label)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--color-border)] px-4 py-6 space-y-4">
        {/* Partner Badge */}
        <div className="space-y-3">
          <div className="bg-[#F9F0F7] rounded-lg p-3 border border-[#E0B3D9]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-[#702963] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="text-xs font-semibold text-[#702963]">Partner Program</span>
            </div>
            <p className="text-xs text-[#6B5A70] leading-tight mb-2">
              Insured by Aon
            </p>
            <p className="text-xs text-[#6B5A70] leading-tight">
              Supervised by Keyrock — DASP/AMF
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setLocale('en')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              locale === 'en'
                ? 'bg-[#702963] text-white'
                : 'bg-[#F3EFF5] text-[#702963] hover:bg-[#E8E0EC]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLocale('fr')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              locale === 'fr'
                ? 'bg-[#702963] text-white'
                : 'bg-[#F3EFF5] text-[#702963] hover:bg-[#E8E0EC]'
            }`}
          >
            FR
          </button>
        </div>
      </div>
    </aside>
  );
}
