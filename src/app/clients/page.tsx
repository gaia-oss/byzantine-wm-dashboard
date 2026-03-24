'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/context';
import { FunnelPills } from '@/components/ui/FunnelPills';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { ClientTable, type ClientWithCommission } from '@/components/clients/ClientTable';
import { ClientFilters } from '@/components/clients/ClientFilters';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchClients, fetchClientFunnel } from '@/lib/services';
import { getTierBps } from '@/lib/format';

type SortField = 'name' | 'aum' | 'tier' | 'commission' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

export default function ClientsPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'individual' | 'business'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [funnelFilter, setFunnelFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data, loading } = useAsyncData(
    () =>
      Promise.all([fetchClients(), fetchClientFunnel()]).then(([clients, funnel]) => {
        const withCommission: ClientWithCommission[] = clients.map(client => {
          const tierBps = getTierBps(client.aum, client.commissionTier);
          return {
            ...client,
            quarterlyCommission: (client.aum * tierBps) / 10_000,
            avgQuarterlyAum: client.aum,
          };
        });
        return { clients: withCommission, funnel };
      }),
    []
  );

  const clients = data?.clients ?? [];
  const funnel = data?.funnel ?? null;

  const handleFunnelChange = useCallback((stage: string | null) => setFunnelFilter(stage), []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...clients];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term));
    }
    if (typeFilter !== 'all') result = result.filter(c => c.type === typeFilter);
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    if (funnelFilter) {
      const map: Record<string, string[]> = {
        total: ['invited', 'kyc_pending', 'kyc_approved', 'first_deposit', 'active', 'cancelled'],
        invited: ['invited'], kycPending: ['kyc_pending'], kycApproved: ['kyc_approved'],
        firstDeposit: ['first_deposit'], active: ['active'], cancelled: ['cancelled'],
      };
      result = result.filter(c => map[funnelFilter]?.includes(c.status));
    }

    result.sort((a, b) => {
      const aVal = sortField === 'commission' ? a.quarterlyCommission : sortField === 'tier' ? a.commissionTier : (a as any)[sortField];
      const bVal = sortField === 'commission' ? b.quarterlyCommission : sortField === 'tier' ? b.commissionTier : (b as any)[sortField];
      if (typeof aVal === 'string') return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [clients, searchTerm, typeFilter, statusFilter, funnelFilter, sortField, sortDirection]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1A0918] mb-2">{t.clients.title}</h1>
          <p className="text-[#6B5A70]">{t.clients.subtitle}</p>
        </div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1A0918] mb-2">{t.clients.title}</h1>
        <p className="text-[#6B5A70]">{t.clients.subtitle}</p>
      </div>

      {funnel && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <FunnelPills data={funnel} onFilterChange={handleFunnelChange} />
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
        <ClientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          translations={{
            search: t.clients.search,
            type: t.clients.type,
            all: t.clients.all,
            individuals: t.clients.individuals,
            businesses: t.clients.businesses,
            status: t.clients.status,
            allStatuses: t.clients.allStatuses,
            funnel: t.funnel,
          }}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <ClientTable
          clients={filtered}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          translations={{
            name: t.clients.name,
            type: t.clients.type,
            aum: t.clients.aum,
            lastActivity: t.clients.lastActivity,
            noClients: t.clients.noClients,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
