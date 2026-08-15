import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import cadetsRoutes from './routes/cadetsRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import paradesRoutes from './routes/paradesRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import achievementsRoutes from './routes/achievementsRoutes.js';
import certificatesRoutes from './routes/certificatesRoutes.js';
import announcementsRoutes from './routes/announcementsRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import documentsRoutes from './routes/documentsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import auditLogsRoutes from './routes/auditLogsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting for auth routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NCC Central REST API Engine is fully operational.',
    system: 'NCC Central',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cadets', cadetsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/parades', paradesRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/settings', settingsRoutes);

// Global 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint ${req.originalUrl} not found.`,
    error: { code: 'NOT_FOUND' }
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
