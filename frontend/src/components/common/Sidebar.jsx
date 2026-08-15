import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Calendar,
  BookOpen,
  Award,
  FileCheck,
  Megaphone,
  FolderDown,
  BarChart3,
  Shield,
  Settings,
  UserCheck,
  User
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'CADET';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'ANO', 'CADET'] },

    // MANAGEMENT (Officers & Admins only)
    { header: 'MANAGEMENT', roles: ['ADMIN', 'ANO'] },
    { label: 'Cadets Directory', path: '/cadets', icon: Users, roles: ['ADMIN', 'ANO'] },
    { label: 'Officers / ANOs', path: '/users', icon: UserCheck, roles: ['ADMIN'] },

    // ACTIVITIES
    { header: 'ACTIVITIES', roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Attendance Marking', path: '/attendance', icon: CheckSquare, roles: ['ADMIN', 'ANO'] },
    { label: 'Parade Fallin', path: '/parades', icon: Calendar, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Training Modules', path: '/training', icon: BookOpen, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Events & Camps', path: '/events', icon: Calendar, roles: ['ADMIN', 'ANO', 'CADET'] },

    // RECORDS
    { header: 'RECORDS', roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Achievements', path: '/achievements', icon: Award, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Certificates', path: '/certificates', icon: FileCheck, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Document Library', path: '/documents', icon: FolderDown, roles: ['ADMIN', 'ANO', 'CADET'] },

    // COMMUNICATION
    { header: 'COMMUNICATION', roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Announcements', path: '/announcements', icon: Megaphone, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Reports & Analytics', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'ANO'] },

    // ACCOUNT & SYSTEM
    { header: 'ACCOUNT & SYSTEM', roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'My Profile', path: '/profile', icon: User, roles: ['ADMIN', 'ANO', 'CADET'] },
    { label: 'Audit Logs', path: '/audit-logs', icon: Shield, roles: ['ADMIN'] },
    { label: 'System Settings', path: '/settings', icon: Settings, roles: ['ADMIN', 'ANO'] }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#CBD5E1] flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-[#E2E8F0] flex items-center gap-3 bg-white">
        <div className="w-9 h-9 rounded-xl bg-[#12355B] flex items-center justify-center font-black text-white text-[12px] shadow-md">
          NCC
        </div>
        <div>
          <h2 className="font-black text-sm text-[#0F172A] tracking-tight leading-tight">NCC CENTRAL</h2>
          <p className="text-[10px] text-[#1F6B45] font-extrabold uppercase tracking-wider">1 MAH BATTALION NCC</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item, idx) => {
          if (item.header) {
            if (!item.roles.includes(role)) return null;
            return (
              <div key={idx} className="pt-5 pb-2 px-3 text-[11px] font-black text-[#475569] uppercase tracking-wider">
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
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  isActive
                    ? 'bg-[#EAF1F8] text-[#12355B] shadow-sm border-l-4 border-[#12355B]'
                    : 'text-[#0F172A] hover:text-[#12355B] hover:bg-[#F1F5F9]'
                }`
              }
            >
              <Icon className="w-[19px] h-[19px] shrink-0" strokeWidth={2.2} />
              <span className="leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Footer info */}
      <div className="p-4 border-t border-[#E2E8F0] text-[11px] text-[#475569] text-center font-bold bg-[#F8FAFC]">
        NCC Central v1.0.0 &copy; 2026
      </div>
    </aside>
  );
};
