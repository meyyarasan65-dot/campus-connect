import crypto from 'crypto';
import { ApiError } from '../utils/ApiError.js';

// Middleware to set CSRF cookie
export const setCsrfToken = (req, res, next) => {
  if (!req.cookies['csrf-token']) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf-token', token, {
      httpOnly: false, // Needs to be readable by JS to attach to headers
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
  }
  next();
};

// Middleware to check CSRF header
export const checkCsrfToken = (req, res, next) => {
  // Safe methods don't need CSRF check
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies['csrf-token'];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new ApiError(403, 'Invalid CSRF token'));
  }

  next();
};
