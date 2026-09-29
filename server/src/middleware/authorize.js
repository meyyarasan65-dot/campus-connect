import { ApiError } from '../utils/ApiError.js';
import { ROLE_PERMISSIONS, PERMISSIONS } from '../config/roles.js';

export const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    // System Admins have ALL permissions
    if (userPermissions.includes(PERMISSIONS.ALL)) {
      return next();
    }

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      console.log('Auth Failed:', { userRole, requiredPermissions, userPermissions, reqUser: req.user.email });
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }

    next();
  };
};

export const authorizeAny = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    if (userPermissions.includes(PERMISSIONS.ALL)) {
      return next();
    }

    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }

    next();
  };
};
