import { dbStore } from '../store/index.js';

export const getSettings = (req, res) => {
  const settings = dbStore.getCollection('settings');
  return res.json({ success: true, data: settings });
};

export const updateSettings = (req, res) => {
  const currentSettings = dbStore.getCollection('settings');
  const updatedSettings = { ...currentSettings, ...req.body };
  dbStore.setCollection('settings', updatedSettings);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'SETTINGS_UPDATED',
    resource: 'System Settings',
    timestamp: new Date().toISOString(),
    details: 'Updated unit system configurations'
  });

  return res.json({ success: true, message: 'Settings saved successfully.', data: updatedSettings });
};
