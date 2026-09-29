import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as clubsController from './clubs.controller.js';
import { createClubSchema, updateClubSchema } from './clubs.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { isClubAdminOf } from '../../middleware/scopeCheck.js';
import { PERMISSIONS } from '../../config/roles.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(PERMISSIONS.CLUBS_READ),
  asyncHandler(clubsController.getAllClubs)
);

router.get(
  '/:clubId',
  authorize(PERMISSIONS.CLUBS_READ),
  asyncHandler(clubsController.getClubById)
);

router.post(
  '/',
  authorize(PERMISSIONS.CLUBS_CREATE),
  validate(createClubSchema),
  asyncHandler(clubsController.createClub)
);

router.put(
  '/:clubId',
  authorize(PERMISSIONS.CLUBS_UPDATE_OWN),
  isClubAdminOf('clubId'),
  validate(updateClubSchema),
  asyncHandler(clubsController.updateClub)
);

router.delete(
  '/:clubId',
  authorize(PERMISSIONS.CLUBS_DELETE),
  asyncHandler(clubsController.deleteClub)
);

// Join/Leave club (Student action)
router.post(
  '/:clubId/join',
  authorize(PERMISSIONS.CLUBS_READ),
  asyncHandler(clubsController.joinClub)
);

router.post(
  '/:clubId/leave',
  authorize(PERMISSIONS.CLUBS_READ),
  asyncHandler(clubsController.leaveClub)
);

// Manage members (Admin action)
router.post(
  '/:clubId/members/:userId',
  authorize(PERMISSIONS.CLUBS_MEMBER_APPROVE_OWN),
  isClubAdminOf('clubId'),
  asyncHandler(clubsController.approveMember)
);

router.delete(
  '/:clubId/members/:userId',
  authorize(PERMISSIONS.CLUBS_MEMBER_APPROVE_OWN),
  isClubAdminOf('clubId'),
  asyncHandler(clubsController.removeMember)
);

export default router;
