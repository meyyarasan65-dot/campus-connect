import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!statusCode) {
    statusCode = 500;
  }
  
  if (env.NODE_ENV === 'development') {
    logger.error(err);
  } else if (statusCode === 500) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
