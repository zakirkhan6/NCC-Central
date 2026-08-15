import express from 'express';
import { getTraining, createTraining, updateTraining, deleteTraining } from '../controllers/trainingController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getTraining);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO'), createTraining);
router.put('/:id', requireAuth, requireRole('ADMIN', 'ANO'), updateTraining);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'ANO'), deleteTraining);

export default router;
