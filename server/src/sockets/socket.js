import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on('join_thread', (threadId) => {
      socket.join(`thread_${threadId}`);
      logger.info(`Socket ${socket.id} joined thread ${threadId}`);
    });

    socket.on('leave_thread', (threadId) => {
      socket.leave(`thread_${threadId}`);
      logger.info(`Socket ${socket.id} left thread ${threadId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
