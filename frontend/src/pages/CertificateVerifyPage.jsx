import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { ShieldCheck, ShieldAlert, ArrowLeft } from 'lucide-react';

export const CertificateVerifyPage = () => {
  const { certNo } = useParams();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const res = await api.get(`/certificates/verify/${certNo}`);
        setVerification(res.data);
      } catch (err) {
        setVerification({
          verified: false,
          message: err.response?.data?.message || 'Certificate Number Not Found in Official Registry'
        });
      } finally {
        setLoading(false);
      }
    };
    if (certNo) checkVerification();
  }, [certNo]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-6 text-[#172033]">
      <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-lg shadow-black/5 space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#12355B]">
          <ArrowLeft className="w-4 h-4" /> Back to NCC Central
        </Link>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#12355B] flex items-center justify-center font-black text-white text-lg mx-auto mb-3 shadow-md">
            NCC
          </div>
          <h2 className="text-xl font-extrabold text-[#172033]">Official Certificate Verification</h2>
          <p className="text-xs text-[#64748B]">1 MAH BATTALION NCC, MUMBAI</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#12355B] font-bold text-sm">
            Querying Battalion Certificate Registry Database...
          </div>
        ) : verification?.verified ? (
          <div className="p-6 rounded-2xl bg-[#E8F5EE] border border-[#2E7D5B]/30 space-y-4">
            <div className="flex items-center gap-2 text-[#1F6B45] font-bold text-sm">
              <ShieldCheck className="w-6 h-6" />
              <span>AUTHENTIC RECORD VERIFIED</span>
            </div>

            <div className="space-y-2 text-xs border-t border-[#2E7D5B]/20 pt-4">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Certificate No:</span>
                <span className="font-mono font-bold text-[#12355B]">{verification.data.certificateNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Cadet Name:</span>
                <span className="font-bold text-[#172033]">{verification.data.cadetName} ({verification.data.rank})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Masked Reg No:</span>
                <span className="font-mono text-[#172033] font-semibold">{verification.data.maskedRegNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Course / Exam:</span>
                <span className="font-bold text-[#172033]">{verification.data.courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Grade Awarded:</span>
                <span className="font-bold text-[#C58A00]">{verification.data.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Issuing Authority:</span>
                <span className="text-[#172033] font-medium">{verification.data.issuingAuthority}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#FDE8E8] border border-[#C94A4A]/30 text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-[#C94A4A] mx-auto" />
            <h3 className="text-sm font-bold text-[#C94A4A]">Verification Failed</h3>
            <p className="text-xs text-[#64748B]">{verification?.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
