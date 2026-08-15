import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { FileCheck, Plus, QrCode, ShieldCheck, Download } from 'lucide-react';

export const CertificatesPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [certificates, setCertificates] = useState([]);
  const [cadets, setCadets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    cadetId: '',
    courseName: "NCC 'B' Certificate Examination",
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'Alpha (A Grade)'
  });

  const fetchData = async () => {
    try {
      const [certRes, cadRes] = await Promise.all([
        api.get('/certificates'),
        api.get('/cadets')
      ]);
      if (certRes.data?.success) setCertificates(certRes.data.data);
      if (cadRes.data?.success) setCadets(cadRes.data.data.cadets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/certificates', formData);
      showToast('Certificate generated and issued!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Failed to issue certificate', 'error');
    }
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'ANO';
  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">Verified Certificate Registry</h2>
          <p className="text-xs text-[#64748B]">NCC 'A', 'B' and 'C' Qualification Certificates with QR Verification</p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Issue Certificate
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-[#12355B] font-bold text-sm">Loading certificate registry...</div>
        ) : (
          certificates.map(c => (
            <div key={c.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </Badge>
                <span className="text-[11px] font-mono text-[#12355B] font-bold">{c.certificateNo}</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#172033]">{c.courseName}</h3>
                <p className="text-xs text-[#172033] font-semibold mt-1">Recipient: {c.cadetName} ({c.rank})</p>
                <p className="text-[10px] text-[#94A3B8] font-mono">Reg No: {c.regNo}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#E2E8F0]">
                <span>Grade: <span className="text-[#D4A72C] font-bold">{c.grade}</span></span>
                <span>Issue Date: {c.issueDate}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link to={`/verify-certificate/${c.certificateNo}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full gap-2 text-xs">
                    <QrCode className="w-4 h-4 text-[#12355B]" />
                    QR Verification Page
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Official NCC Certificate">
        <form onSubmit={handleIssue} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Recipient Cadet *</label>
            <select value={formData.cadetId}
              onChange={(e) => setFormData({ ...formData, cadetId: e.target.value })}
              className={inputClass} required>
              <option value="">Choose Cadet...</option>
              {cadets.map(cd => (
                <option key={cd.id} value={cd.id}>{cd.fullName} ({cd.regNo})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Course / Exam Name *</label>
            <select value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className={inputClass}>
              <option value="NCC 'A' Certificate Examination">NCC 'A' Certificate Examination</option>
              <option value="NCC 'B' Certificate Examination">NCC 'B' Certificate Examination</option>
              <option value="NCC 'C' Certificate Examination">NCC 'C' Certificate Examination</option>
              <option value="Thal Sainik Camp Completion">Thal Sainik Camp Completion</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Grade Awarded</label>
              <input type="text" value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Issue Date</label>
              <input type="date" value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Generate Certificate & Issue</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
