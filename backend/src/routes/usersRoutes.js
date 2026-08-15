import express from 'express';
import { getUsers, createUser, updateUserRole } from '../controllers/usersController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requireRole('ADMIN'), getUsers);
router.post('/', requireAuth, requireRole('ADMIN'), createUser);
router.patch('/:id/role', requireAuth, requireRole('ADMIN'), updateUserRole);

export default router;
