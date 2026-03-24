'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AumDataPoint } from '@/types';
import { fetchAumHistory } from '@/lib/services';
import { useI18n } from '@/i18n/context';
import { SkeletonChart } from '@/components/ui/Skeleton';

interface AumChartProps {
  data?: AumDataPoint[];
}

type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'All';

export function AumChart({ data: initialData }: AumChartProps) {
  const { t } = useI18n();
  const [timeRange, setTimeRange] = useState<TimeRange>('All');
  const [loading, setLoading] = useState(!initialData);
  const [data, setData] = useState(initialData || []);

  const ranges: { label: string; value: TimeRange; days: number | null }[] = [
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '6M', value: '6M', days: 180 },
    { label: '1Y', value: '1Y', days: 365 },
    { label: t.overview.all, value: 'All', days: null },
  ];

  // Load data if not provided
  if (!initialData && loading) {
    fetchAumHistory()
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (timeRange === 'All' || !data.length) return data;

    const range = ranges.find((r) => r.value === timeRange);
    if (!range || !range.days) return data;

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - range.days * 24 * 60 * 60 * 1000);

    return data.filter((point) => new Date(point.date) >= cutoffDate);
  }, [data, timeRange, ranges]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <SkeletonChart />;
  }

  if (!filteredData.length) {
    return (
      <div className="glass-card p-8 flex items-center justify-center h-80">
        <p className="text-[#9B8FA0]">{t.common.noData}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#1A0918]">{t.overview.aumOverTime}</h3>
        <div className="flex gap-2">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === range.value
                  ? 'bg-[#702963] text-white'
                  : 'bg-[#F3EFF5] text-[#6B5A70] hover:bg-[#E8E0EC]'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#702963" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#702963" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E0EC" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#9B8FA0"
            style={{ fontSize: '12px' }}
            tickFormatter={formatDate}
            tick={{ fill: '#9B8FA0' }}
          />
          <YAxis
            stroke="#9B8FA0"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`}
            tick={{ fill: '#9B8FA0' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A0918',
              border: '1px solid #702963',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#E8E0EC' }}
            formatter={(value) => [formatCurrency(Number(value)), 'AUM']}
            labelFormatter={(label) =>
              new Date(String(label)).toLocaleDateString('fr-FR', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            }
          />
          <Line
            type="monotone"
            dataKey="aum"
            stroke="#702963"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
            fill="url(#colorAum)"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
