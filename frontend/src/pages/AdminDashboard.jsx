import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { Users, CheckSquare, Calendar, Award, ShieldAlert, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/reports/summary');
        if (res.data && res.data.success) {
          setSummary(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="text-[#12355B] font-bold text-sm">Loading Battalion Intelligence...</div>;

  const chartData = summary?.monthlyTrend || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#12355B] uppercase tracking-widest">COMMAND & ADMINISTRATION</span>
          <h2 className="text-2xl font-black text-[#172033]">Battalion Central Operations</h2>
          <p className="text-xs text-[#64748B] mt-1">1 MAH BATTALION NCC • Overall Unit Health & Compliance Monitor</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Cadets" value={summary?.metrics?.totalCadets || 0} icon={Users} color="amber" subtitle="Active registered unit members" />
        <StatCard title="Overall Attendance" value={`${summary?.metrics?.attendancePercentage || 0}%`} icon={CheckSquare} color="emerald" subtitle="Unit attendance compliance rate" />
        <StatCard title="Upcoming Events" value={summary?.metrics?.totalEvents || 0} icon={Calendar} color="indigo" subtitle="Camps & social drives" />
        <StatCard title="Certificates Issued" value={summary?.metrics?.totalCertificatesIssued || 0} icon={Award} color="rose" subtitle="Verified B & C Certificates" />
      </div>

      {/* Analytics Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
          <h3 className="text-sm font-bold text-[#172033] mb-6 flex items-center justify-between">
            <span>Attendance Trend Analytics</span>
            <span className="text-xs font-normal text-[#94A3B8]">Monthly %</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="percentage" fill="#12355B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
          <h3 className="text-sm font-bold text-[#172033] mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#12355B]" />
            Recent Operations Log
          </h3>
          <div className="space-y-4 text-xs">
            {summary?.recentActivities?.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between font-semibold text-[#172033]">
                  <span>{log.user}</span>
                  <span className="text-[10px] text-[#12355B] font-mono">{log.action}</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">{log.details}</p>
                <div className="text-[9px] text-[#94A3B8] mt-1">{new Date(log.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
