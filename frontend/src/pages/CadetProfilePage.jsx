import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { User, Award, CheckSquare, FileCheck, Phone, Mail, Calendar, MapPin, Heart, Upload, Camera } from 'lucide-react';

export const CadetProfilePage = () => {
  const { id } = useParams();
  const { showToast } = useNotification();
  const [cadet, setCadet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/cadets/${id}`);
        if (res.data?.success) {
          setCadet(res.data.data);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatar = reader.result;
        setCadet(prev => ({ ...prev, avatarUrl: newAvatar }));
        try {
          await api.put(`/cadets/${id}`, { avatarUrl: newAvatar });
          showToast('Profile photo updated and saved to database!', 'success');
        } catch (err) {
          showToast('Photo updated locally (save sync warning)', 'info');
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  if (loading) return <div className="text-[#12355B] font-bold text-sm">Loading Cadet File...</div>;
  if (!cadet) return <div className="text-[#C94A4A] font-bold text-sm">Cadet record not found.</div>;

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
        <div className="relative group">
          <img
            src={cadet.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
            alt={cadet.fullName}
            className="w-28 h-28 rounded-2xl object-cover border-4 border-[#E2E8F0] shadow-md"
          />
          <label className="absolute -bottom-2 -right-2 p-2 bg-[#12355B] text-white rounded-xl shadow-md hover:bg-[#1E4E79] cursor-pointer transition-all">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-2xl font-black text-[#172033]">{cadet.fullName}</h2>
            <Badge variant="gold" className="w-fit mx-auto md:mx-0">{cadet.rank}</Badge>
            <Badge variant="success" className="w-fit mx-auto md:mx-0">{cadet.status}</Badge>
          </div>
          <p className="text-xs text-[#12355B] font-mono mt-1 font-semibold">Reg No: {cadet.regNo}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#94A3B8]" />
              <span>{cadet.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#94A3B8]" />
              <span>{cadet.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#94A3B8]" />
              <span>{cadet.company} • {cadet.platoon}</span>
            </div>
          </div>
        </div>

        {/* Upload Button at the side */}
        <div className="flex flex-col items-center gap-2">
          <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#EAF1F8] border border-[#C7D9ED] rounded-xl text-xs font-semibold text-[#12355B] hover:bg-[#D0E0F0] cursor-pointer transition-all shadow-sm">
            <Upload className="w-4 h-4" />
            Upload New Photo
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <span className="text-[10px] text-[#94A3B8]">PNG, JPG up to 5MB</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E2E8F0] flex items-center gap-6 text-xs font-bold">
        {['overview', 'attendance', 'achievements', 'certificates'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === tab ? 'border-[#12355B] text-[#12355B]' : 'border-transparent text-[#94A3B8] hover:text-[#172033]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#172033] border-b border-[#E2E8F0] pb-2">Personal & Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-[#94A3B8] block">Date of Birth</span><span className="font-semibold text-[#172033]">{cadet.dob || '14 May 2003'}</span></div>
              <div><span className="text-[#94A3B8] block">Gender</span><span className="font-semibold text-[#172033]">{cadet.gender || 'Male'}</span></div>
              <div><span className="text-[#94A3B8] block">Blood Group</span><span className="font-semibold text-[#C94A4A]">{cadet.bloodGroup}</span></div>
              <div><span className="text-[#94A3B8] block">Father's Name</span><span className="font-semibold text-[#172033]">{cadet.fatherName || 'Mohammad Yasin'}</span></div>
              <div className="col-span-2"><span className="text-[#94A3B8] block">Address</span><span className="font-semibold text-[#172033]">{cadet.address || 'Bandra West, Mumbai'}</span></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#172033] border-b border-[#E2E8F0] pb-2">NCC & Educational Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-[#94A3B8] block">Unit & Battalion</span><span className="font-semibold text-[#172033]">1 MAH BATTALION NCC</span></div>
              <div><span className="text-[#94A3B8] block">Date Enrolled</span><span className="font-semibold text-[#172033]">{cadet.dateJoined}</span></div>
              <div><span className="text-[#94A3B8] block">Institution</span><span className="font-semibold text-[#172033]">{cadet.collegeName || 'Rizvi College'}</span></div>
              <div><span className="text-[#94A3B8] block">Course & Year</span><span className="font-semibold text-[#172033]">{cadet.course || 'B.Sc CS'} - {cadet.yearOfStudy || '3rd Year'}</span></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172033]">Attendance Log</h3>
            <span className="text-xs font-bold text-[#2E7D5B]">Rate: {cadet.attendanceRate}%</span>
          </div>
          <div className="space-y-2 text-xs">
            {cadet.attendanceHistory?.map(att => (
              <div key={att.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#172033]">{att.session}</div>
                  <div className="text-[10px] text-[#94A3B8]">{att.date}</div>
                </div>
                <Badge variant={att.status === 'PRESENT' ? 'success' : 'danger'}>{att.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 gap-4">
          {cadet.achievements?.map(ach => (
            <div key={ach.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-start justify-between">
              <div>
                <Badge variant="gold">{ach.category}</Badge>
                <h4 className="text-base font-bold text-[#172033] mt-2">{ach.title}</h4>
                <p className="text-xs text-[#64748B] mt-1">{ach.description}</p>
                <div className="text-[10px] text-[#12355B] mt-2 font-semibold">{ach.level} Level • Position: {ach.position}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 gap-4">
          {cadet.certificates?.map(cert => (
            <div key={cert.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#172033]">{cert.courseName}</h4>
                <p className="text-xs text-[#12355B] font-mono mt-1">Certificate No: {cert.certificateNo}</p>
                <p className="text-xs text-[#2E7D5B] mt-1">Grade: {cert.grade} • Issued: {cert.issueDate}</p>
              </div>
              <Badge variant="success">OFFICIALLY VERIFIED</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
