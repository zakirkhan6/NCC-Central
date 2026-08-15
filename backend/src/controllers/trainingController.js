import { dbStore } from '../store/index.js';

export const getTraining = (req, res) => {
  const training = dbStore.getCollection('training');
  return res.json({ success: true, data: training });
};

export const createTraining = (req, res) => {
  const { title, category, instructor, date, time, location, description } = req.body;
  if (!title || !category || !date) {
    return res.status(400).json({ success: false, message: 'Title, Category, and Date are required.' });
  }

  const newTraining = {
    id: `trg-${Date.now()}`,
    title,
    category,
    instructor: instructor || req.user.fullName,
    date,
    time: time || '08:00 AM - 10:00 AM',
    location: location || 'Training Hall',
    description: description || '',
    status: 'SCHEDULED'
  };

  dbStore.addItem('training', newTraining);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'TRAINING_CREATED',
    resource: `Training (${title})`,
    timestamp: new Date().toISOString(),
    details: `Created training session under ${category}`
  });

  return res.status(201).json({ success: true, message: 'Training session created.', data: newTraining });
};

export const updateTraining = (req, res) => {
  const { id } = req.params;
  const updated = dbStore.updateItem('training', id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Training session not found.' });
  return res.json({ success: true, message: 'Training updated.', data: updated });
};

export const deleteTraining = (req, res) => {
  const { id } = req.params;
  dbStore.deleteItem('training', id);
  return res.json({ success: true, message: 'Training session deleted.' });
};
