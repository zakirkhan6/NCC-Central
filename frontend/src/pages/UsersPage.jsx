import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { UserCheck, Plus, Upload, Camera } from 'lucide-react';

export const UsersPage = () => {
  const { showToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ANO',
    phone: '',
    designation: 'Associate NCC Officer',
    avatarUrl: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      if (res.data?.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
        showToast('Photo selected successfully!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      showToast('New system user created!', 'success');
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'ANO',
        phone: '',
        designation: 'Associate NCC Officer',
        avatarUrl: ''
      });
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">User Role & Privileges Management</h2>
          <p className="text-xs text-[#64748B]">Admin, Officers/ANOs and Staff Accounts</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Officer Account
        </Button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold border-b border-[#E2E8F0]">
            <tr>
              <th className="px-6 py-4">User Name & Email</th>
              <th className="px-6 py-4">System Role</th>
              <th className="px-6 py-4">Designation</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-[#172033]">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-[#12355B]">Loading user accounts...</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="hover:bg-[#F1F5F9] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img 
                      src={u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
                      alt="Avatar" 
                      className="w-9 h-9 rounded-xl object-cover border border-[#E2E8F0] shadow-sm" 
                    />
                    <div>
                      <div className="font-bold text-[#172033]">{u.fullName}</div>
                      <div className="text-[10px] text-[#64748B]">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'ADMIN' ? 'gold' : u.role === 'ANO' ? 'success' : 'primary'}>{u.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-[#64748B]">{u.designation || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>{u.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Officer Account">
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          {/* Avatar Upload Area */}
          <div className="flex items-center gap-4 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <img
              src={formData.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
              alt="Avatar Preview"
              className="w-14 h-14 rounded-xl object-cover border border-[#CBD5E1]"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#172033] mb-1">Officer Photo</label>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#12355B] hover:bg-[#F1F5F9] cursor-pointer shadow-sm">
                <Upload className="w-3.5 h-3.5 text-[#12355B]" />
                Upload New Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <p className="text-[10px] text-[#94A3B8] mt-1">PNG, JPG, WebP up to 5MB</p>
            </div>
          </div>

          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">System Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={inputClass}
            >
              <option value="ANO">ANO / Officer</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
