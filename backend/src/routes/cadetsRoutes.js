import express from 'express';
import { getCadets, getCadetById, createCadet, updateCadet, deleteCadet, toggleCadetStatus } from '../controllers/cadetsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getCadets);
router.get('/:id', requireAuth, getCadetById);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO'), createCadet);
router.put('/:id', requireAuth, requireRole('ADMIN', 'ANO'), updateCadet);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'ANO'), deleteCadet);
router.patch('/:id/status', requireAuth, requireRole('ADMIN', 'ANO'), toggleCadetStatus);

export default router;
