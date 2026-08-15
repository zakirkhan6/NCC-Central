import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Calendar, Plus, MapPin, Users, CheckCircle2 } from 'lucide-react';

export const EventsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Camp',
    date: new Date().toISOString().split('T')[0],
    time: '08:00 AM',
    location: 'HQ 1 MAH Battalion, Kalina',
    capacity: 50,
    eligibility: 'Open to All Cadets',
    description: ''
  });

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      if (res.data?.success) setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      showToast('Event/Camp published successfully!', 'success');
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      showToast('Failed to publish event', 'error');
    }
  };

  const handleEnroll = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/register`);
      showToast('Successfully enrolled for event!', 'success');
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Enrollment failed', 'error');
    }
  };

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'ANO';
  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">National Camps, Events & Competitions</h2>
          <p className="text-xs text-[#64748B]">TSC, RDC, EBSB, Social Services & Battalion Drives</p>
        </div>
        {isAuthorized && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Event / Camp
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-[#12355B] font-bold text-sm">Loading camps & events...</div>
        ) : (
          events.map(evt => {
            const isRegistered = evt.registrations?.includes(user?.cadetId);
            return (
              <div key={evt.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gold">{evt.category}</Badge>
                  <span className="text-xs text-[#12355B] font-mono">{evt.date} @ {evt.time}</span>
                </div>
                <h3 className="text-lg font-bold text-[#172033]">{evt.title}</h3>
                <p className="text-xs text-[#64748B]">{evt.description}</p>
                
                <div className="flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#E2E8F0]">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#94A3B8]" /> {evt.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-[#94A3B8]" /> Max Capacity: {evt.capacity}</span>
                </div>

                {user?.role === 'CADET' && (
                  <div className="pt-2">
                    {isRegistered ? (
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D5B]">
                        <CheckCircle2 className="w-4 h-4" /> You are enrolled in this camp
                      </div>
                    ) : (
                      <Button onClick={() => handleEnroll(evt.id)} size="sm" className="w-full">
                        Enroll in Event
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event or Camp Drive">
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Event Title *</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#172033] mb-1 font-semibold">Category</label>
              <select value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClass}>
                <option value="Camp">Camp (TSC / RDC / CATC)</option>
                <option value="Competition">Competition</option>
                <option value="Social Service">Social Service Drive</option>
                <option value="National Awareness">National Awareness</option>
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
            <label className="block text-[#172033] mb-1 font-semibold">Location *</label>
            <input type="text" value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClass} required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Publish Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
