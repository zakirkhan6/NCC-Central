import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F5F8FC] gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#123B63] flex items-center justify-center font-black text-white text-base shadow-md">
          NCC
        </div>
        <div className="flex items-center gap-2 text-[#607086]">
          <Loader2 className="w-4 h-4 animate-spin text-[#123B63]" />
          <span className="text-sm font-600">Initializing NCC Central...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless mobileOpen */}
      <div className={`
        fixed lg:relative z-50 lg:z-auto h-screen lg:h-auto
        transition-transform lg:transition-none
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        <footer className="py-2 px-6 border-t border-[#DCE5EF] bg-white">
          <p className="text-[10px] text-[#9BAEC0] text-center font-500">
            NCC Central v1.0 — 1 MAH Battalion NCC, Mumbai © 2026. Official Platform.
          </p>
        </footer>
      </div>
    </div>
  );
};
