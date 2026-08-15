import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { BarChart3, Download, FileSpreadsheet, Users, CheckSquare, Award, FileCheck } from 'lucide-react';

export const ReportsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/summary');
        if (res.data?.success) setSummary(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExportCadets = () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/reports/export/cadets`, '_blank');
  };

  const handleExportAttendance = () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/reports/export/attendance`, '_blank');
  };

  if (loading) return <div className="text-[#12355B] font-bold text-sm">Generating Battalion Reports...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">Annual & Battalion Performance Reports</h2>
          <p className="text-xs text-[#64748B]">Export official CSV and PDF audit records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExportCadets} variant="secondary" className="gap-2 text-xs">
            <FileSpreadsheet className="w-4 h-4 text-[#1F6B45]" />
            Export Cadets CSV
          </Button>
          <Button onClick={handleExportAttendance} variant="primary" className="gap-2 text-xs">
            <Download className="w-4 h-4" />
            Export Attendance CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Cadet Roster Count" value={summary?.metrics?.totalCadets || 0} icon={Users} color="amber" />
        <StatCard title="Attendance Rate" value={`${summary?.metrics?.attendancePercentage || 0}%`} icon={CheckSquare} color="emerald" />
        <StatCard title="Training Modules" value={summary?.metrics?.totalTrainingSessions || 0} icon={BarChart3} color="indigo" />
        <StatCard title="Certificates Issued" value={summary?.metrics?.totalCertificatesIssued || 0} icon={FileCheck} color="rose" />
      </div>

      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#172033]">Company Distribution Breakdown</h3>
        <div className="grid grid-cols-3 gap-4 text-xs text-center">
          {Object.entries(summary?.companyBreakdown || {}).map(([company, count]) => (
            <div key={company} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[#64748B] block font-semibold">{company}</span>
              <span className="text-2xl font-black text-[#12355B] mt-1 block">{count} Cadets</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
