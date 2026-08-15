import express from 'express';
import { getAttendance, markBulkAttendance, getAttendanceStats } from '../controllers/attendanceController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getAttendance);
router.get('/stats', requireAuth, getAttendanceStats);
router.post('/bulk', requireAuth, requireRole('ADMIN', 'ANO'), markBulkAttendance);

export default router;
