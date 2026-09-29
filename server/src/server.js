import http from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { logger } from './utils/logger.js';
import { startAlumniTransitionJob } from './jobs/alumniTransition.job.js';
import { initSocket } from './sockets/socket.js';

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    // Start background jobs
    startAlumniTransitionJob();

    server.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
