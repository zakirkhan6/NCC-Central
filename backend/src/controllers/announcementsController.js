import { dbStore } from '../store/index.js';

export const getAnnouncements = (req, res) => {
  const announcements = dbStore.getCollection('announcements');
  return res.json({ success: true, data: announcements });
};

export const createAnnouncement = (req, res) => {
  const { title, content, priority, audience } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and Content are required.' });
  }

  const newAnnouncement = {
    id: `anc-${Date.now()}`,
    title,
    content,
    priority: priority || 'NORMAL',
    audience: audience || 'All',
    publishDate: new Date().toISOString().split('T')[0],
    author: req.user.fullName
  };

  dbStore.addItem('announcements', newAnnouncement);

  // Generate automated notifications for audience
  const users = dbStore.getCollection('users');
  users.forEach(u => {
    if (audience === 'All' || (audience === 'Cadets' && u.role === 'CADET') || (audience === 'Officers' && u.role === 'ANO')) {
      dbStore.addItem('notifications', {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId: u.id,
        title: `Announcement: ${title}`,
        message: content.substring(0, 100) + '...',
        read: false,
        timestamp: new Date().toISOString(),
        type: 'ANNOUNCEMENT'
      });
    }
  });

  dbStore.addItem('auditLogs', {
    id: `log-${Date.now()}`,
    user: req.user.fullName,
    role: req.user.role,
    action: 'ANNOUNCEMENT_PUBLISHED',
    resource: `Announcement (${title})`,
    timestamp: new Date().toISOString(),
    details: `Published announcement for audience: ${audience}`
  });

  return res.status(201).json({ success: true, message: 'Announcement published.', data: newAnnouncement });
};

export const deleteAnnouncement = (req, res) => {
  const { id } = req.params;
  dbStore.deleteItem('announcements', id);
  return res.json({ success: true, message: 'Announcement deleted.' });
};
