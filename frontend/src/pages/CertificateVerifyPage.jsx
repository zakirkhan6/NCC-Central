import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Search, ArrowLeft, CheckCircle2, XCircle, Calendar, Award, BookOpen, Clock } from 'lucide-react';
import { LoadingState } from '../components/common/UIComponents';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const CertificateVerifyPage = () => {
  const { certNo } = useParams();
  const navigate = useNavigate();
  const [certInput, setCertInput] = useState(certNo || '');
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(!!certNo);
  const [searched, setSearched] = useState(!!certNo);

  const verifyCert = async (number) => {
    if (!number?.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${API_BASE}/public/certificates/verify/${encodeURIComponent(number.trim())}`);
      const data = await res.json();
      setVerification(data);
    } catch (err) {
      setVerification({ success: false, verified: false, message: 'Verification service is temporarily unavailable.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certNo) verifyCert(certNo);
  }, [certNo]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      navigate(`/verify/${certInput.trim()}`);
      verifyCert(certInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-[#DCE5EF] px-6 py-4 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-lg bg-[#123B63] flex items-center justify-center font-black text-white text-[11px]">
          NCC
        </div>
        <div>
          <h2 className="text-sm font-800 text-[#142238]">NCC Central — Certificate Verification</h2>
          <p className="text-[10px] text-[#607086] font-500">1 MAH BATTALION NCC, MUMBAI</p>
        </div>
        <Link to="/" className="ml-auto flex items-center gap-1.5 text-xs font-600 text-[#607086] hover:text-[#123B63] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-5">
          {/* Title */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF0F8] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-[#123B63]" />
            </div>
            <h1 className="text-xl font-800 text-[#142238]">Official Certificate Verification</h1>
            <p className="text-xs text-[#607086] mt-1">Enter a certificate number to verify its authenticity in the official NCC Central registry.</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9BAEC0]" />
              <input
                value={certInput}
                onChange={e => setCertInput(e.target.value)}
                placeholder="e.g. NCC-2026-B-1234"
                className="ncc-input pl-10 text-sm"
                id="cert-verify-input"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#123B63] text-white text-sm font-700 rounded-lg hover:bg-[#0B2742] transition-colors flex-shrink-0 disabled:opacity-60"
              disabled={loading}
            >
              Verify
            </button>
          </form>

          {/* Result */}
          {loading && (
            <div className="bg-white border border-[#DCE5EF] rounded-2xl p-8">
              <LoadingState message="Querying Official Certificate Registry..." />
            </div>
          )}

          {!loading && searched && verification && (
            <div className="bg-white border border-[#DCE5EF] rounded-2xl shadow-sm overflow-hidden fade-in">
              {/* Status Banner */}
              <div className={`px-5 py-4 flex items-center gap-3 ${
                verification.verified
                  ? 'bg-[#E8F5EE] border-b border-[#7BBFA0]/30'
                  : 'bg-[#FDE8E8] border-b border-[#E8A0A0]/30'
              }`}>
                {verification.verified ? (
                  <ShieldCheck className="w-6 h-6 text-[#21865B]" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-[#C94A4A]" />
                )}
                <div>
                  <p className={`text-sm font-800 ${verification.verified ? 'text-[#21865B]' : 'text-[#C94A4A]'}`}>
                    {verification.verified ? 'AUTHENTIC — Certificate Verified' : 'INVALID — Not Found in Registry'}
                  </p>
                  <p className="text-xs text-[#607086] mt-0.5">
                    {verification.verified
                      ? 'This certificate is authentic and was issued by 1 MAH Battalion NCC, Mumbai.'
                      : verification.message || 'This certificate number could not be found in the official registry.'}
                  </p>
                </div>
              </div>

              {verification.verified && verification.data && (
                <div className="p-5 space-y-0">
                  <div className="grid grid-cols-2 gap-0 divide-y divide-[#DCE5EF]">
                    {[
                      { label: 'Certificate No.', value: verification.data.certificateNo, mono: true },
                      { label: 'Cadet Name', value: verification.data.cadetName },
                      { label: 'Rank', value: verification.data.rank },
                      { label: 'Reg. No. (Masked)', value: verification.data.maskedRegNo, mono: true },
                      { label: 'Course / Exam', value: verification.data.courseName },
                      { label: 'Grade Awarded', value: verification.data.grade },
                      { label: 'Issue Date', value: verification.data.issueDate },
                      { label: 'Status', value: verification.data.status },
                      { label: 'Issuing Authority', value: verification.data.issuingAuthority },
                    ].map(({ label, value, mono }, i) => (
                      <div key={i} className="flex justify-between items-center py-2.5 px-1 text-xs odd:bg-[#F8FAFD] even:bg-white col-span-2">
                        <span className="text-[#607086] font-500">{label}</span>
                        <span className={`font-700 text-[#142238] text-right ${mono ? 'font-mono text-[11px]' : ''} ${label === 'Status' ? (value === 'ISSUED' ? 'text-[#21865B]' : 'text-[#C94A4A]') : ''} ${label === 'Grade Awarded' ? 'text-[#8B6200]' : ''}`}>
                          {value || '—'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-[#EAF0F8] rounded-xl border border-[#C7D9ED]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#21865B] flex-shrink-0" />
                      <p className="text-[11px] text-[#123B63] font-600">
                        Verified at {new Date(verification.data.verificationTimestamp || Date.now()).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!verification.verified && (
                <div className="p-6 text-center">
                  <XCircle className="w-8 h-8 text-[#C94A4A]/50 mx-auto mb-3" />
                  <p className="text-xs text-[#607086]">
                    If you believe this is an error, please contact your NCC Unit Administrator.
                  </p>
                  <button
                    onClick={() => { setCertInput(''); setSearched(false); setVerification(null); }}
                    className="mt-3 text-xs font-700 text-[#123B63] hover:underline"
                  >
                    Search another certificate
                  </button>
                </div>
              )}
            </div>
          )}

          {!searched && (
            <div className="bg-white border border-[#DCE5EF] rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#EAF0F8] flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-[#9BAEC0]" />
              </div>
              <p className="text-sm font-600 text-[#607086]">Enter a certificate number above to verify</p>
              <p className="text-xs text-[#9BAEC0] mt-1">Format: NCC-YYYY-TYPE-XXXX (e.g. NCC-2026-B-1234)</p>
            </div>
          )}

          <p className="text-center text-[11px] text-[#9BAEC0]">
            Official verification service of 1 MAH Battalion NCC, Mumbai.
            For QR scanning, use your device camera on any printed NCC Central certificate.
          </p>
        </div>
      </main>
    </div>
  );
};
