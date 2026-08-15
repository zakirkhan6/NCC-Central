import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FileCheck,
  Megaphone,
  BarChart3,
  Search,
  Lock,
  ChevronRight,
  Star,
  Building,
  Sparkles,
  QrCode,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LandingPage = () => {
  const [certQuery, setCertQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (certQuery.trim()) {
      navigate(`/verify-certificate/${certQuery.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans selection:bg-[#12355B] selection:text-white">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#12355B] text-white text-xs py-2 px-6 text-center font-medium flex items-center justify-center gap-2 border-b border-[#1E4E79]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#D4A72C] animate-pulse"></span>
        <span className="font-bold text-[#D4A72C]">OFFICIAL NOTICE:</span>
        <span>1 MAH BATTALION NCC • Enrollment and Fallin Operations for 2026-2027 are Active</span>
        <Link to="/login" className="underline font-bold text-white hover:text-[#D4A72C] ml-2 text-[11px]">
          Sign In &rarr;
        </Link>
      </div>

      {/* Navigation Header */}
      <header className="px-6 lg:px-12 py-4 flex items-center justify-between border-b border-[#E2E8F0] bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#12355B] flex items-center justify-center font-black text-white text-base shadow-md">
            NCC
          </div>
          <div>
            <span className="text-xl font-black text-[#172033] tracking-tight flex items-center gap-2">
              NCC CENTRAL
              <Badge variant="success" className="text-[10px] py-0 px-1.5 font-bold">1 MAH BN</Badge>
            </span>
            <span className="block text-[11px] text-[#1F6B45] font-extrabold uppercase tracking-wider">
              1 MAH BATTALION NCC • MUMBAI-B ALPHA COY
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#475569]">
          <a href="#features" className="hover:text-[#12355B] transition-colors">Core Modules</a>
          <a href="#operations" className="hover:text-[#12355B] transition-colors">Battalion Operations</a>
          <a href="#verify" className="hover:text-[#12355B] transition-colors">QR Verification</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/certificate-verify">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex gap-1.5 text-xs font-bold">
              <QrCode className="w-3.5 h-3.5 text-[#12355B]" />
              Verify Certificate
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="sm" className="text-xs font-bold">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="text-xs font-bold">
              Cadet Enrollment
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Unit Authority Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF1F8] border border-[#C7D9ED] text-[#12355B] text-xs font-bold mb-6 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#12355B]" />
          <span>Official Command & Operations Platform • Directorate Maharashtra</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] tracking-tight leading-[1.1] max-w-5xl">
          National Cadet Corps <br />
          <span className="text-[#12355B] relative inline-block">
            Central Operations Platform
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#D4A72C]/40" viewBox="0 0 100 12" preserveAspectRatio="none">
              <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-[#64748B] max-w-3xl leading-relaxed font-medium">
          The official centralized management infrastructure for <strong className="text-[#172033]">1 MAH Battalion NCC, Mumbai</strong>. 
          Unifying cadet enrollment, daily parade fallin attendance, national camp logistics, syllabus tracking, and tamper-proof QR certificate authentication.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" className="gap-2.5 text-sm font-bold px-7 py-3.5 shadow-md hover:shadow-lg">
              Launch Operations Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="text-sm font-bold px-6 py-3.5 border-[#CBD5E1]">
              New Cadet Self-Registration
            </Button>
          </Link>
        </div>

        {/* Metric Badges Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-center">
            <div className="text-2xl font-black text-[#12355B]">500+</div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Enrolled Cadets</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-center">
            <div className="text-2xl font-black text-[#1F6B45]">94.8%</div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Attendance Rate</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-center">
            <div className="text-2xl font-black text-[#12355B]">100%</div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">QR Verified Certs</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-center">
            <div className="text-2xl font-black text-[#D4A72C]">ALPHA COY</div>
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Rizvi Unit HQ</div>
          </div>
        </div>

        {/* Live Interactive Platform Preview Card */}
        <div className="mt-14 w-full max-w-5xl rounded-3xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden text-left">
          {/* Mockup Header Bar */}
          <div className="h-12 bg-[#12355B] px-6 flex items-center justify-between border-b border-[#1E4E79]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C94A4A]"></div>
              <div className="w-3 h-3 rounded-full bg-[#D4A72C]"></div>
              <div className="w-3 h-3 rounded-full bg-[#2E7D5B]"></div>
              <span className="text-xs font-bold text-white ml-3 tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4A72C]" />
                NCC CENTRAL • Command & Operations Intelligence Console
              </span>
            </div>
            <div className="text-[11px] text-white/80 font-mono hidden sm:block">1-MAH-BN-OPS-ONLINE</div>
          </div>

          {/* Mockup Body Preview */}
          <div className="p-6 md:p-8 bg-[#F8FAFC] grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Live Preview Box 1 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#12355B] uppercase">Today's Fallin</span>
                <Badge variant="success">IN SESSION</Badge>
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Morning Drill & Ceremonial Rehearsal</h4>
              <p className="text-xs text-[#64748B]">Main Ground • 07:00 AM • Commander: Capt. Roshan Khobragade</p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E2E8F0]">
                <span className="font-semibold text-[#1F6B45]">Present: 48 / 52</span>
                <span className="text-[11px] text-[#94A3B8]">Alpha Platoon</span>
              </div>
            </div>

            {/* Quick Live Preview Box 2 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#12355B] uppercase">National Camp</span>
                <Badge variant="gold">TSC ENROLLING</Badge>
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Thal Sainik Camp (TSC) Delhi</h4>
              <p className="text-xs text-[#64748B]">HQ 1 MAH Battalion, Kalina • Shooting & Obstacle Drills</p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E2E8F0]">
                <span className="font-semibold text-[#12355B]">28 Cadets Enrolled</span>
                <span className="text-[11px] text-[#2E7D5B] font-bold">Open</span>
              </div>
            </div>

            {/* Quick Live Preview Box 3 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#12355B] uppercase">Credential Authenticator</span>
                <Badge variant="primary">SECURE QR</Badge>
              </div>
              <h4 className="text-sm font-bold text-[#172033]">Certificate 'B' & 'C' Registry</h4>
              <p className="text-xs text-[#64748B]">Tamper-proof digital validation with Directorate verification stamp.</p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E2E8F0]">
                <span className="font-mono font-bold text-[#12355B]">NCC-2026-B-0881</span>
                <span className="text-[11px] text-[#2E7D5B] font-bold">AUTHENTIC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MIDDLE NAVY BLUE SHOWCASE SECTION */}
      <section id="operations" className="py-20 px-6 lg:px-12 bg-gradient-to-br from-[#12355B] via-[#0E2845] to-[#0A1D33] text-white relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#D4A72C]/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#D4A72C] bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
              BUILT FOR MILITARY PRECISION & AUDIT ACCURACY
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight leading-tight">
              Enterprise Unit Infrastructure <br />
              <span className="text-[#D4A72C]">Powered by Cloud Technology</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed font-medium">
              Eliminating paper rolls, manual rosters, and certificate forgery. NCC Central delivers instant transparency across the command hierarchy.
            </p>
          </div>

          {/* 4 Feature Columns with Frosted Glass styling */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all">
              <div className="p-3 rounded-xl bg-[#D4A72C] text-[#12355B] w-fit font-black mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Full Cadet Dossier</h3>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                Complete regimental records, ranks, blood groups, photo IDs, emergency contacts and medical data.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all">
              <div className="p-3 rounded-xl bg-[#2E7D5B] text-white w-fit font-black mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Fallin & Drill Audit</h3>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                Daily parade attendance logging with real-time percentage analytics and duplicate safeguards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all">
              <div className="p-3 rounded-xl bg-[#3478B5] text-white w-fit font-black mb-4">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">QR Verified Badges</h3>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                Official certificates issued with unique cryptographically verified QR verification codes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/15 transition-all">
              <div className="p-3 rounded-xl bg-[#D4A72C] text-[#12355B] w-fit font-black mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Battalion Intelligence</h3>
              <p className="mt-2 text-xs text-white/70 leading-relaxed">
                Annual report generation, CSV/PDF record exports, and immutable administrative audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE MODULES FEATURE GRID */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#12355B]">
            FULL-STACK NCC CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] mt-2 tracking-tight">
            Six Specialized Modules. One Unified System.
          </h2>
          <p className="mt-3 text-sm text-[#64748B] font-medium">
            Designed to cover every dimension of National Cadet Corps unit administration.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#12355B]/40 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-[#EAF1F8] text-[#12355B] w-fit mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">1. Cadets Directory & Roster</h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
              Centralized regimental database with platoon distribution, ranks, promotion history, blood group records, and instant search.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1F6B45]/40 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-[#E8F5EE] text-[#1F6B45] w-fit mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">2. Attendance & Fallin Register</h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
              Live morning parade attendance marking with one-click bulk status (Present, Absent, Leave, Camp) and automatic compliance percentages.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#12355B]/40 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-[#EAF1F8] text-[#12355B] w-fit mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">3. Parade Fallin & Drill Orders</h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
              Schedule ceremonial parades, morning fallins, inspection drills, squad orders, and platoon-specific instructions.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#3478B5]/40 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-[#EBF3FA] text-[#3478B5] w-fit mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">4. Training & Weapon Curriculum</h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
              Organized syllabus modules covering Drill, Weapon Training (.22 Rifle, SLR), Map Reading, Compass Bearing, and Leadership.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#D4A72C]/40 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-[#FDF6E3] text-[#D4A72C] w-fit mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">5. Camps & National Competitions</h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
              Online registration for Thal Sainik Camp (TSC), Republic Day Camp (RDC), EBSB national integration, and social service drives.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1F6B45]/40 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-[#E8F5EE] text-[#1F6B45] w-fit mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">6. QR-Verified Certificates</h3>
            <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
              Official 'A', 'B' and 'C' Certificate issuance with tamper-proof QR verification codes for employer and academic verification.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK CERTIFICATE VERIFICATION SECTION */}
      <section id="verify" className="py-16 px-6 lg:px-12 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="p-3 rounded-2xl bg-[#EAF1F8] text-[#12355B] w-fit mx-auto">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Instant Certificate Authenticity Verification
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-xl mx-auto">
              Verify any NCC qualification certificate issued by 1 MAH Battalion NCC by entering its unique Certificate ID.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certQuery}
                onChange={(e) => setCertQuery(e.target.value)}
                placeholder="Enter Certificate No (e.g. NCC-2026-B-0881)"
                className="w-full pl-10 pr-4 py-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]"
                required
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto px-6 py-3 text-xs font-bold whitespace-nowrap">
              Verify Record
            </Button>
          </form>

          <p className="text-[11px] text-[#94A3B8]">
            Sample IDs to try: <button type="button" onClick={() => setCertQuery('NCC-2026-B-0881')} className="text-[#12355B] font-mono font-bold hover:underline">NCC-2026-B-0881</button> • <button type="button" onClick={() => setCertQuery('NCC-2025-A-0442')} className="text-[#12355B] font-mono font-bold hover:underline">NCC-2025-A-0442</button>
          </p>
        </div>
      </section>

      {/* INSTITUTIONAL BANNER / MOTTO */}
      <section className="py-16 px-6 lg:px-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="text-3xl font-black text-[#12355B] tracking-widest uppercase">
            "UNITY AND DISCIPLINE"
          </div>
          <p className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">
            Motto of the National Cadet Corps of India
          </p>
          <div className="pt-4 flex items-center justify-center gap-4 text-xs font-bold text-[#172033]">
            <span>1 MAH BATTALION NCC</span>
            <span>•</span>
            <span>MUMBAI GROUP-B</span>
            <span>•</span>
            <span>MAHARASHTRA DIRECTORATE</span>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="px-6 lg:px-12 py-12 bg-white text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E2E8F0]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#12355B] text-white flex items-center justify-center font-black text-xs">
                NCC
              </div>
              <span className="font-black text-sm text-[#172033]">NCC CENTRAL</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Official Centralized Unit Management & Operations System for 1 MAH Battalion NCC, Mumbai.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#172033] mb-3 uppercase tracking-wider text-[11px]">Direct Portals</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/login" className="hover:text-[#12355B]">Admin & Officer Portal</Link></li>
              <li><Link to="/login" className="hover:text-[#12355B]">Cadet Login</Link></li>
              <li><Link to="/register" className="hover:text-[#12355B]">Cadet Self-Registration</Link></li>
              <li><Link to="/certificate-verify" className="hover:text-[#12355B]">Certificate QR Validator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#172033] mb-3 uppercase tracking-wider text-[11px]">Battalion Unit</h4>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              1 MAH BATTALION NCC<br />
              Alpha Company (Rizvi Unit)<br />
              Battalion HQ: Kalina, Santacruz East, Mumbai<br />
              College Unit: Rizvi Educational Complex, Bandra West
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#172033] mb-3 uppercase tracking-wider text-[11px]">Security & Compliance</h4>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Encrypted JWT session authentication, Role-Based Access Control (RBAC), and immutable audit logs.
            </p>
          </div>
        </div>

        <div className="pt-6 text-center text-[11px] text-[#94A3B8]">
          NCC Central v1.0.0 &copy; 2026. 1 MAH BATTALION NCC, MUMBAI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
