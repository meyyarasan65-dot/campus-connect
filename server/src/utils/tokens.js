import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = () => {
  const token = crypto.randomBytes(40).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return { token, hash, expiresAt };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const hashRefreshToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
