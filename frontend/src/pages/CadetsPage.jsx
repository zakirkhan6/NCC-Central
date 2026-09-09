import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Search, Plus, User, Edit, Trash2, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const CadetsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [cadets, setCadets] = useState([]);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Cadet Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    regNo: '',
    phone: '',
    rank: 'Cadet',
    company: 'ALPHA COY',
    platoon: 'Platoon 1',
    bloodGroup: 'O+',
    avatarUrl: '',
    dateJoined: new Date().toISOString().split('T')[0]
  });

  // Edit Cadet Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCadet, setEditingCadet] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    regNo: '',
    phone: '',
    rank: 'Cadet',
    company: 'ALPHA COY',
    platoon: 'Platoon 1',
    bloodGroup: 'O+',
    avatarUrl: '',
    status: 'ACTIVE',
    dateJoined: '',
    dob: '',
    gender: 'Male',
    fatherName: '',
    collegeName: '',
    course: '',
    yearOfStudy: ''
  });

  // Delete Cadet Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cadetToDelete, setCadetToDelete] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchCadets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cadets', {
        params: { search, company: companyFilter }
      });
      if (res.data?.success) {
        setCadets(res.data.data.cadets);
      }
    } catch (err) {
      console.error("Fetch cadets error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCadets();
  }, [search, companyFilter]);

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditFormData(prev => ({ ...prev, avatarUrl: reader.result }));
        } else {
          setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
        }
        showToast('Cadet photo selected!', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCadet = async (e) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      await api.post('/cadets', formData);
      showToast('Cadet record added successfully!', 'success');
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        regNo: '',
        phone: '',
        rank: 'Cadet',
        company: 'ALPHA COY',
        platoon: 'Platoon 1',
        bloodGroup: 'O+',
        avatarUrl: '',
        dateJoined: new Date().toISOString().split('T')[0]
      });
      fetchCadets();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add cadet', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Open Edit Modal with Cadet Data
  const handleOpenEdit = (cadet) => {
    setEditingCadet(cadet);
    setEditFormData({
      fullName: cadet.fullName || '',
      email: cadet.email || '',
      regNo: cadet.regNo || '',
      phone: cadet.phone || '',
      rank: cadet.rank || 'Cadet',
      company: cadet.company || 'ALPHA COY',
      platoon: cadet.platoon || 'Platoon 1',
      bloodGroup: cadet.bloodGroup || 'O+',
      avatarUrl: cadet.avatarUrl || '',
      status: cadet.status || 'ACTIVE',
      dateJoined: cadet.dateJoined || '',
      dob: cadet.dob || '',
      gender: cadet.gender || 'Male',
      fatherName: cadet.fatherName || '',
      collegeName: cadet.collegeName || 'Rizvi College of Arts, Science & Commerce',
      course: cadet.course || '',
      yearOfStudy: cadet.yearOfStudy || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCadet = async (e) => {
    e.preventDefault();
    if (!editingCadet) return;
    setIsActionLoading(true);
    try {
      const res = await api.put(`/cadets/${editingCadet.id}`, editFormData);
      if (res.data?.success) {
        showToast('Cadet details updated & synced with database!', 'success');
        setIsEditModalOpen(false);
        setEditingCadet(null);
        fetchCadets();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update cadet profile', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (cadet) => {
    setCadetToDelete(cadet);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCadet = async () => {
    if (!cadetToDelete) return;
    setIsActionLoading(true);
    try {
      const res = await api.delete(`/cadets/${cadetToDelete.id}`);
      if (res.data?.success) {
        showToast(`Cadet ${cadetToDelete.fullName} (${cadetToDelete.regNo}) deleted from database.`, 'success');
        setIsDeleteModalOpen(false);
        setCadetToDelete(null);
        fetchCadets();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete cadet record', 'error');
    } finally {
      setIsActionLoading(false);
    }
  };

  const isAuthorizedToManage = user?.role === 'ADMIN' || user?.role === 'ANO';
  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">Cadets Roster & Management</h2>
          <p className="text-xs text-[#64748B]">Total Unit Cadets Registered: {cadets.length}</p>
        </div>
        {isAuthorizedToManage && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Cadet
          </Button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by cadet name, Reg No, email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]"
          />
        </div>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]"
        >
          <option value="">All Companies</option>
          <option value="ALPHA COY">ALPHA COY</option>
          <option value="BRAVO COY">BRAVO COY</option>
          <option value="CHARLIE COY">CHARLIE COY</option>
        </select>
      </div>

      {/* Cadets Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4">Cadet Name & Reg No</th>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Company & Platoon</th>
                <th className="px-6 py-4">Contact Phone</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#172033]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#12355B]">Loading cadet roster...</td>
                </tr>
              ) : cadets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#94A3B8]">No cadet records matching criteria.</td>
                </tr>
              ) : (
                cadets.map(cadet => (
                  <tr key={cadet.id} className="hover:bg-[#F1F5F9] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={cadet.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                        alt="Cadet Avatar"
                        className="w-9 h-9 rounded-xl object-cover border border-[#E2E8F0] shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-[#172033]">{cadet.fullName}</div>
                        <div className="text-[10px] text-[#12355B] font-mono">{cadet.regNo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="gold">{cadet.rank}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#172033]">{cadet.company}</div>
                      <div className="text-[10px] text-[#64748B]">{cadet.platoon}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#64748B]">{cadet.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <Badge variant="danger">{cadet.bloodGroup}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <Link to={`/cadets/${cadet.id}`}>
                          <Button variant="secondary" size="sm" className="gap-1 px-2.5 py-1 text-xs">
                            <User className="w-3.5 h-3.5 text-[#12355B]" />
                            <span className="hidden sm:inline">Profile</span>
                          </Button>
                        </Link>
                        {isAuthorizedToManage && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenEdit(cadet)}
                              className="gap-1 px-2.5 py-1 text-xs text-[#12355B] hover:bg-[#EAF1F8] border-[#CBD5E1]"
                              title="Edit Cadet"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#12355B]" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleOpenDelete(cadet)}
                              className="gap-1 px-2.5 py-1 text-xs"
                              title="Delete Cadet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cadet Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Cadet Record">
        <form onSubmit={handleCreateCadet} className="grid grid-cols-2 gap-4 text-xs">
          {/* Avatar Upload Area */}
          <div className="col-span-2 flex items-center gap-4 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <img
              src={formData.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
              alt="Avatar Preview"
              className="w-14 h-14 rounded-xl object-cover border border-[#CBD5E1]"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#172033] mb-1">Cadet Photograph</label>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#12355B] hover:bg-[#F1F5F9] cursor-pointer shadow-sm">
                <Upload className="w-3.5 h-3.5 text-[#12355B]" />
                Upload Photo
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" />
              </label>
              <p className="text-[10px] text-[#94A3B8] mt-1">Passport style photo</p>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-[#172033] mb-1 font-semibold">Full Name *</label>
            <input type="text" value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={inputClass} required />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Email *</label>
            <input type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass} required />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Regimental No (Reg No) *</label>
            <input type="text" value={formData.regNo}
              onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
              className={`${inputClass} uppercase`} required />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Rank</label>
            <select value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              className={inputClass}>
              <option value="Cadet">Cadet</option>
              <option value="Lance Corporal">Lance Corporal</option>
              <option value="Corporal">Corporal</option>
              <option value="Sergeant">Sergeant</option>
              <option value="Under Officer">Under Officer</option>
              <option value="Senior Under Officer">Senior Under Officer</option>
            </select>
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Company</label>
            <select value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={inputClass}>
              <option value="ALPHA COY">ALPHA COY</option>
              <option value="BRAVO COY">BRAVO COY</option>
              <option value="CHARLIE COY">CHARLIE COY</option>
            </select>
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isActionLoading}>Add Cadet</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Cadet Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Cadet Profile — ${editingCadet?.fullName || ''}`}>
        <form onSubmit={handleUpdateCadet} className="grid grid-cols-2 gap-4 text-xs">
          {/* Avatar Upload / Preview */}
          <div className="col-span-2 flex items-center gap-4 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <img
              src={editFormData.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
              alt="Avatar Preview"
              className="w-14 h-14 rounded-xl object-cover border border-[#CBD5E1]"
            />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#172033] mb-1">Update Photograph</label>
              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#12355B] hover:bg-[#F1F5F9] cursor-pointer shadow-sm">
                <Upload className="w-3.5 h-3.5 text-[#12355B]" />
                Change Photo
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
              </label>
              <p className="text-[10px] text-[#94A3B8] mt-1">Synced to database profile</p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Full Name *</label>
            <input
              type="text"
              value={editFormData.fullName}
              onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
              className={inputClass}
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Email *</label>
            <input
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              className={inputClass}
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Regimental No (Reg No) *</label>
            <input
              type="text"
              value={editFormData.regNo}
              onChange={(e) => setEditFormData({ ...editFormData, regNo: e.target.value })}
              className={`${inputClass} uppercase`}
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Contact Phone</label>
            <input
              type="text"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Rank</label>
            <select
              value={editFormData.rank}
              onChange={(e) => setEditFormData({ ...editFormData, rank: e.target.value })}
              className={inputClass}
            >
              <option value="Cadet">Cadet</option>
              <option value="Lance Corporal">Lance Corporal</option>
              <option value="Corporal">Corporal</option>
              <option value="Sergeant">Sergeant</option>
              <option value="Under Officer">Under Officer</option>
              <option value="Senior Under Officer">Senior Under Officer</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Company</label>
            <select
              value={editFormData.company}
              onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
              className={inputClass}
            >
              <option value="ALPHA COY">ALPHA COY</option>
              <option value="BRAVO COY">BRAVO COY</option>
              <option value="CHARLIE COY">CHARLIE COY</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Platoon</label>
            <input
              type="text"
              value={editFormData.platoon}
              onChange={(e) => setEditFormData({ ...editFormData, platoon: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Blood Group</label>
            <select
              value={editFormData.bloodGroup}
              onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
              className={inputClass}
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Status</label>
            <select
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              className={inputClass}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Date Joined</label>
            <input
              type="date"
              value={editFormData.dateJoined}
              onChange={(e) => setEditFormData({ ...editFormData, dateJoined: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Course & Discipline</label>
            <input
              type="text"
              value={editFormData.course}
              placeholder="e.g. B.Sc Computer Science"
              onChange={(e) => setEditFormData({ ...editFormData, course: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[#172033] mb-1 font-semibold">Year of Study</label>
            <input
              type="text"
              value={editFormData.yearOfStudy}
              placeholder="e.g. 2nd Year"
              onChange={(e) => setEditFormData({ ...editFormData, yearOfStudy: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="col-span-2 flex justify-end gap-2 mt-4 pt-3 border-t border-[#E2E8F0]">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isActionLoading} className="gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Save & Sync Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Cadet Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Cadet Record Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl text-xs text-[#9F1239]">
            <AlertTriangle className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-[#9F1239]">Warning: Permanent Action</p>
              <p className="mt-1 leading-relaxed text-[#BE123C]">
                Are you sure you want to delete this cadet? This will permanently remove their records, profile links, and associated activity from the system and database.
              </p>
            </div>
          </div>

          {cadetToDelete && (
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={cadetToDelete.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                  alt={cadetToDelete.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#CBD5E1]"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#172033]">{cadetToDelete.fullName}</h4>
                  <p className="text-[11px] font-mono text-[#12355B]">{cadetToDelete.regNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0] text-[#64748B]">
                <span>{cadetToDelete.rank}</span>
                <span>•</span>
                <span>{cadetToDelete.company}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteCadet}
              isLoading={isActionLoading}
              className="gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Yes, Delete Cadet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
