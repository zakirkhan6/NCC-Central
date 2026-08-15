import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { User, Mail, Phone, Shield, Building, Award, Upload, Camera, Check, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    unit: user?.unit || '1 MAH BATTALION NCC, MUMBAI',
    company: user?.company || 'ALPHA COY',
    designation: user?.designation || (user?.role === 'ADMIN' ? 'Battalion Commander' : user?.role === 'ANO' ? 'Associate NCC Officer' : 'Cadet'),
    avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
        showToast('New photo selected! Click Save to apply.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateUser) {
        await updateUser(formData);
      }
      setIsSaving(false);
      showToast('Profile information and photo saved successfully!', 'success');
    } catch (err) {
      setIsSaving(false);
      showToast('Failed to update profile', 'error');
    }
  };


  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
          <User className="w-5 h-5 text-[#12355B]" />
          My Official Profile
        </h2>
        <p className="text-xs text-[#64748B]">Manage your personal credentials, contact details and unit identity photo</p>
      </div>

      {/* Main Profile Card */}
      <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
        {/* Top Profile Photo & Quick Info Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#E2E8F0]">
          {/* Avatar with Overlay Camera Button */}
          <div className="relative group">
            <img
              src={formData.avatarUrl}
              alt={formData.fullName}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-[#E2E8F0] shadow-md"
            />
            <label className="absolute -bottom-2 -right-2 p-2 bg-[#12355B] text-white rounded-xl shadow-md hover:bg-[#1E4E79] cursor-pointer transition-all">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h3 className="text-2xl font-black text-[#172033]">{formData.fullName}</h3>
              <Badge variant={user?.role === 'ADMIN' ? 'gold' : user?.role === 'ANO' ? 'success' : 'primary'}>
                {user?.role}
              </Badge>
            </div>
            <p className="text-xs text-[#64748B] mt-1">{formData.designation}</p>
            <p className="text-[11px] text-[#12355B] font-semibold mt-0.5">{formData.unit} • {formData.company}</p>
          </div>

          {/* Upload Button at the side */}
          <div className="flex flex-col items-center gap-2">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EAF1F8] border border-[#C7D9ED] rounded-xl text-xs font-semibold text-[#12355B] hover:bg-[#D0E0F0] cursor-pointer transition-all shadow-sm">
              <Upload className="w-4 h-4 text-[#12355B]" />
              Upload New Photo
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <span className="text-[10px] text-[#94A3B8]">PNG, JPG, WebP up to 5MB</span>
          </div>
        </div>

        {/* Form Details */}
        <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Official Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Designation / Role Title</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Battalion Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Company Subdivision</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#E2E8F0]">
            <Button type="submit" isLoading={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
