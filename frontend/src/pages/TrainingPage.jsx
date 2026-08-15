import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { BookOpen, Plus, Clock, MapPin, User } from 'lucide-react';

export const TrainingPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [trainingList, setTrainingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Drill',
    instructor: 'Sub. Major Singh',
    date: new Date().toISOString().split('T')[0],
    time: '08:00 AM - 10:00 AM',
    location: 'NCC Training Ground',
    description: ''
  });

  const fetchTraining = async () => {
    try {
      const res = await api.get('/training');
      if (res.data?.success) setTrainingList(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraining();
  }, []);

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    try {
      await api.post('/training', formData);
      showToast('Training module scheduled!', 'success');
      setIsModalOpen(false);
      fetchTraining();
    } catch (err) {
      showToast('Failed to schedule training', 'error');
    }
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'ANO';
  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">NCC Training & Syllabus Modules</h2>
          <p className="text-xs text-[#64748B]">Drill, Weapon Training, Map Reading, First Aid, Leadership</p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Training Module
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-[#12355B] font-bold text-sm">Loading training curriculum...</div>
        ) : (
          trainingList.map(t => (
            <div key={t.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="indigo">{t.category}</Badge>
                <span className="text-xs text-[#12355B] font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {t.date} ({t.time})
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#172033]">{t.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{t.description}</p>
              <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-3 border-t border-[#E2E8F0]">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {t.instructor}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t.location}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add NCC Training Module">
        <form onSubmit={handleCreateTraining} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Training Title *</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Advanced Map Reading & Compass Bearing"
              className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Category</label>
              <select value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClass}>
                <option value="Drill">Drill</option>
                <option value="Physical Training">Physical Training (PT)</option>
                <option value="Theory">Theory</option>
                <option value="Map Reading">Map Reading</option>
                <option value="First Aid">First Aid</option>
                <option value="Leadership">Leadership</option>
                <option value="Camp Preparation">Camp Preparation</option>
              </select>
            </div>
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Date *</label>
              <input type="date" value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputClass} required />
            </div>
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Description</label>
            <textarea value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${inputClass} h-20`} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Module</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
