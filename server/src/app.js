import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { setCsrfToken, checkCsrfToken } from './middleware/csrf.js';
import { rateLimiterMiddleware } from './middleware/rateLimiter.js';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import clubsRoutes from './modules/clubs/clubs.routes.js';
import contentRoutes from './modules/content/content.routes.js';
import eventsRoutes from './modules/events/events.routes.js';
import forumsRoutes from './modules/forums/forums.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import pointsRoutes from './modules/points/points.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';

const app = express();
app.set('trust proxy', 1);

// Global Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
app.use(rateLimiterMiddleware('global'));

// CSRF Protection
app.use(setCsrfToken);
app.use(checkCsrfToken);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/forums', forumsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/csrf-token', (req, res) => {
  res.status(200).json({ success: true, data: { csrfToken: req.csrfToken } });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'OK' } });
});

// 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

export { app };
