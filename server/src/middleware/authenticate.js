import { verifyAccessToken } from '../utils/tokens.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyAccessToken(token);
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user || !req.user.isActive) {
        throw new ApiError(401, 'User no longer exists or is inactive');
      }
      
      next();
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};
