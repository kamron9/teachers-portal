import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'express-async-errors';

import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { auditMiddleware } from './middleware/audit';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import teacherRoutes from './routes/teachers';
import studentRoutes from './routes/students';
import subjectRoutes from './routes/subjects';
import bookingRoutes from './routes/bookings';
import paymentRoutes from './routes/payments';
import messageRoutes from './routes/messages';
import reviewRoutes from './routes/reviews';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';
import notificationRoutes from './routes/notifications';
import reportRoutes from './routes/reports';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    error: 'RateLimitExceeded',
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
const apiVersion = `/api/${config.apiVersion}`;

// Public routes (no auth required)
app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/search`, searchRoutes);
app.use(`${apiVersion}/teachers/public`, teacherRoutes);

// Protected routes (auth required)
app.use(`${apiVersion}/users`, authMiddleware, auditMiddleware, userRoutes);
app.use(`${apiVersion}/teachers`, authMiddleware, auditMiddleware, teacherRoutes);
app.use(`${apiVersion}/students`, authMiddleware, auditMiddleware, studentRoutes);
app.use(`${apiVersion}/subjects`, authMiddleware, auditMiddleware, subjectRoutes);
app.use(`${apiVersion}/bookings`, authMiddleware, auditMiddleware, bookingRoutes);
app.use(`${apiVersion}/payments`, authMiddleware, auditMiddleware, paymentRoutes);
app.use(`${apiVersion}/messages`, authMiddleware, auditMiddleware, messageRoutes);
app.use(`${apiVersion}/reviews`, authMiddleware, auditMiddleware, reviewRoutes);
app.use(`${apiVersion}/notifications`, authMiddleware, auditMiddleware, notificationRoutes);
app.use(`${apiVersion}/reports`, authMiddleware, auditMiddleware, reportRoutes);

// Admin routes (admin auth required)
app.use(`${apiVersion}/admin`, authMiddleware, auditMiddleware, adminRoutes);

// Socket.IO for real-time features
io.use((socket, next) => {
  // Authenticate socket connections
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  // Verify token and attach user info
  next();
});

io.on('connection', (socket) => {
  logger.info('User connected to socket', { socketId: socket.id });
  
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    logger.info('User joined room', { socketId: socket.id, roomId });
  });

  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId);
    logger.info('User left room', { socketId: socket.id, roomId });
  });

  socket.on('disconnect', () => {
    logger.info('User disconnected from socket', { socketId: socket.id });
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const PORT = config.port || 3001;

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}${apiVersion}/docs`);
});

export { app, io };
