import React from 'react';

export const StatCard = ({ title, value, icon: Icon, change, trend = 'up', subtitle, color = 'navy' }) => {
  const colorStyles = {
    navy: { icon: 'bg-[#EAF1F8] text-[#12355B]', accent: 'border-l-[#12355B]' },
    green: { icon: 'bg-[#E8F5EE] text-[#1F6B45]', accent: 'border-l-[#1F6B45]' },
    gold: { icon: 'bg-[#FDF6E3] text-[#D4A72C]', accent: 'border-l-[#D4A72C]' },
    blue: { icon: 'bg-[#EBF3FA] text-[#3478B5]', accent: 'border-l-[#3478B5]' },
    // Keep old aliases for backward compat
    amber: { icon: 'bg-[#FDF6E3] text-[#D4A72C]', accent: 'border-l-[#D4A72C]' },
    emerald: { icon: 'bg-[#E8F5EE] text-[#1F6B45]', accent: 'border-l-[#1F6B45]' },
    indigo: { icon: 'bg-[#EBF3FA] text-[#3478B5]', accent: 'border-l-[#3478B5]' },
    rose: { icon: 'bg-[#FDE8E8] text-[#C94A4A]', accent: 'border-l-[#C94A4A]' }
  };

  const style = colorStyles[color] || colorStyles.navy;

  return (
    <div className={`p-6 rounded-2xl bg-white border border-[#E2E8F0] border-l-4 ${style.accent} transition-all hover:shadow-md shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${style.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-[#172033]">{value}</span>
        {change && (
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-[#2E7D5B]' : 'text-[#C94A4A]'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-2 text-xs text-[#64748B]">{subtitle}</p>}
    </div>
  );
};
