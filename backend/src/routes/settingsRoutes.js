import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getSettings);
router.put('/', requireAuth, requireRole('ADMIN'), updateSettings);

export default router;
