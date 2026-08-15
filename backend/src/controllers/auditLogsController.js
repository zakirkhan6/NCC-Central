import { dbStore } from '../store/index.js';

export const getAuditLogs = (req, res) => {
  const logs = dbStore.getCollection('auditLogs');
  return res.json({ success: true, data: logs });
};
