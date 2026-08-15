import { dbStore } from '../store/index.js';

export const getNotifications = (req, res) => {
  const notifications = dbStore.getCollection('notifications');
  const userNotifs = notifications.filter(n => n.userId === req.user.id);
  return res.json({ success: true, data: userNotifs });
};

export const markNotificationRead = (req, res) => {
  const { id } = req.params;
  const updated = dbStore.updateItem('notifications', id, { read: true });
  return res.json({ success: true, data: updated });
};

export const markAllNotificationsRead = (req, res) => {
  const notifications = dbStore.getCollection('notifications');
  const updatedList = notifications.map(n => {
    if (n.userId === req.user.id) return { ...n, read: true };
    return n;
  });
  dbStore.setCollection('notifications', updatedList);
  return res.json({ success: true, message: 'All notifications marked as read.' });
};
