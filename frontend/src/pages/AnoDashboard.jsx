import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Users, CheckSquare, Calendar, BookOpen, ArrowRight } from 'lucide-react';

export const AnoDashboard = () => {
  const [cadets, setCadets] = useState([]);
  const [parades, setParades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cadRes, prdRes] = await Promise.all([
          api.get('/cadets?limit=5'),
          api.get('/parades')
        ]);
        if (cadRes.data?.success) setCadets(cadRes.data.data.cadets);
        if (prdRes.data?.success) setParades(prdRes.data.data);
      } catch (err) {
        console.error("ANO Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-[#12355B] font-bold text-sm">Loading Officer Command Data...</div>;

  return (
    <div className="space-y-8">
      {/* Officer Header */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#1F6B45] uppercase tracking-widest">ANO OFFICER COMMAND</span>
          <h2 className="text-2xl font-black text-[#172033]">Capt. Roshan Khobragade Command Center</h2>
          <p className="text-xs text-[#64748B] mt-1">1 MAH BATTALION NCC • ALPHA COY Unit Operations</p>
        </div>
        <Link to="/attendance">
          <Button variant="primary" size="md" className="gap-2">
            <CheckSquare className="w-4 h-4" />
            Mark Today's Attendance
          </Button>
        </Link>
      </div>

      {/* Quick Action Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Company Cadets" value={cadets.length} icon={Users} color="amber" subtitle="ALPHA COY strength" />
        <StatCard title="Parades Conducted" value={parades.length} icon={Calendar} color="emerald" subtitle="Scheduled & completed drills" />
        <StatCard title="Compliance Rate" value="94%" icon={CheckSquare} color="indigo" subtitle="Unit attendance average" />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Cadets Table */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#172033]">Company Cadets Roster</h3>
            <Link to="/cadets" className="text-xs text-[#12355B] hover:underline flex items-center gap-1 font-semibold">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {cadets.map(cadet => (
              <div key={cadet.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#172033]">{cadet.fullName}</div>
                  <div className="text-[10px] text-[#12355B] font-mono">{cadet.regNo} • {cadet.rank}</div>
                </div>
                <Link to={`/cadets/${cadet.id}`}>
                  <Button variant="secondary" size="sm">Profile</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Parade & Fallin Schedule */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#172033]">Upcoming Parades & Fallin</h3>
            <Link to="/parades" className="text-xs text-[#12355B] hover:underline flex items-center gap-1 font-semibold">
              Manage Parades <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {parades.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#172033]">{p.title}</span>
                  <span className="text-[10px] font-bold text-[#12355B]">{p.date} @ {p.time}</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">{p.location}</p>
                <div className="text-[10px] text-[#94A3B8] mt-2">Commander: {p.commander}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
