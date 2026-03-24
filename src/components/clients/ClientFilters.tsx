'use client';

import Link from 'next/link';
import { Search, Download, Plus } from 'lucide-react';

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: 'all' | 'individual' | 'business';
  onTypeChange: (value: 'all' | 'individual' | 'business') => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  translations: {
    search: string;
    type: string;
    all: string;
    individuals: string;
    businesses: string;
    status: string;
    allStatuses: string;
    funnel: {
      invited: string;
      kycPending: string;
      kycApproved: string;
      firstDeposit: string;
      active: string;
      cancelled: string;
    };
  };
}

export function ClientFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  translations: t,
}: ClientFiltersProps) {
  return (
    <div className="glass-card p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-[#9B8FA0]" size={18} />
        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#F8F6FA] border border-[#E8E0EC] rounded-lg text-[#1A0918] placeholder-[#9B8FA0] focus:outline-none focus:border-[#702963] focus:ring-1 focus:ring-[#702963]"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#6B5A70]">{t.type}:</label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value as 'all' | 'individual' | 'business')}
            className="px-3 py-2 bg-[#F8F6FA] border border-[#E8E0EC] rounded-lg text-sm text-[#1A0918] focus:outline-none focus:border-[#702963]"
          >
            <option value="all">{t.all}</option>
            <option value="individual">{t.individuals}</option>
            <option value="business">{t.businesses}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-[#6B5A70]">{t.status}:</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 bg-[#F8F6FA] border border-[#E8E0EC] rounded-lg text-sm text-[#1A0918] focus:outline-none focus:border-[#702963]"
          >
            <option value="all">{t.allStatuses}</option>
            <option value="invited">{t.funnel.invited}</option>
            <option value="kyc_pending">{t.funnel.kycPending}</option>
            <option value="kyc_approved">{t.funnel.kycApproved}</option>
            <option value="first_deposit">{t.funnel.firstDeposit}</option>
            <option value="active">{t.funnel.active}</option>
            <option value="cancelled">{t.funnel.cancelled}</option>
          </select>
        </div>

        <div className="ml-auto flex gap-3">
          <Link
            href="/pipeline"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#702963] text-white rounded-lg font-medium hover:bg-[#5A1F4F] transition-colors"
          >
            <Plus size={18} />
            Invite client
          </Link>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#E8E0EC] text-[#1A0918] rounded-lg font-medium hover:bg-[#F8F6FA] transition-colors">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
