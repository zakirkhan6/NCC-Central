import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Award, CheckSquare, Calendar, FileCheck, ArrowRight, User, Megaphone, ShieldCheck } from 'lucide-react';
import { StatCard, EmptyState, LoadingState, StatusBadge } from '../components/common/UIComponents';

export const CadetDashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [api.get('/announcements?limit=3')];
        if (user?.cadetId) {
          promises.push(api.get(`/cadets/${user.cadetId}`));
        }
        const results = await Promise.allSettled(promises);
        if (results[0].status === 'fulfilled' && results[0].value.data?.success) {
          const data = results[0].value.data.data;
          setAnnouncements(Array.isArray(data) ? data.slice(0, 3) : []);
        }
        if (results[1] && results[1].status === 'fulfilled' && results[1].value.data?.success) {
          setProfileData(results[1].value.data.data);
        }
      } catch (err) {
        console.error('Cadet dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const attendanceRate = profileData?.attendanceRate ?? (user?.cadetId ? 'N/A' : null);

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#DCE5EF] shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#123B63] flex items-center justify-center font-black text-white text-lg flex-shrink-0">
              {user?.fullName?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-[#142238]">{user?.fullName}</h2>
                <StatusBadge status="ACTIVE" text={user?.rank || 'Cadet'} />
              </div>
              <p className="text-xs text-[#123B63] font-700 font-mono mt-0.5">
                {user?.regNo && `Reg: ${user.regNo} • `}{user?.company || 'ALPHA COY'} • 1 MAH BN
              </p>
            </div>
          </div>
          {user?.cadetId && (
            <Link to={`/cadets/${user.cadetId}`}>
              <button className="btn-secondary text-xs gap-1.5">
                <User className="w-3.5 h-3.5" />
                Full Dossier
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Cadet Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="My Attendance"
          value={loading ? null : (typeof attendanceRate === 'number' ? `${attendanceRate}%` : '—')}
          icon={CheckSquare}
          color="success"
          loading={loading}
        />
        <StatCard
          label="Achievements"
          value={loading ? null : (profileData?.achievements?.length ?? 0)}
          icon={Award}
          color="gold"
          loading={loading}
        />
        <StatCard
          label="Certificates"
          value={loading ? null : (profileData?.certificates?.length ?? 0)}
          icon={FileCheck}
          color="navy"
          loading={loading}
        />
        <StatCard
          label="Parades Attended"
          value={loading ? null : (profileData?.totalParadesAttended ?? 0)}
          icon={Calendar}
          color="blue"
          loading={loading}
        />
      </div>

      {/* Certificates & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* My Certificates */}
        <div className="ncc-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-700 text-[#142238] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#123B63]" />
              My Certificates
            </h3>
            <Link to="/certificates" className="text-xs text-[#123B63] hover:underline font-700 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <LoadingState rows={2} cols={3} />
          ) : (profileData?.certificates?.length > 0) ? (
            <div className="space-y-2">
              {profileData.certificates.slice(0, 3).map((cert) => (
                <div key={cert.id} className="p-3 rounded-xl bg-[#F8FAFD] border border-[#DCE5EF] flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-700 text-[#142238] truncate">{cert.courseName}</div>
                    <div className="text-[10px] text-[#123B63] font-mono mt-0.5">{cert.certificateNo}</div>
                    <div className="text-[10px] text-[#8B6200] mt-0.5 font-600">Grade: {cert.grade}</div>
                  </div>
                  <StatusBadge status="ISSUED" />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={FileCheck} title="No certificates yet" description="Certificates issued by your unit will appear here." />
          )}
        </div>

        {/* Announcements */}
        <div className="ncc-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-700 text-[#142238] flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#123B63]" />
              Unit Announcements
            </h3>
            <Link to="/announcements" className="text-xs text-[#123B63] hover:underline font-700 flex items-center gap-1">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <LoadingState rows={2} cols={2} />
          ) : announcements.length > 0 ? (
            <div className="space-y-2">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl bg-[#F8FAFD] border border-[#DCE5EF]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-700 text-[#142238]">{ann.title}</span>
                    <StatusBadge status={ann.priority} text={ann.priority} />
                  </div>
                  <p className="text-[11px] text-[#607086] mt-1 line-clamp-2">{ann.content}</p>
                  <div className="text-[10px] text-[#9BAEC0] mt-1.5 font-500">{ann.author}</div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Megaphone} title="No announcements" description="Unit announcements will appear here." />
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="ncc-card p-5">
        <h3 className="text-sm font-700 text-[#142238] mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'My Attendance', to: '/parades', icon: CheckSquare, color: '#21865B' },
            { label: 'Events & Camps', to: '/events', icon: Calendar, color: '#1D5D8F' },
            { label: 'My Certificates', to: '/certificates', icon: FileCheck, color: '#123B63' },
            { label: 'Verify Certificate', to: '/verify', icon: ShieldCheck, color: '#D9A514' },
          ].map((item, i) => (
            <Link key={i} to={item.to}>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#DCE5EF] hover:border-[#B8D0E8] hover:bg-[#F8FAFD] transition-all cursor-pointer text-center">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${item.color}12` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-[11px] font-600 text-[#607086]">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
