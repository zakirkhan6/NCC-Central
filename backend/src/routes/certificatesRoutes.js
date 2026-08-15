import express from 'express';
import { getCertificates, createCertificate, verifyCertificate, getCertificateQrCode } from '../controllers/certificatesController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getCertificates);
router.post('/', requireAuth, requireRole('ADMIN', 'ANO'), createCertificate);
router.get('/verify/:certNo', verifyCertificate);
router.get('/qr/:certNo', getCertificateQrCode);

export default router;
