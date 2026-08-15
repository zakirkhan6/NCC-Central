import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, LogOut, User, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';

export const Navbar = ({ currentTitle = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'gold';
      case 'ANO': return 'success';
      default: return 'primary';
    }
  };

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-white sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-[#172033] flex items-center gap-2">
          <span className="text-[#12355B]">NCC Central</span>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#64748B] font-medium">{currentTitle}</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cadet reg no, parade, event..."
            className="pl-9 pr-4 py-1.5 text-xs bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B] w-64 transition-all"
          />
        </div>

        {/* Notification bell */}
        <button className="relative p-2 text-[#64748B] hover:text-[#12355B] rounded-lg hover:bg-[#F1F5F9] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C94A4A] animate-pulse"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
              alt="Avatar"
              className="w-8 h-8 rounded-lg object-cover border border-[#E2E8F0]"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-[#172033] flex items-center gap-1.5">
                {user?.fullName}
                <Badge variant={getRoleBadgeVariant(user?.role)}>{user?.role}</Badge>
              </div>
              <div className="text-[10px] text-[#94A3B8]">{user?.email}</div>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E2E8F0] rounded-xl shadow-lg shadow-black/8 py-2 z-50 animate-in">
              <div className="px-4 py-2 border-b border-[#E2E8F0]">
                <p className="text-xs font-semibold text-[#172033]">{user?.fullName}</p>
                <p className="text-[10px] text-[#94A3B8]">{user?.role} Account</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="w-full text-left px-4 py-2 text-xs text-[#172033] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors font-medium"
              >
                <User className="w-4 h-4 text-[#12355B]" />
                My Official Profile
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-[#C94A4A] hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-[#E2E8F0] mt-1"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
