import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]',
    primary: 'bg-[#EAF1F8] text-[#12355B] border-[#C7D9ED]',
    success: 'bg-[#E8F5EE] text-[#1F6B45] border-[#B8DFC8]',
    warning: 'bg-[#FDF6E3] text-[#C58A00] border-[#F0DCA0]',
    danger: 'bg-[#FDE8E8] text-[#C94A4A] border-[#F0B8B8]',
    gold: 'bg-[#FDF6E3] text-[#9A7B1A] border-[#E8D48A] font-semibold',
    indigo: 'bg-[#EBF3FA] text-[#3478B5] border-[#BDCFE5]'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};
