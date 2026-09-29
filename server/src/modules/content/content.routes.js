import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as contentController from './content.controller.js';
import { createAnnouncementSchema } from './content.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize, authorizeAny } from '../../middleware/authorize.js';
import { PERMISSIONS } from '../../config/roles.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(PERMISSIONS.ANNOUNCEMENTS_READ),
  asyncHandler(contentController.getAnnouncements)
);

router.post(
  '/',
  authorizeAny(PERMISSIONS.ANNOUNCEMENTS_CREATE, PERMISSIONS.ANNOUNCEMENTS_CREATE_OWN),
  validate(createAnnouncementSchema),
  asyncHandler(contentController.createAnnouncement)
);

router.put(
  '/:id',
  authorizeAny(PERMISSIONS.ANNOUNCEMENTS_CREATE, PERMISSIONS.ANNOUNCEMENTS_CREATE_OWN),
  asyncHandler(contentController.updateAnnouncement)
);

router.delete(
  '/:id',
  authorizeAny(PERMISSIONS.ANNOUNCEMENTS_CREATE, PERMISSIONS.ANNOUNCEMENTS_CREATE_OWN),
  asyncHandler(contentController.deleteAnnouncement)
);

router.put(
  '/:id/pin',
  authorize(PERMISSIONS.ANNOUNCEMENTS_CREATE), // Faculty or SystemAdmin only
  asyncHandler(contentController.togglePin)
);

export default router;
