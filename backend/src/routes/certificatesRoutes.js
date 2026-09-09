import express from 'express';
import {
  getCertificates,
  getCertificateById,
  createCertificate,
  revokeCertificate,
  verifyCertificate,
  getCertificateQrCode
} from '../controllers/certificatesController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getCertificates);
router.get('/:id', requireAuth, getCertificateById);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO', 'OFFICER'), createCertificate);
router.put('/:id/revoke', requireAuth, requireRole('ADMIN', 'ANO', 'OFFICER'), revokeCertificate);
router.get('/verify/:certNo', verifyCertificate);
router.get('/qr/:certNo', getCertificateQrCode);

export default router;
