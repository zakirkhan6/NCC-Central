import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, LogOut, User, ChevronDown, Search, Menu } from 'lucide-react';
import { StatusBadge } from './UIComponents';

export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/cadets?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')
    : 'U';

  return (
    <header className="h-14 border-b border-[#DCE5EF] bg-white sticky top-0 z-20 px-4 flex items-center justify-between gap-4 shadow-sm">
      {/* Left: menu toggle + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-8 h-8 rounded-lg hover:bg-[#EAF0F8] flex items-center justify-center transition-colors"
        >
          <Menu className="w-4 h-4 text-[#607086]" />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-700 text-[#9BAEC0] uppercase tracking-wider hidden sm:block">NCC CENTRAL</span>
          <span className="text-[#DCE5EF] hidden sm:block">/</span>
          <span className="text-xs font-700 text-[#123B63]">
            {user?.role === 'ADMIN' ? 'Administrator Console' : user?.role === 'ANO' ? 'Officer Dashboard' : 'Cadet Portal'}
          </span>
        </div>
      </div>

      {/* Right: search, bell, user */}
      <div className="flex items-center gap-2">
        {/* Quick search */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-[#9BAEC0] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search cadets, events..."
            className="pl-8 pr-3 py-1.5 text-xs bg-[#F5F8FC] border border-[#DCE5EF] rounded-lg text-[#142238] placeholder-[#9BAEC0] focus:outline-none focus:ring-2 focus:ring-[#123B63]/10 focus:border-[#123B63] w-52 transition-all"
          />
        </form>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg hover:bg-[#EAF0F8] flex items-center justify-center transition-colors text-[#607086]">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C94A4A]" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#EAF0F8] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[#123B63] flex items-center justify-center font-black text-white text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-700 text-[#142238] leading-tight max-w-[120px] truncate">{user?.fullName || 'User'}</div>
              <div className="text-[10px] text-[#9BAEC0] font-500">{user?.role || 'CADET'}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#9BAEC0] transition-transform hidden sm:block ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-[#DCE5EF] rounded-xl shadow-xl py-1.5 z-50 fade-in">
              <div className="px-3.5 py-2.5 border-b border-[#DCE5EF]">
                <p className="text-xs font-700 text-[#142238] truncate">{user?.fullName}</p>
                <p className="text-[10px] text-[#9BAEC0] truncate mt-0.5">{user?.email}</p>
                <StatusBadge status={user?.role} text={user?.role} />
              </div>
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#142238] hover:bg-[#F5F8FC] transition-colors font-500"
              >
                <User className="w-3.5 h-3.5 text-[#123B63]" />
                My Profile
              </Link>
              <button
                onClick={() => { logout(); setShowDropdown(false); }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-[#C94A4A] hover:bg-[#FDE8E8] transition-colors border-t border-[#DCE5EF] mt-1 font-600"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
