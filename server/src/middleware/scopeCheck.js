import { ApiError } from '../utils/ApiError.js';
import { Club } from '../models/Club.js';
import { ROLES } from '../config/roles.js';

/**
 * Checks if the user is a SystemAdmin. If so, bypasses the scope check.
 * Otherwise, verifies if the user is an admin of the specified club.
 */
export const isClubAdminOf = (paramKey = 'clubId') => {
  return async (req, res, next) => {
    try {
      if (req.user.role === ROLES.SYSTEM_ADMIN) {
        return next();
      }

      const clubId = req.params[paramKey] || req.body[paramKey];
      if (!clubId) {
        return next(new ApiError(400, `Club ID not provided in ${paramKey}`));
      }

      const club = await Club.findById(clubId);
      if (!club) {
        return next(new ApiError(404, 'Club not found'));
      }

      if (!club.admins.includes(req.user._id)) {
        return next(new ApiError(403, 'Forbidden: You are not an admin of this club'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Checks if the user is the owner of a resource, or a SystemAdmin.
 * Must be used AFTER loading the resource into req.resource or providing the owner ID.
 * Since loading resources varies, this is a generic check.
 */
export const isOwner = (ownerIdExtractor) => {
  return (req, res, next) => {
    if (req.user.role === ROLES.SYSTEM_ADMIN) {
      return next();
    }
    
    const ownerId = ownerIdExtractor(req);
    if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Forbidden: You do not own this resource'));
    }
    next();
  };
};

export const isSameDepartment = (departmentExtractor) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === ROLES.SYSTEM_ADMIN) {
        return next();
      }
      
      const targetDept = departmentExtractor(req);
      if (!targetDept) {
        return next(new ApiError(400, 'Department not provided for scope check'));
      }
      
      // Look up user's department from profile
      const { StudentProfile } = await import('../models/StudentProfile.js');
      const profile = await StudentProfile.findOne({ user: req.user._id });
      
      if (!profile || profile.department !== targetDept) {
        return next(new ApiError(403, 'Forbidden: You can only act within your own department'));
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
