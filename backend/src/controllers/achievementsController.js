import { dbStore } from '../store/index.js';

export const getAchievements = (req, res) => {
  const { cadetId } = req.query;
  let achievements = dbStore.getCollection('achievements');
  if (cadetId) achievements = achievements.filter(a => a.cadetId === cadetId);
  return res.json({ success: true, data: achievements });
};

export const createAchievement = (req, res) => {
  const { cadetId, title, category, description, date, level, position, organization, documentUrl } = req.body;
  if (!cadetId || !title || !date) {
    return res.status(400).json({ success: false, message: 'Cadet ID, Title, and Date are required.' });
  }

  const cadets = dbStore.getCollection('cadets');
  const cadet = cadets.find(c => c.id === cadetId);

  if (!cadet) return res.status(404).json({ success: false, message: 'Associated Cadet record not found.' });

  const newAchievement = {
    id: `ach-${Date.now()}`,
    cadetId: cadet.id,
    cadetName: cadet.fullName,
    title,
    category: category || 'General',
    description: description || '',
    date,
    level: level || 'Battalion',
    position: position || 'Participant',
    organization: organization || 'NCC India',
    documentUrl: documentUrl || ''
  };

  dbStore.addItem('achievements', newAchievement);

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'ACHIEVEMENT_RECORDED',
    resource: `Cadet (${cadet.regNo})`,
    timestamp: new Date().toISOString(),
    details: `Added achievement: ${title}`
  });

  return res.status(201).json({ success: true, message: 'Achievement recorded successfully.', data: newAchievement });
};

export const updateAchievement = (req, res) => {
  const { id } = req.params;
  const updated = dbStore.updateItem('achievements', id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Achievement not found.' });
  return res.json({ success: true, message: 'Achievement updated.', data: updated });
};

export const deleteAchievement = (req, res) => {
  const { id } = req.params;
  dbStore.deleteItem('achievements', id);
  return res.json({ success: true, message: 'Achievement record removed.' });
};
