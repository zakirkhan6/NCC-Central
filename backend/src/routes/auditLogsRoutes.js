import express from 'express';
import { getAuditLogs } from '../controllers/auditLogsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requireRole('ADMIN'), getAuditLogs);

export default router;
