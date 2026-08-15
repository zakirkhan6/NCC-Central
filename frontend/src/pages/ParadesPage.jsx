import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Calendar, Plus, MapPin, Clock, UserCheck } from 'lucide-react';

export const ParadesPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [parades, setParades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    commander: user?.fullName || 'Capt. Roshan Khobragade',
    company: 'ALPHA COY',
    platoon: 'All Platoons',
    location: 'Main Parade Ground, Rizvi Campus',
    date: new Date().toISOString().split('T')[0],
    time: '07:00 AM',
    notes: ''
  });

  const fetchParades = async () => {
    try {
      const res = await api.get('/parades');
      if (res.data?.success) setParades(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParades();
  }, []);

  const handleCreateParade = async (e) => {
    e.preventDefault();
    try {
      await api.post('/parades', formData);
      showToast('Parade fallin scheduled!', 'success');
      setIsModalOpen(false);
      fetchParades();
    } catch (err) {
      showToast('Failed to schedule parade', 'error');
    }
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'ANO';
  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">Parade Schedule & Fallin Manager</h2>
          <p className="text-xs text-[#64748B]">Unit ceremonial parades and drill orders</p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Schedule Parade
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-[#12355B] font-bold text-sm">Loading parades...</div>
        ) : (
          parades.map(p => (
            <div key={p.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={p.status === 'COMPLETED' ? 'default' : 'gold'}>{p.status}</Badge>
                <div className="flex items-center gap-1.5 text-xs text-[#12355B] font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{p.date} @ {p.time}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#172033]">{p.title}</h3>
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <MapPin className="w-4 h-4 text-[#94A3B8]" />
                <span>{p.location}</span>
              </div>
              <div className="text-xs text-[#64748B] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                <span className="font-semibold text-[#172033] block mb-0.5">Parade Notes:</span>
                {p.notes || 'No specific squad notes.'}
              </div>
              <div className="text-[11px] text-[#94A3B8] flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                <span>Commander: {p.commander}</span>
                <span>{p.company} • {p.platoon}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Parade Fallin">
        <form onSubmit={handleCreateParade} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Parade Title *</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Independence Day Rehearsal Parade"
              className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Date *</label>
              <input type="date" value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Time *</label>
              <input type="text" value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={inputClass} required />
            </div>
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Location</label>
            <input type="text" value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClass} />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Notes / Orders</label>
            <textarea value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={`${inputClass} h-20`} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Publish Parade Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
