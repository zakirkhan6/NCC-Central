import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Users, CheckSquare, Calendar, Award, FileCheck, Megaphone,
  Shield, ArrowRight, RefreshCw, Clock
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { StatCard, EmptyState, LoadingState, PageHeader } from '../components/common/UIComponents';

const PIE_COLORS = ['#123B63', '#1D5D8F', '#D9A514', '#21865B', '#C94A4A', '#607086'];

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get('/reports/summary');
      if (res.data?.success) setSummary(res.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  const metrics = summary?.overview || {};
  const attendanceTrend = summary?.attendanceTrend || [];
  const companyDistribution = summary?.companyDistribution || [];
  const rankDistribution = summary?.rankDistribution || [];
  const recentActivities = summary?.recentActivities || [];

  const statCards = [
    { label: 'Total Cadets', value: loading ? null : metrics.totalCadets, icon: Users, color: 'navy' },
    { label: 'Active Cadets', value: loading ? null : metrics.activeCadets, icon: CheckSquare, color: 'success' },
    { label: 'Attendance Rate', value: loading ? null : `${metrics.attendanceRate ?? 0}%`, icon: Calendar, color: 'blue' },
    { label: 'Events', value: loading ? null : metrics.totalEvents, icon: Megaphone, color: 'gold' },
    { label: 'Certificates', value: loading ? null : metrics.totalCertificatesIssued, icon: FileCheck, color: 'navy' },
    { label: 'Achievements', value: loading ? null : metrics.totalAchievements, icon: Award, color: 'success' },
    { label: 'Parades', value: loading ? null : metrics.totalParades, icon: Calendar, color: 'blue' },
    { label: 'Announcements', value: loading ? null : metrics.totalAnnouncements, icon: Megaphone, color: 'gold' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#DCE5EF] shadow-sm flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-800 text-[#123B63] uppercase tracking-widest bg-[#EAF0F8] px-2.5 py-1 rounded-full border border-[#B8D0E8]">
            COMMAND & ADMINISTRATION
          </span>
          <h2 className="text-2xl font-black text-[#142238] mt-2 tracking-tight">Battalion Central Operations</h2>
          <p className="text-xs text-[#607086] mt-1 font-500">
            1 MAH BATTALION NCC • Unit Health & Compliance Monitor — {user?.fullName}
          </p>
        </div>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="btn-secondary text-xs gap-1.5 flex-shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} label={card.label} value={card.value} icon={card.icon} color={card.color} loading={loading} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 ncc-card p-5">
          <h3 className="text-sm font-700 text-[#142238] mb-4 flex items-center justify-between">
            <span>Attendance Trend</span>
            <span className="text-xs font-500 text-[#9BAEC0]">Monthly %</span>
          </h3>
          {loading ? (
            <div className="h-52"><LoadingState rows={3} cols={4} /></div>
          ) : attendanceTrend.length === 0 ? (
            <EmptyState icon={Calendar} title="No attendance data yet" description="Mark attendance to see trends" />
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE5EF" vertical={false} />
                  <XAxis dataKey="month" stroke="#9BAEC0" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9BAEC0" tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderColor: '#DCE5EF', borderRadius: '10px', fontSize: 11 }}
                    formatter={v => [`${v}%`, 'Attendance']}
                  />
                  <Bar dataKey="percentage" fill="#123B63" radius={[5, 5, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Company Distribution */}
        <div className="ncc-card p-5">
          <h3 className="text-sm font-700 text-[#142238] mb-4">Company Distribution</h3>
          {loading ? (
            <div className="h-52"><LoadingState rows={3} cols={2} /></div>
          ) : companyDistribution.length === 0 ? (
            <EmptyState icon={Users} title="No company data" />
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="cadets"
                    nameKey="name"
                    paddingAngle={2}
                  >
                    {companyDistribution.map((entry, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #DCE5EF' }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Activity Log + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2 ncc-card p-5">
          <h3 className="text-sm font-700 text-[#142238] mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#123B63]" />
            Recent Operations Log
          </h3>
          {loading ? (
            <LoadingState rows={4} cols={3} />
          ) : recentActivities.length === 0 ? (
            <EmptyState icon={Clock} title="No activity logged yet" description="Activity will appear as operations are performed" />
          ) : (
            <div className="space-y-2">
              {recentActivities.map((log, i) => (
                <div key={log.id || i} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFD] border border-[#DCE5EF] hover:border-[#B8D0E8] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-[#EAF0F8] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3.5 h-3.5 text-[#123B63]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-700 text-[#142238] truncate">{log.user || log.userName}</span>
                      <span className="text-[10px] font-700 text-[#123B63] font-mono whitespace-nowrap">{log.action}</span>
                    </div>
                    <p className="text-[11px] text-[#607086] mt-0.5 truncate">{log.details}</p>
                    <div className="text-[10px] text-[#9BAEC0] mt-0.5">{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="ncc-card p-5">
          <h3 className="text-sm font-700 text-[#142238] mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Mark Today\'s Attendance', to: '/attendance', icon: CheckSquare, color: '#21865B' },
              { label: 'View Cadet Directory', to: '/cadets', icon: Users, color: '#123B63' },
              { label: 'Issue Certificate', to: '/certificates', icon: FileCheck, color: '#1D5D8F' },
              { label: 'Create Announcement', to: '/announcements', icon: Megaphone, color: '#D9A514' },
              { label: 'View Reports', to: '/reports', icon: Award, color: '#607086' },
              { label: 'View Audit Logs', to: '/audit-logs', icon: Shield, color: '#C94A4A' },
            ].map((action, i) => (
              <Link key={i} to={action.to}>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#DCE5EF] hover:border-[#B8D0E8] hover:bg-[#F8FAFD] transition-all group">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${action.color}12` }}>
                    <action.icon className="w-3.5 h-3.5" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-600 text-[#607086] group-hover:text-[#142238] transition-colors flex-1">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#9BAEC0] group-hover:text-[#123B63] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
