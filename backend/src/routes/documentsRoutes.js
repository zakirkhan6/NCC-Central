import express from 'express';
import { getDocuments, createDocument, deleteDocument } from '../controllers/documentsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getDocuments);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO'), createDocument);
router.delete('/:id', requireAuth, requireRole('ADMIN', 'ANO'), deleteDocument);

export default router;
