import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { FileCheck, Plus, QrCode, ShieldCheck, ExternalLink, RotateCcw, Search } from 'lucide-react';
import {
  PageHeader, Modal, StatusBadge, SearchBar, FilterSelect,
  EmptyState, LoadingState, FormField, ConfirmationDialog
} from '../components/common/UIComponents';

const COURSE_OPTIONS = [
  "NCC 'A' Certificate Examination",
  "NCC 'B' Certificate Examination",
  "NCC 'C' Certificate Examination",
  "Thal Sainik Camp Completion",
  "Combined Annual Training Camp",
  "Rock Climbing Camp Completion",
  "National Integration Camp",
];

const GRADE_OPTIONS = [
  "A+ (Outstanding)", "A (Excellent)", "B+ (Very Good)", "B (Good)", "C (Satisfactory)", "Alpha (A Grade)", "Bravo (B Grade)"
];

export const CertificatesPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [certificates, setCertificates] = useState([]);
  const [cadets, setCadets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [qrModal, setQrModal] = useState(null);

  const [formData, setFormData] = useState({
    cadetId: '',
    courseName: "NCC 'B' Certificate Examination",
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'A (Excellent)'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const [certRes, cadRes] = await Promise.all([
        api.get(`/certificates?${params}`),
        user?.role !== 'CADET' ? api.get('/cadets?limit=200') : Promise.resolve({ data: { success: false } })
      ]);

      if (certRes.data?.success) setCertificates(certRes.data.data);
      if (cadRes?.data?.success) setCadets(cadRes.data.data?.cadets || cadRes.data.data || []);
    } catch (err) {
      showToast('Failed to load certificate registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [search, statusFilter]);

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!formData.cadetId || !formData.courseName) {
      showToast('Please select a cadet and course', 'warning');
      return;
    }
    setIsIssuing(true);
    try {
      await api.post('/certificates', formData);
      showToast('Certificate generated and issued successfully!', 'success');
      setIsModalOpen(false);
      setFormData({ cadetId: '', courseName: "NCC 'B' Certificate Examination", issueDate: new Date().toISOString().split('T')[0], grade: 'A (Excellent)' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to issue certificate', 'error');
    } finally {
      setIsIssuing(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    try {
      await api.put(`/certificates/${revokeTarget.id}/revoke`, { reason: 'Revoked by officer' });
      showToast('Certificate revoked.', 'warning');
      setRevokeTarget(null);
      fetchData();
    } catch (err) {
      showToast('Failed to revoke certificate', 'error');
      setRevokeTarget(null);
    }
  };

  const showQr = async (cert) => {
    try {
      const res = await api.get(`/certificates/qr/${cert.certificateNo}`);
      if (res.data?.success) {
        setQrModal({ cert, qrDataUrl: res.data.qrDataUrl, verifyUrl: res.data.verifyUrl });
      }
    } catch {
      showToast('Failed to load QR code', 'error');
    }
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'ANO';

  return (
    <div className="space-y-5">
      <PageHeader
        title="Certificate Registry"
        subtitle="NCC 'A', 'B' and 'C' Certificates with QR Verification"
        icon={FileCheck}
      >
        <button onClick={fetchData} className="btn-secondary text-xs gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
        {isAuthorized && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs gap-1.5">
            <Plus className="w-4 h-4" /> Issue Certificate
          </button>
        )}
      </PageHeader>

      {/* Filters */}
      <div className="ncc-card p-3 flex flex-wrap gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search certificate no, cadet, course..."
          className="flex-1 min-w-[200px]"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={['ISSUED', 'REVOKED']}
          placeholder="All Statuses"
          className="w-36"
        />
      </div>

      {/* Certificate Grid */}
      {loading ? (
        <div className="ncc-card p-6"><LoadingState rows={3} cols={4} /></div>
      ) : certificates.length === 0 ? (
        <div className="ncc-card p-6">
          <EmptyState
            icon={FileCheck}
            title="No certificates found"
            description={search || statusFilter ? "Try different search terms or clear filters." : "Issue the first certificate to get started."}
            action={isAuthorized ? (
              <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs gap-1.5">
                <Plus className="w-4 h-4" /> Issue Certificate
              </button>
            ) : null}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map(cert => (
            <div key={cert.id} className="ncc-card p-5 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 flex-shrink-0 ${cert.status === 'REVOKED' ? 'text-[#C94A4A]' : 'text-[#21865B]'}`} />
                  <StatusBadge status={cert.status || 'ISSUED'} />
                </div>
                <span className="text-[11px] font-mono font-700 text-[#123B63]">{cert.certificateNo}</span>
              </div>

              <div>
                <h3 className="text-sm font-700 text-[#142238]">{cert.courseName}</h3>
                <p className="text-xs text-[#607086] mt-1 font-600">Recipient: {cert.cadetName} · {cert.rank || 'Cadet'}</p>
                {cert.regNo && <p className="text-[10px] text-[#9BAEC0] font-mono mt-0.5">Reg: {cert.regNo}</p>}
              </div>

              <div className="flex items-center justify-between text-xs text-[#607086] pt-3 border-t border-[#DCE5EF]">
                <span>Grade: <span className="font-700 text-[#8B6200]">{cert.grade}</span></span>
                <span>Issued: {cert.issueDate}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => showQr(cert)}
                  className="btn-secondary text-xs gap-1.5 flex-1"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#123B63]" /> QR Code
                </button>
                <Link to={`/verify/${cert.certificateNo}`} className="flex-1">
                  <button className="btn-secondary text-xs gap-1.5 w-full">
                    <ExternalLink className="w-3.5 h-3.5 text-[#123B63]" /> Verify
                  </button>
                </Link>
                {isAuthorized && cert.status !== 'REVOKED' && (
                  <button
                    onClick={() => setRevokeTarget(cert)}
                    className="text-[10px] font-700 text-[#C94A4A] hover:bg-[#FDE8E8] px-2 py-1.5 rounded-lg transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Certificate Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Official NCC Certificate" size="md">
        <form onSubmit={handleIssue} className="space-y-4">
          <FormField label="Recipient Cadet" required>
            <select
              value={formData.cadetId}
              onChange={e => setFormData({ ...formData, cadetId: e.target.value })}
              className="ncc-input text-xs"
              required
            >
              <option value="">Choose Cadet...</option>
              {cadets.map(cd => (
                <option key={cd.id} value={cd.id}>{cd.fullName} ({cd.regNo})</option>
              ))}
            </select>
          </FormField>

          <FormField label="Course / Exam" required>
            <select
              value={formData.courseName}
              onChange={e => setFormData({ ...formData, courseName: e.target.value })}
              className="ncc-input text-xs"
            >
              {COURSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Grade Awarded">
              <select
                value={formData.grade}
                onChange={e => setFormData({ ...formData, grade: e.target.value })}
                className="ncc-input text-xs"
              >
                {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </FormField>
            <FormField label="Issue Date">
              <input
                type="date"
                value={formData.issueDate}
                onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                className="ncc-input text-xs"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary text-xs" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary text-xs gap-1.5" disabled={isIssuing}>
              {isIssuing ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : 'Generate & Issue Certificate'}
            </button>
          </div>
        </form>
      </Modal>

      {/* QR Modal */}
      <Modal isOpen={!!qrModal} onClose={() => setQrModal(null)} title="Certificate QR Verification Code" size="sm">
        {qrModal && (
          <div className="text-center space-y-4">
            <div className="p-3 bg-white border-2 border-[#DCE5EF] rounded-xl inline-block">
              <img src={qrModal.qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
            </div>
            <div>
              <p className="text-xs font-700 text-[#142238]">{qrModal.cert.courseName}</p>
              <p className="text-[11px] text-[#607086]">{qrModal.cert.cadetName}</p>
              <p className="text-[10px] font-mono text-[#123B63] mt-1">{qrModal.cert.certificateNo}</p>
            </div>
            <a
              href={qrModal.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs gap-1.5 inline-flex"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open Verification Page
            </a>
            <p className="text-[10px] text-[#9BAEC0] break-all">{qrModal.verifyUrl}</p>
          </div>
        )}
      </Modal>

      {/* Revoke Confirmation */}
      <ConfirmationDialog
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevoke}
        title="Revoke Certificate"
        message={`Are you sure you want to revoke certificate ${revokeTarget?.certificateNo} issued to ${revokeTarget?.cadetName}? This action will be logged.`}
        confirmText="Revoke Certificate"
        danger={true}
      />
    </div>
  );
};
