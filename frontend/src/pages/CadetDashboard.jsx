import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Award, CheckSquare, Calendar, FileCheck, ArrowRight, User } from 'lucide-react';

export const CadetDashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCadetProfile = async () => {
      if (user?.cadetId) {
        try {
          const res = await api.get(`/cadets/${user.cadetId}`);
          if (res.data?.success) {
            setProfileData(res.data.data);
          }
        } catch (err) {
          console.error("Cadet profile error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchCadetProfile();
  }, [user]);

  if (loading) return <div className="text-[#12355B] font-bold text-sm">Loading Cadet Portal...</div>;

  return (
    <div className="space-y-8">
      {/* Cadet Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
            alt="Cadet Avatar"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E2E8F0] shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#172033]">{user?.fullName}</h2>
              <Badge variant="gold">{user?.rank || 'Cadet'}</Badge>
            </div>
            <p className="text-xs text-[#12355B] font-mono mt-0.5">
              Reg No: {user?.regNo || 'MH23SDA56785'} • {user?.company || 'ALPHA COY'}
            </p>
          </div>
        </div>
        <Link to={`/cadets/${user?.cadetId || 'cdt-1'}`}>
          <Button variant="secondary" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            View Full Profile
          </Button>
        </Link>
      </div>

      {/* Cadet Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="My Attendance Rate" value={`${profileData?.attendanceRate || 100}%`} icon={CheckSquare} color="emerald" subtitle="Official attendance history" />
        <StatCard title="Achievements" value={profileData?.achievements?.length || 1} icon={Award} color="amber" subtitle="Medals & honors earned" />
        <StatCard title="Certificates" value={profileData?.certificates?.length || 1} icon={FileCheck} color="indigo" subtitle="Verified qualification certificates" />
      </div>

      {/* Enrolled Events & Certificates Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#172033]">My Certificates</h3>
            <Link to="/certificates" className="text-xs text-[#12355B] hover:underline flex items-center gap-1 font-semibold">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {profileData?.certificates?.map(cert => (
              <div key={cert.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#172033]">{cert.courseName}</div>
                  <div className="text-[10px] text-[#12355B] font-mono">{cert.certificateNo}</div>
                  <div className="text-[10px] text-[#2E7D5B] mt-1">Grade: {cert.grade}</div>
                </div>
                <Badge variant="success">ISSUED</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#172033]">Registered Camps & Events</h3>
            <Link to="/events" className="text-xs text-[#12355B] hover:underline flex items-center gap-1 font-semibold">
              Browse Events <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {profileData?.enrolledEvents?.map(evt => (
              <div key={evt.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#172033]">{evt.title}</span>
                  <Badge variant="gold">{evt.category}</Badge>
                </div>
                <div className="text-[10px] text-[#64748B] mt-1">{evt.date} • {evt.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
