import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, AlertTriangle, Info, CheckCircle2, Search, ChevronDown, Loader2 } from 'lucide-react';

// ─── PageHeader ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, children, icon: Icon }) => (
  <div className="page-header">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-[#EAF0F8] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#123B63]" />
        </div>
      )}
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
    {children && <div className="flex items-center gap-2">{children}</div>}
  </div>
);

// ─── StatCard ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, icon: Icon, color = 'navy', trend, loading = false }) => {
  const colorMap = {
    navy: { bg: '#EAF0F8', text: '#123B63', icon: '#123B63' },
    blue: { bg: '#E6EFF8', text: '#1D5D8F', icon: '#1D5D8F' },
    gold: { bg: '#FEF7DC', text: '#8B6200', icon: '#D9A514' },
    success: { bg: '#E8F5EE', text: '#21865B', icon: '#21865B' },
    danger: { bg: '#FDE8E8', text: '#C94A4A', icon: '#C94A4A' },
    warning: { bg: '#FFF7E0', text: '#C88A00', icon: '#C88A00' },
  };
  const c = colorMap[color] || colorMap.navy;

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-700 uppercase tracking-wider text-[#607086] mb-1">{label}</p>
          {loading ? (
            <div className="skeleton h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-800 leading-none mt-1" style={{ color: c.text }}>{value ?? '—'}</p>
          )}
          {trend && !loading && (
            <p className="text-[11px] mt-1.5 font-600" style={{ color: trend.positive ? '#21865B' : '#C94A4A' }}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3" style={{ backgroundColor: c.bg }}>
            <Icon className="w-5 h-5" style={{ color: c.icon }} />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export const StatusBadge = ({ status, text }) => {
  const display = text || status || 'Unknown';
  const s = (status || '').toUpperCase();
  let cls = 'badge-grey';
  if (['ACTIVE', 'PRESENT', 'ISSUED', 'COMPLETED', 'VERIFIED', 'AUTHENTIC'].includes(s)) cls = 'badge-success';
  else if (['INACTIVE', 'ABSENT', 'REVOKED', 'CANCELLED'].includes(s)) cls = 'badge-danger';
  else if (['LATE', 'LEAVE', 'CAMP', 'PENDING', 'IN SESSION'].includes(s)) cls = 'badge-warning';
  else if (['UPCOMING', 'SCHEDULED', 'ENROLLING', 'OPEN'].includes(s)) cls = 'badge-info';
  else if (['URGENT', 'IMPORTANT'].includes(s)) cls = 'badge-warning';
  else if (s === 'ADMIN' || s === 'OFFICER' || s === 'ANO') cls = 'badge-navy';
  return <span className={`badge ${cls}`}>{display}</span>;
};

// ─── SearchBar ───────────────────────────────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9BAEC0]" />
    <input
      className="ncc-input pl-9 text-xs"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

// ─── FilterSelect ────────────────────────────────────────────────────────────
export const FilterSelect = ({ value, onChange, options, placeholder = 'All', className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      className="ncc-input text-xs pr-8 appearance-none"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
          {typeof opt === 'string' ? opt : opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9BAEC0] pointer-events-none" />
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
export const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#DCE5EF]">
      <span className="text-xs text-[#607086]">
        Showing <strong>{start}–{end}</strong> of <strong>{totalItems}</strong>
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-secondary px-2 py-1.5 text-xs disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let page = i + 1;
          if (totalPages > 5 && currentPage > 3) {
            page = currentPage - 2 + i;
            if (page > totalPages) page = totalPages - (4 - i);
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-2.5 py-1 text-xs font-600 rounded-lg border transition-colors ${
                page === currentPage
                  ? 'bg-[#123B63] text-white border-[#123B63]'
                  : 'bg-white text-[#607086] border-[#DCE5EF] hover:bg-[#EAF0F8]'
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-secondary px-2 py-1.5 text-xs disabled:opacity-40"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── LoadingState ─────────────────────────────────────────────────────────────
export const LoadingState = ({ rows = 5, cols = 4, message }) => {
  if (message) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#123B63]" />
        <p className="text-sm font-600 text-[#607086]">{message}</p>
      </div>
    );
  }
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array.from({ length: cols }).map((__, j) => (
            <div key={j} className={`skeleton h-8 rounded flex-1 ${j === 0 ? 'max-w-[60px]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── EmptyState ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-[#EAF0F8] flex items-center justify-center">
        <Icon className="w-7 h-7 text-[#9BAEC0]" />
      </div>
    )}
    <div>
      <h3 className="text-sm font-700 text-[#142238]">{title || 'No data found'}</h3>
      {description && <p className="text-xs text-[#607086] mt-1 max-w-xs mx-auto">{description}</p>}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

// ─── ErrorState ───────────────────────────────────────────────────────────────
export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
    <div className="w-14 h-14 rounded-2xl bg-[#FDE8E8] flex items-center justify-center">
      <AlertTriangle className="w-7 h-7 text-[#C94A4A]" />
    </div>
    <div>
      <h3 className="text-sm font-700 text-[#142238]">Something went wrong</h3>
      <p className="text-xs text-[#607086] mt-1 max-w-xs mx-auto">{message || 'Unable to load data. Please try again.'}</p>
    </div>
    {onRetry && (
      <button className="btn-secondary text-xs" onClick={onRetry}>Try Again</button>
    )}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeMap = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0B2742]/50 backdrop-blur-sm" />
      <div
        className={`relative w-full ${sizeMap[size]} bg-white rounded-2xl shadow-2xl fade-in max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#DCE5EF]">
          <h3 className="text-base font-700 text-[#142238]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#EAF0F8] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[#607086]" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="p-5 border-t border-[#DCE5EF] flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
};

// ─── ConfirmationDialog ───────────────────────────────────────────────────────
export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false, loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} size="sm">
    <div className="space-y-4">
      <p className="text-sm text-[#607086]">{message || 'Are you sure you want to proceed?'}</p>
      <div className="flex justify-end gap-2">
        <button className="btn-secondary text-xs" onClick={onClose} disabled={loading}>Cancel</button>
        <button
          className={`text-xs font-600 px-4 py-2 rounded-lg text-white transition-colors inline-flex items-center gap-2 ${danger ? 'bg-[#C94A4A] hover:bg-[#A93A3A]' : 'bg-[#123B63] hover:bg-[#0B2742]'}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          {confirmText}
        </button>
      </div>
    </div>
  </Modal>
);

// ─── FormField ────────────────────────────────────────────────────────────────
export const FormField = ({ label, required, error, children, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    {label && (
      <label className="text-xs font-600 text-[#142238]">
        {label} {required && <span className="text-[#C94A4A]">*</span>}
      </label>
    )}
    {children}
    {error && <p className="text-[11px] text-[#C94A4A] flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}
  </div>
);

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="border-b border-[#DCE5EF] flex gap-0 overflow-x-auto">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-4 py-2.5 text-xs font-600 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
          activeTab === tab.id
            ? 'border-[#123B63] text-[#123B63]'
            : 'border-transparent text-[#607086] hover:text-[#142238] hover:border-[#DCE5EF]'
        }`}
      >
        {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
        {tab.label}
        {tab.count !== undefined && (
          <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-700 ${
            activeTab === tab.id ? 'bg-[#123B63] text-white' : 'bg-[#EAF0F8] text-[#607086]'
          }`}>{tab.count}</span>
        )}
      </button>
    ))}
  </div>
);

// ─── DataTable ────────────────────────────────────────────────────────────────
export const DataTable = ({ columns, data, loading, emptyState, onRowClick }) => {
  if (loading) return <LoadingState rows={5} cols={columns.length} />;
  if (!data || data.length === 0) {
    return emptyState || <EmptyState title="No records found" />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="ncc-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }} className={col.className || ''}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {columns.map(col => (
                <td key={col.key} className={col.cellClassName || ''}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── InfoAlert ────────────────────────────────────────────────────────────────
export const InfoAlert = ({ type = 'info', message, className = '' }) => {
  const styles = {
    info: { bg: '#E8F0F8', border: '#A5C2DF', text: '#1D5D8F', Icon: Info },
    success: { bg: '#E8F5EE', border: '#7BBFA0', text: '#21865B', Icon: CheckCircle2 },
    warning: { bg: '#FFF7E0', border: '#E8C668', text: '#C88A00', Icon: AlertTriangle },
    danger: { bg: '#FDE8E8', border: '#E8A0A0', text: '#C94A4A', Icon: AlertTriangle },
  };
  const s = styles[type] || styles.info;
  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs font-500 ${className}`} style={{ background: s.bg, borderColor: s.border, color: s.text }}>
      <s.Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default {
  PageHeader, StatCard, StatusBadge, SearchBar, FilterSelect, Pagination,
  LoadingState, EmptyState, ErrorState, Modal, ConfirmationDialog,
  FormField, Tabs, DataTable, InfoAlert
};
