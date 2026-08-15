import express from 'express';
import { getEvents, createEvent, updateEvent, registerForEvent, deleteEvent } from '../controllers/eventsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getEvents);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO'), createEvent);
router.put('/:id', requireAuth, requireRole('ADMIN', 'ANO'), updateEvent);
router.post('/:id/register', requireAuth, registerForEvent);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'ANO'), deleteEvent);

export default router;
