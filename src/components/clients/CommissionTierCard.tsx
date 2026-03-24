"use client";

interface CommissionTierCardProps {
  commissionTier: number;
}

const TIER_DATA: Record<
  number,
  { year1: number; year2: number; year3: number }
> = {
  1: { year1: 28, year2: 12, year3: 10 },
  2: { year1: 28, year2: 12, year3: 10 },
  3: { year1: 36, year2: 16, year3: 12 },
  4: { year1: 40, year2: 20, year3: 15 },
};

export function CommissionTierCard({
  commissionTier,
}: CommissionTierCardProps) {
  const tier = TIER_DATA[commissionTier] || TIER_DATA[1];

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-[#1A0918] mb-6">
        Commission Structure
      </h3>

      <div className="space-y-4">
        <p className="text-[#6B5A70]">
          Year {commissionTier} — {tier.year1} bps. Steps to {tier.year2} bps in
          8 months
        </p>

        {/* Visual Timeline */}
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center">
            <div className="flex-1 h-8 bg-[#702963] rounded-l-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Year 1</span>
            </div>
            <div className="px-2 text-[#6B5A70] font-medium text-sm">→</div>
            <div className="flex-1 h-8 bg-[#D4A5D4] rounded-lg flex items-center justify-center">
              <span className="text-[#1A0918] font-bold text-sm">Year 2</span>
            </div>
            <div className="px-2 text-[#6B5A70] font-medium text-sm">→</div>
            <div className="flex-1 h-8 bg-[#E8D4E8] rounded-r-lg flex items-center justify-center">
              <span className="text-[#1A0918] font-bold text-sm">Year 3</span>
            </div>
          </div>
        </div>

        {/* Tier Details */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Year 1", bps: tier.year1 },
            { label: "Year 2", bps: tier.year2 },
            { label: "Year 3+", bps: tier.year3 },
          ].map(({ label, bps }) => (
            <div
              key={label}
              className="text-center p-4 bg-[#F3EFF5] rounded-lg"
            >
              <p className="text-sm text-[#6B5A70] mb-2">{label}</p>
              <p className="text-2xl font-bold text-[#702963]">{bps} bps</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
