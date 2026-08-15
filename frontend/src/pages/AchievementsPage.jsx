import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Award, Plus, Calendar, Trophy } from 'lucide-react';

export const AchievementsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [achievements, setAchievements] = useState([]);
  const [cadets, setCadets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    cadetId: '',
    title: '',
    category: 'Sports / Marksmanship',
    description: '',
    date: new Date().toISOString().split('T')[0],
    level: 'State',
    position: '1st Place (Gold)',
    organization: 'NCC Directorate'
  });

  const fetchData = async () => {
    try {
      const [achRes, cadRes] = await Promise.all([
        api.get('/achievements'),
        api.get('/cadets')
      ]);
      if (achRes.data?.success) setAchievements(achRes.data.data);
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/achievements', formData);
      showToast('Achievement recorded successfully!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Failed to record achievement', 'error');
    }
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'ANO';
  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">Cadet Honors & Achievements</h2>
          <p className="text-xs text-[#64748B]">National, State, Directorate & Battalion Medals</p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Record Achievement
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-[#12355B] font-bold text-sm">Loading honors list...</div>
        ) : (
          achievements.map(ach => (
            <div key={ach.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="gold">{ach.category}</Badge>
                <span className="text-xs text-[#12355B] font-mono">{ach.date}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172033] flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#D4A72C]" />
                  {ach.title}
                </h3>
                <p className="text-xs text-[#12355B] font-semibold mt-1">Awardee: {ach.cadetName}</p>
              </div>
              <p className="text-xs text-[#64748B]">{ach.description}</p>
              <div className="text-[11px] text-[#94A3B8] pt-3 border-t border-[#E2E8F0] flex justify-between">
                <span>{ach.level} Level</span>
                <span>Position: {ach.position}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Cadet Achievement">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Select Cadet *</label>
            <select value={formData.cadetId}
              onChange={(e) => setFormData({ ...formData, cadetId: e.target.value })}
              className={inputClass} required>
              <option value="">Choose Cadet...</option>
              {cadets.map(c => (
                <option key={c.id} value={c.id}>{c.fullName} ({c.regNo})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Achievement Title *</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Gold Medal in State Shooting Championship"
              className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Level</label>
              <input type="text" value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Position / Rank</label>
              <input type="text" value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Record Achievement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
