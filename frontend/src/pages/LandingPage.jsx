import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Award, Users, Calendar, ArrowRight,
  BookOpen, FileCheck, Megaphone, BarChart3, QrCode,
  ShieldAlert, Clock, CheckCircle2, Loader2, AlertTriangle,
  Tent, Search
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const fetchPublic = async (endpoint) => {
  const res = await fetch(`${API_BASE}/public/${endpoint}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed');
  return data.data;
};

// Animated counter
const AnimatedStat = ({ value, suffix = '', loading }) => {
  if (loading) return <div className="skeleton h-8 w-20 rounded" />;
  if (value === undefined || value === null) return <span>—</span>;
  return <span>{value}{suffix}</span>;
};

export const LandingPage = () => {
  const [certQuery, setCertQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [operations, setOperations] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [opsLoading, setOpsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublic('statistics')
      .then(setStats)
      .catch(() => setStatsError(true))
      .finally(() => setStatsLoading(false));

    fetchPublic('operations')
      .then(setOperations)
      .catch(() => {})
      .finally(() => setOpsLoading(false));
  }, []);

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (certQuery.trim()) navigate(`/verify/${certQuery.trim()}`);
  };

  const modules = [
    { icon: Users, title: 'Cadets Directory', desc: 'Complete cadet roster with personal dossiers, regimental data, blood groups and emergency contacts.', link: '/cadets', color: '#123B63' },
    { icon: CheckCircle2, title: 'Attendance Register', desc: 'Daily Fall-In register with real-time present/absent marking and percentage tracking.', link: '/attendance', color: '#21865B' },
    { icon: Calendar, title: 'Parade Fall-In', desc: 'Drill orders, daily schedule management, and parade commander assignment.', link: '/parades', color: '#1D5D8F' },
    { icon: BookOpen, title: 'Training & Syllabus', desc: 'NCC training modules, instructors, progress tracking and completion status.', link: '/training', color: '#8B6200' },
    { icon: Tent, title: 'Camps & Events', desc: 'National camps, unit events, capacity management and cadet registration.', link: '/events', color: '#123B63' },
    { icon: FileCheck, title: 'QR-Verified Certificates', desc: "Tamper-proof NCC 'A', 'B', and 'C' certificates with live QR verification.", link: '/verify', color: '#C94A4A' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#142238] flex flex-col font-sans">
      {/* Announcement Bar */}
      {operations?.latestAnnouncement && (
        <div className="bg-[#123B63] text-white text-[11px] py-2 px-6 text-center flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9A514] animate-pulse" />
          <span className="font-700 text-[#D9A514]">
            {operations.latestAnnouncement.priority === 'URGENT' ? 'URGENT:' : 'NOTICE:'}
          </span>
          <span className="font-500">{operations.latestAnnouncement.title}</span>
          <Link to="/login" className="underline font-700 hover:text-[#D9A514] ml-2">Sign In →</Link>
        </div>
      )}

      {/* Header */}
      <header className="px-6 lg:px-12 py-4 flex items-center justify-between border-b border-[#DCE5EF] bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#123B63] flex items-center justify-center font-black text-white text-sm shadow">
            NCC
          </div>
          <div>
            <span className="text-lg font-black text-[#142238] tracking-tight flex items-center gap-2">
              NCC CENTRAL
              <span className="text-[10px] font-700 bg-[#E8F0F8] text-[#123B63] px-1.5 py-0.5 rounded-full border border-[#B8D0E8]">1 MAH BN</span>
            </span>
            <span className="block text-[10px] text-[#21865B] font-700 uppercase tracking-wider">
              1 MAH BATTALION NCC • MUMBAI-B ALPHA COY
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-700 text-[#607086]">
          <a href="#modules" className="hover:text-[#123B63] transition-colors">Core Modules</a>
          <a href="#operations" className="hover:text-[#123B63] transition-colors">Battalion Operations</a>
          <Link to="/verify" className="hover:text-[#123B63] transition-colors">QR Verification</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/verify">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#DCE5EF] rounded-lg text-xs font-700 text-[#142238] hover:bg-[#EAF0F8] transition-colors">
              <QrCode className="w-3.5 h-3.5 text-[#123B63]" />
              Verify Certificate
            </button>
          </Link>
          <Link to="/login">
            <button className="px-3 py-1.5 border border-[#DCE5EF] rounded-lg text-xs font-700 text-[#142238] hover:bg-[#EAF0F8] transition-colors">
              Sign In
            </button>
          </Link>
          <Link to="/register">
            <button className="px-3 py-1.5 bg-[#123B63] rounded-lg text-xs font-700 text-white hover:bg-[#0B2742] transition-colors">
              Cadet Enrollment
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 lg:px-12 pt-16 pb-16 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF0F8] border border-[#C7D9ED] text-[#123B63] text-xs font-700 mb-6 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Official Command & Operations Platform • Directorate Maharashtra</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#142238] tracking-tight leading-[1.1] max-w-4xl">
          National Cadet Corps <br />
          <span className="text-[#123B63] relative">
            Central Operations Platform
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#D9A514]/40" viewBox="0 0 100 12" preserveAspectRatio="none">
              <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="mt-6 text-base text-[#607086] max-w-2xl leading-relaxed font-500">
          The official centralized management infrastructure for <strong className="text-[#142238]">1 MAH Battalion NCC, Mumbai</strong>.
          Unifying cadet enrollment, parade attendance, camp logistics, syllabus tracking, and tamper-proof QR certificate authentication.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#123B63] text-white rounded-xl text-sm font-700 hover:bg-[#0B2742] transition-colors shadow-md">
              Launch Operations Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-3 border border-[#DCE5EF] rounded-xl text-sm font-700 text-[#142238] hover:bg-[#EAF0F8] transition-colors">
              New Cadet Self-Registration
            </button>
          </Link>
        </div>

        {/* Dynamic Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {[
            {
              value: statsLoading ? null : (stats ? `${stats.totalCadets}` : '—'),
              label: 'Enrolled Cadets',
              color: '#123B63',
              loading: statsLoading
            },
            {
              value: statsLoading ? null : (stats ? `${stats.attendanceRate}%` : '—'),
              label: 'Attendance Rate',
              color: '#21865B',
              loading: statsLoading
            },
            {
              value: statsLoading ? null : (stats ? `${stats.verifiedCertificates}` : '—'),
              label: 'Verified Certificates',
              color: '#123B63',
              loading: statsLoading
            },
            {
              value: statsLoading ? null : (stats ? stats.activeUnit : '—'),
              label: 'Active Unit',
              color: '#8B6200',
              loading: statsLoading
            }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-[#DCE5EF] shadow-sm text-center">
              {item.loading ? (
                <div className="skeleton h-7 w-16 mx-auto mb-2 rounded" />
              ) : (
                <div className="text-2xl font-black truncate" style={{ color: item.color }}>{item.value}</div>
              )}
              <div className="text-[11px] font-700 text-[#607086] uppercase tracking-wider mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        {statsError && (
          <p className="mt-3 text-[11px] text-[#9BAEC0]">Statistics unavailable — backend offline</p>
        )}

        {/* Operations Preview */}
        <div className="mt-12 w-full max-w-5xl rounded-2xl bg-white border border-[#DCE5EF] shadow-xl overflow-hidden text-left">
          <div className="h-11 bg-[#123B63] px-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C94A4A]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#D9A514]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#21865B]" />
              </div>
              <span className="text-xs font-700 text-white ml-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D9A514]" />
                NCC CENTRAL • Battalion Operations Console
              </span>
            </div>
            <span className="text-[10px] text-white/60 font-mono hidden sm:block">1-MAH-BN-OPS</span>
          </div>

          <div className="p-5 md:p-6 bg-[#F8FAFD] grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Today's Parade */}
            <div className="p-4 rounded-xl bg-white border border-[#DCE5EF] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-700 text-[#123B63] uppercase tracking-wider">Today's Fall-In</span>
                {opsLoading ? (
                  <div className="skeleton h-4 w-16 rounded-full" />
                ) : operations?.todayParade ? (
                  <span className="badge badge-success">{operations.todayParade.status || 'SCHEDULED'}</span>
                ) : (
                  <span className="badge badge-grey">NO PARADE</span>
                )}
              </div>
              {opsLoading ? (
                <div className="space-y-1.5"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton h-3 w-full rounded" /></div>
              ) : operations?.todayParade ? (
                <>
                  <h4 className="text-sm font-700 text-[#142238]">{operations.todayParade.title}</h4>
                  <p className="text-xs text-[#607086]">{operations.todayParade.location} • {operations.todayParade.time}</p>
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-[#DCE5EF]">
                    <span className="font-600 text-[#21865B]">Cdr: {operations.todayParade.commander}</span>
                    <span className="text-[10px] text-[#9BAEC0]">{operations.todayParade.company}</span>
                  </div>
                </>
              ) : (
                <div className="py-3 text-center text-xs text-[#9BAEC0]">No parade scheduled today</div>
              )}
            </div>

            {/* Upcoming Camp/Event */}
            <div className="p-4 rounded-xl bg-white border border-[#DCE5EF] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-700 text-[#123B63] uppercase tracking-wider">Upcoming Camp</span>
                {opsLoading ? (
                  <div className="skeleton h-4 w-16 rounded-full" />
                ) : operations?.upcomingCamp ? (
                  <span className="badge badge-gold">ENROLLING</span>
                ) : (
                  <span className="badge badge-grey">NONE</span>
                )}
              </div>
              {opsLoading ? (
                <div className="space-y-1.5"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton h-3 w-full rounded" /></div>
              ) : operations?.upcomingCamp ? (
                <>
                  <h4 className="text-sm font-700 text-[#142238]">{operations.upcomingCamp.title}</h4>
                  <p className="text-xs text-[#607086]">{operations.upcomingCamp.location}</p>
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-[#DCE5EF]">
                    <span className="font-600 text-[#123B63]">Capacity: {operations.upcomingCamp.capacity || '—'}</span>
                    <span className="text-[10px] text-[#21865B] font-700">Open</span>
                  </div>
                </>
              ) : (
                <div className="py-3 text-center text-xs text-[#9BAEC0]">No camps currently scheduled</div>
              )}
            </div>

            {/* Certificate Verification */}
            <div className="p-4 rounded-xl bg-white border border-[#DCE5EF] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-700 text-[#123B63] uppercase tracking-wider">QR Verification</span>
                <span className="badge badge-navy">SECURE</span>
              </div>
              {opsLoading ? (
                <div className="space-y-1.5"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton h-3 w-full rounded" /></div>
              ) : operations?.recentCertificate ? (
                <>
                  <h4 className="text-sm font-700 text-[#142238]">{operations.recentCertificate.courseName}</h4>
                  <p className="text-xs text-[#607086]">Recent: {operations.recentCertificate.maskedCadetName}</p>
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-[#DCE5EF]">
                    <span className="font-mono font-700 text-[#123B63] text-[10px]">{operations.recentCertificate.certificateNo}</span>
                    <span className="text-[10px] text-[#21865B] font-700">AUTHENTIC</span>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-sm font-700 text-[#142238]">Certificate Registry</h4>
                  <p className="text-xs text-[#607086]">Tamper-proof digital validation with QR authentication.</p>
                  <div className="pt-2 border-t border-[#DCE5EF]">
                    <span className="text-[10px] text-[#9BAEC0]">No certificates issued yet</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-16 px-6 lg:px-12 bg-white border-t border-b border-[#DCE5EF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-800 uppercase tracking-widest text-[#D9A514] bg-[#F4E7B2] px-3 py-1 rounded-full border border-[#E8C668]">
              NCC CENTRAL CAPABILITIES
            </span>
            <h2 className="text-3xl font-black mt-4 text-[#142238] tracking-tight">Core Platform Modules</h2>
            <p className="mt-3 text-sm text-[#607086] max-w-2xl mx-auto">
              Every module is connected to a live Supabase database. Zero static data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod, i) => (
              <Link key={i} to={mod.link} className="block group">
                <div className="ncc-card p-5 h-full hover:border-[#B8D0E8] transition-all">
                  <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${mod.color}12` }}>
                    <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                  </div>
                  <h3 className="text-sm font-700 text-[#142238] mb-1.5 group-hover:text-[#123B63] transition-colors">{mod.title}</h3>
                  <p className="text-xs text-[#607086] leading-relaxed">{mod.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-700 text-[#123B63]">
                    Access Module <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Operations Section */}
      <section id="operations" className="py-16 px-6 lg:px-12" style={{ background: 'linear-gradient(135deg, #0B2742 0%, #123B63 60%, #1D5D8F 100%)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[10px] font-800 uppercase tracking-widest text-[#D9A514] bg-white/10 px-3 py-1 rounded-full border border-white/20">
            BUILT FOR MILITARY PRECISION
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
            Enterprise Unit Infrastructure <br />
            <span className="text-[#D9A514]">Powered by Cloud Technology</span>
          </h2>
          <p className="mt-4 text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
            Eliminating paper rolls, manual rosters, and certificate forgery. NCC Central delivers instant transparency across the command hierarchy.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Zero Paper Rolls', Icon: CheckCircle2, desc: 'Digital attendance' },
              { label: 'Live Statistics', Icon: BarChart3, desc: 'Real-time data' },
              { label: 'QR Verification', Icon: QrCode, desc: 'Tamper-proof certs' },
              { label: 'Role-Based Access', Icon: ShieldCheck, desc: 'RBAC security' },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm text-left">
                <f.Icon className="w-6 h-6 text-[#D9A514] mb-3" />
                <h4 className="text-sm font-700 text-white">{f.label}</h4>
                <p className="text-xs text-white/60 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Verification Section */}
      <section id="verify" className="py-16 px-6 lg:px-12 bg-white border-t border-[#DCE5EF]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF0F8] flex items-center justify-center mx-auto mb-5">
            <QrCode className="w-7 h-7 text-[#123B63]" />
          </div>
          <h2 className="text-2xl font-black text-[#142238] tracking-tight">Certificate Verification</h2>
          <p className="mt-2 text-sm text-[#607086]">
            Instantly verify the authenticity of any NCC certificate issued by this unit.
          </p>

          <form onSubmit={handleQuickVerify} className="mt-6 flex gap-2 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9BAEC0]" />
              <input
                value={certQuery}
                onChange={e => setCertQuery(e.target.value)}
                placeholder="e.g. NCC-2026-B-1234"
                className="ncc-input pl-10 text-sm"
                id="cert-search-landing"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#123B63] text-white rounded-lg text-sm font-700 hover:bg-[#0B2742] transition-colors flex-shrink-0">
              Verify
            </button>
          </form>

          <p className="mt-3 text-[11px] text-[#9BAEC0]">
            You can also scan the QR code on any NCC Central certificate to verify directly.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-12 bg-[#0B2742] text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#D9A514] flex items-center justify-center font-black text-[#0B2742] text-xs">
            NCC
          </div>
          <span className="text-sm font-700 text-white">NCC Central</span>
        </div>
        <p className="text-[11px] text-white/40 font-500">
          1 MAH BATTALION NCC, MUMBAI — Official Command & Operations Platform © 2026
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-white/40">
          <Link to="/verify" className="hover:text-white/70 transition-colors">Verify Certificate</Link>
          <Link to="/register" className="hover:text-white/70 transition-colors">Cadet Enrollment</Link>
          <Link to="/login" className="hover:text-white/70 transition-colors">Sign In</Link>
        </div>
      </footer>
    </div>
  );
};
