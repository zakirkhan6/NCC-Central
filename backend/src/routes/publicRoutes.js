import express from 'express';
import {
  getPublicStatistics,
  getPublicOperations,
  verifyCertificatePublic,
  publicEnrollment
} from '../controllers/publicController.js';

const router = express.Router();

// Public statistical summary
router.get('/statistics', getPublicStatistics);

// Public battalion operations preview
router.get('/operations', getPublicOperations);

// Public certificate validation
router.get('/certificates/verify/:certificateNo', verifyCertificatePublic);

// Public cadet self-enrollment
router.post('/enrollment', publicEnrollment);

export default router;
