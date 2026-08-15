import express from 'express';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controllers/achievementsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getAchievements);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO'), createAchievement);
router.put('/:id', requireAuth, requireRole('ADMIN', 'ANO'), updateAchievement);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'ANO'), deleteAchievement);

export default router;
