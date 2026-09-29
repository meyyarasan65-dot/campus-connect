import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as usersController from './users.controller.js';
import { updateProfileSchema } from './users.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { PERMISSIONS } from '../../config/roles.js';

const router = Router();

router.use(authenticate);

router.get(
  '/me',
  authorize(PERMISSIONS.PROFILES_READ),
  asyncHandler(usersController.getMyProfile)
);

router.put(
  '/me',
  authorize(PERMISSIONS.PROFILES_UPDATE_OWN),
  validate(updateProfileSchema),
  asyncHandler(usersController.updateMyProfile)
);

router.get(
  '/:userId',
  authorize(PERMISSIONS.PROFILES_READ),
  asyncHandler(usersController.getUserProfile)
);

// Role Management (System Admin only)
router.get(
  '/',
  authorize(PERMISSIONS.USERS_MANAGE),
  asyncHandler(usersController.getAllUsers)
);

router.put(
  '/:userId/role',
  authorize(PERMISSIONS.USERS_MANAGE),
  asyncHandler(usersController.updateUserRole)
);

export default router;
