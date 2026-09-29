import { redisClient } from '../config/redis.js';
import { ApiError } from '../utils/ApiError.js';

export const rateLimiterMiddleware = (type = 'global') => async (req, res, next) => {
  const limit = type === 'auth' ? 10 : 100; // 10 for auth, 100 for global
  const windowSeconds = 60; // 1 minute window
  
  // Use IP or User ID if authenticated
  const identifier = req.user ? req.user._id.toString() : req.ip;
  const key = `ratelimit:${type}:${identifier}`;
  
  const now = Date.now();
  const windowStart = now - (windowSeconds * 1000);

  try {
    const multi = redisClient.multi();
    
    // Remove requests older than the window
    multi.zRemRangeByScore(key, 0, windowStart);
    
    // Add current request
    multi.zAdd(key, { score: now, value: `${now}-${Math.random()}` });
    
    // Count requests in the current window
    multi.zCard(key);
    
    // Set expiry to avoid memory leak
    multi.expire(key, windowSeconds);

    const results = await multi.exec();
    
    // results[2] is the result of zCard
    const requestCount = results[2];

    if (requestCount > limit) {
      res.set('Retry-After', String(windowSeconds));
      return next(new ApiError(429, 'Too Many Requests'));
    }

    next();
  } catch (error) {
    console.error('Redis Rate Limiter Error:', error);
    // Fail closed or open? Failing open is better for UX, but closed for security. 
    // We'll fail open for development if Redis drops, or return 500. Let's return 500 for strictness.
    next(new ApiError(500, 'Internal Server Error'));
  }
};
