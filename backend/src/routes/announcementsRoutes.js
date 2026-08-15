import express from 'express';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getAnnouncements);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO'), createAnnouncement);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'ANO'), deleteAnnouncement);

export default router;
