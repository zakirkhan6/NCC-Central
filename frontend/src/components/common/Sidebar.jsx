import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, CheckSquare, Calendar, BookOpen, Award,
  FileCheck, Megaphone, FolderDown, BarChart3, Shield, Settings,
  UserCheck, User, Tent, ChevronLeft, ChevronRight, Bell
} from 'lucide-react';

export const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const role = user?.role || 'CADET';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'ANO', 'CADET'] },

    { header: 'MANAGEMENT', roles: ['ADMIN', 'ANO'] },
    { label: 'Cadets Directory', path: '/cadets', icon: Users, roles: ['ADMIN', 'ANO'] },
    { label: 'Officers / ANOs', path: '/users', icon: UserCheck, roles: ['ADMIN'] },

    { header: 'ACTIVITIES', roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Attendance', path: '/attendance', icon: CheckSquare, roles: ['ADMIN', 'ANO'] },
    { label: 'Parade Fall-In', path: '/parades', icon: Calendar, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Training', path: '/training', icon: BookOpen, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Events & Camps', path: '/events', icon: Tent, roles: ['ADMIN', 'ANO', 'CADET'] },

    { header: 'RECORDS', roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Achievements', path: '/achievements', icon: Award, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Certificates', path: '/certificates', icon: FileCheck, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Documents', path: '/documents', icon: FolderDown, roles: ['ADMIN', 'ANO', 'CADET'] },

    { header: 'COMMUNICATION', roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Announcements', path: '/announcements', icon: Megaphone, roles: ['ADMIN', 'ANO', 'CADET'] },

    { header: 'ANALYTICS', roles: ['ADMIN', 'ANO'] },
    { label: 'Reports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'ANO'] },

    { header: 'SYSTEM', roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'My Profile', path: '/profile', icon: User, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Audit Logs', path: '/audit-logs', icon: Shield, roles: ['ADMIN'] },
    { label: 'Settings', path: '/settings', icon: Settings, roles: ['ADMIN', 'ANO'] }
  ];

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 sidebar-transition z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ background: 'linear-gradient(180deg, #0B2742 0%, #123B63 60%, #1D5D8F 100%)' }}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-white/10 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#D9A514] flex items-center justify-center font-black text-[#0B2742] text-[11px] flex-shrink-0 shadow">
          NCC
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="font-black text-sm text-white tracking-tight leading-tight whitespace-nowrap">NCC CENTRAL</h2>
            <p className="text-[9px] text-[#D9A514] font-bold uppercase tracking-wider whitespace-nowrap">1 MAH BATTALION NCC</p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="ml-auto w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white/70" />
          </button>
        )}
      </div>

      {/* Collapsed toggle */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-auto mt-2 w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-white/70" />
        </button>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 sidebar-scrollbar">
        {navItems.map((item, idx) => {
          if (item.header) {
            if (!item.roles.includes(role)) return null;
            if (collapsed) return (
              <div key={idx} className="my-1.5 mx-2 border-t border-white/10" />
            );
            return (
              <div key={idx} className="pt-4 pb-1.5 px-3 text-[9px] font-800 text-white/40 uppercase tracking-widest">
                {item.header}
              </div>
            );
          }

          if (!item.roles.includes(role)) return null;

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg text-[12.5px] font-600 transition-all group ${
                  collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'px-3 py-2'
                } ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-[#D9A514]' : ''}`} strokeWidth={2} />
                  {!collapsed && <span className="leading-none">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/8">
            <div className="w-7 h-7 rounded-full bg-[#D9A514] flex items-center justify-center font-black text-[#0B2742] text-xs flex-shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-700 text-white truncate leading-tight">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-white/50 font-500 truncate">{user?.role || 'CADET'}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
