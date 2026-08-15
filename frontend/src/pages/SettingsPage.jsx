import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/common/Button';
import { Settings, Save } from 'lucide-react';

export const SettingsPage = () => {
  const { showToast } = useNotification();
  const [settings, setSettings] = useState({
    unitName: '1 MAH BATTALION NCC, MUMBAI - ALPHA COY',
    institutionName: 'Rizvi College of Arts, Science & Commerce',
    academicYear: '2026-2027',
    anoInCharge: 'Capt. Roshan Khobragade',
    contactEmail: 'ano@rizvincc.edu.in',
    contactPhone: '+91 99305 25095'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.success) setSettings(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/settings', settings);
      showToast('Unit settings updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full p-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[#172033] text-xs focus:outline-none focus:ring-2 focus:ring-[#12355B]/20 focus:border-[#12355B]";

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#12355B]" />
          Unit System Configurations
        </h2>
        <p className="text-xs text-[#64748B]">Institutional unit parameters and ANO in-charge details</p>
      </div>

      <form onSubmit={handleSave} className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4 text-xs">
        <div>
          <label className="block text-[#172033] mb-1 font-semibold">Unit Name *</label>
          <input
            type="text"
            value={settings.unitName}
            onChange={(e) => setSettings({ ...settings, unitName: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-[#172033] mb-1 font-semibold">Affiliated Institution</label>
          <input
            type="text"
            value={settings.institutionName}
            onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Academic Year</label>
            <input
              type="text"
              value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">ANO In-Charge</label>
            <input
              type="text"
              value={settings.anoInCharge}
              onChange={(e) => setSettings({ ...settings, anoInCharge: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[#172033] mb-1 font-semibold">Contact Phone</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" isLoading={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            Save Configurations
          </Button>
        </div>
      </form>
    </div>
  );
};
