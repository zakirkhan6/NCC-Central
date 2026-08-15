import express from 'express';
import { getParades, createParade, updateParade, deleteParade } from '../controllers/paradesController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getParades);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO'), createParade);
router.put('/:id', requireAuth, requireRole('ADMIN', 'ANO'), updateParade);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'ANO'), deleteParade);

export default router;
