import express from 'express';
import { getReportsSummary, exportCadetsCsv, exportAttendanceCsv } from '../controllers/reportsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', requireAuth, requireRole('ADMIN', 'ANO'), getReportsSummary);
router.get('/export/cadets', requireAuth, requireRole('ADMIN', 'ANO'), exportCadetsCsv);
router.get('/export/attendance', requireAuth, requireRole('ADMIN', 'ANO'), exportAttendanceCsv);

export default router;

