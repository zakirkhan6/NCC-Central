import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Megaphone, Plus, BellRing } from 'lucide-react';

export const AnnouncementsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'URGENT',
    audience: 'All'
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      if (res.data?.success) setAnnouncements(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', formData);
      showToast('Announcement published and notifications dispatched!', 'success');
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      showToast('Failed to publish announcement', 'error');
    }
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'ANO';
  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">Battalion Circulars & Announcements</h2>
          <p className="text-xs text-[#64748B]">Official notices for cadets, officers and staff</p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Announcement
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-[#12355B] font-bold text-sm">Loading announcements...</div>
        ) : (
          announcements.map(a => (
            <div key={a.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={a.priority === 'URGENT' ? 'danger' : 'warning'}>{a.priority}</Badge>
                  <Badge variant="primary">Target: {a.audience}</Badge>
                </div>
                <span className="text-xs text-[#94A3B8] font-mono">{a.publishDate}</span>
              </div>

              <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#12355B]" />
                {a.title}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{a.content}</p>
              <div className="text-[10px] text-[#94A3B8] pt-2 border-t border-[#E2E8F0]">
                Author: {a.author}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Official Circular">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Title *</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Priority</label>
              <select value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={inputClass}>
                <option value="NORMAL">NORMAL</option>
                <option value="IMPORTANT">IMPORTANT</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Audience</label>
              <select value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className={inputClass}>
                <option value="All">All Unit Members</option>
                <option value="Cadets">Cadets Only</option>
                <option value="Officers">Officers Only</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Notice Content *</label>
            <textarea value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className={`${inputClass} h-28`} required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Broadcast Circular</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
