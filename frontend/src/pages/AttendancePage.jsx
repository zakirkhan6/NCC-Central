import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CheckSquare, Calendar, Filter, Save } from 'lucide-react';

export const AttendancePage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [cadets, setCadets] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState('Morning Fallin & Drill Practice');
  const [companyFilter, setCompanyFilter] = useState('ALPHA COY');
  const [attendanceMap, setAttendanceMap] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCadetsAndAttendance = async () => {
      setLoading(true);
      try {
        const [cadRes, attRes] = await Promise.all([
          api.get('/cadets', { params: { company: companyFilter } }),
          api.get('/attendance', { params: { date, company: companyFilter } })
        ]);

        if (cadRes.data?.success) {
          const list = cadRes.data.data.cadets;
          setCadets(list);

          const initialMap = {};
          const existing = attRes.data?.data || [];

          list.forEach(c => {
            const found = existing.find(a => a.cadetId === c.id);
            initialMap[c.id] = found ? found.status : 'PRESENT';
          });
          setAttendanceMap(initialMap);
        }
      } catch (err) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCadetsAndAttendance();
  }, [date, companyFilter]);

  const handleStatusChange = (cadetId, status) => {
    setAttendanceMap(prev => ({ ...prev, [cadetId]: status }));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    const records = Object.entries(attendanceMap).map(([cadetId, status]) => ({
      cadetId,
      status
    }));

    try {
      await api.post('/attendance/bulk', {
        date,
        session,
        records
      });
      showToast(`Attendance saved successfully for ${date}!`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save attendance', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const canMark = user?.role === 'ADMIN' || user?.role === 'ANO';
  const selectClass = "px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#12355B]" />
            Daily Parade Attendance Marking
          </h2>
          <p className="text-xs text-[#64748B]">1 MAH BATTALION NCC • Company Attendance Register</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={selectClass}
          />
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className={selectClass}
          >
            <option value="ALPHA COY">ALPHA COY</option>
            <option value="BRAVO COY">BRAVO COY</option>
            <option value="CHARLIE COY">CHARLIE COY</option>
          </select>
          {canMark && (
            <Button onClick={handleSaveAttendance} isLoading={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              Save Attendance
            </Button>
          )}
        </div>
      </div>

      {/* Attendance Grid Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4">Cadet Name & Reg No</th>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Platoon</th>
                <th className="px-6 py-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#172033]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[#12355B]">Loading company attendance records...</td>
                </tr>
              ) : cadets.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[#94A3B8]">No cadets found in {companyFilter}.</td>
                </tr>
              ) : (
                cadets.map(cadet => {
                  const currentStatus = attendanceMap[cadet.id] || 'PRESENT';
                  return (
                    <tr key={cadet.id} className="hover:bg-[#F1F5F9] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#172033]">{cadet.fullName}</div>
                        <div className="text-[10px] text-[#12355B] font-mono">{cadet.regNo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="gold">{cadet.rank}</Badge>
                      </td>
                      <td className="px-6 py-4 text-[#64748B]">{cadet.platoon}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {['PRESENT', 'ABSENT', 'LEAVE', 'CAMP'].map(st => (
                            <button
                              key={st}
                              disabled={!canMark}
                              onClick={() => handleStatusChange(cadet.id, st)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                currentStatus === st
                                  ? st === 'PRESENT'
                                    ? 'bg-[#2E7D5B] text-white shadow-sm'
                                    : st === 'ABSENT'
                                    ? 'bg-[#C94A4A] text-white shadow-sm'
                                    : st === 'LEAVE'
                                    ? 'bg-[#C58A00] text-white shadow-sm'
                                    : 'bg-[#3478B5] text-white shadow-sm'
                                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#172033] hover:bg-[#E2E8F0]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
