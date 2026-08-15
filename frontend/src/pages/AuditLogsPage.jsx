import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Shield } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/audit-logs');
        if (res.data?.success) setLogs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#12355B]" />
          Battalion System Audit Logs
        </h2>
        <p className="text-xs text-[#64748B]">Immutable security and operational activity tracking</p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold border-b border-[#E2E8F0]">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">User & Role</th>
              <th className="px-6 py-4">Action Code</th>
              <th className="px-6 py-4">Resource</th>
              <th className="px-6 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-[#172033]">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-[#12355B]">Loading audit trail...</td>
              </tr>
            ) : (
              logs.map(l => (
                <tr key={l.id} className="hover:bg-[#F1F5F9]">
                  <td className="px-6 py-4 font-mono text-[10px] text-[#94A3B8]">
                    {new Date(l.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#172033]">
                    {l.user} <span className="text-[10px] text-[#12355B] font-normal">({l.role})</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="gold">{l.action}</Badge>
                  </td>
                  <td className="px-6 py-4 text-[#64748B]">{l.resource}</td>
                  <td className="px-6 py-4 text-[#64748B]">{l.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
