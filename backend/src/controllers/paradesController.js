import { dbStore } from '../store/index.js';

export const getParades = (req, res) => {
  const parades = dbStore.getCollection('parades');
  return res.json({ success: true, data: parades });
};

export const createParade = (req, res) => {
  const { title, commander, company, platoon, location, date, time, notes } = req.body;
  if (!title || !date || !time) {
    return res.status(400).json({ success: false, message: 'Title, Date, and Time are required.' });
  }

  const newParade = {
    id: `prd-${Date.now()}`,
    title,
    commander: commander || req.user.fullName,
    company: company || 'ALPHA COY',
    platoon: platoon || 'All Platoons',
    location: location || 'Main Parade Ground',
    date,
    time,
    status: 'UPCOMING',
    notes: notes || ''
  };

  dbStore.addItem('parades', newParade);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'PARADE_CREATED',
    resource: `Parade (${title})`,
    timestamp: new Date().toISOString(),
    details: `Scheduled parade for ${date} at ${time}`
  });

  return res.status(201).json({ success: true, message: 'Parade scheduled successfully.', data: newParade });
};

export const updateParade = (req, res) => {
  const { id } = req.params;
  const updated = dbStore.updateItem('parades', id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Parade not found.' });
  }
  return res.json({ success: true, message: 'Parade updated.', data: updated });
};

export const deleteParade = (req, res) => {
  const { id } = req.params;
  dbStore.deleteItem('parades', id);
  return res.json({ success: true, message: 'Parade cancelled/deleted.' });
};
