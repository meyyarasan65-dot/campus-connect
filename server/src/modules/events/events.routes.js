import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as eventsController from './events.controller.js';
import { createEventSchema } from './events.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';

import { authorize, authorizeAny } from '../../middleware/authorize.js';
import { PERMISSIONS } from '../../config/roles.js';

const router = Router();

router.use(authenticate);

router.get(
  '/', 
  authorize(PERMISSIONS.EVENTS_READ), 
  asyncHandler(eventsController.getEvents)
);

router.post(
  '/',
  authorizeAny(PERMISSIONS.EVENTS_CREATE, PERMISSIONS.EVENTS_CREATE_OWN),
  validate(createEventSchema),
  asyncHandler(eventsController.createEvent)
);

router.put(
  '/:id',
  authorizeAny(PERMISSIONS.EVENTS_UPDATE_OWN, PERMISSIONS.ALL),
  asyncHandler(eventsController.updateEvent)
);

router.delete(
  '/:id',
  authorizeAny(PERMISSIONS.EVENTS_DELETE_OWN, PERMISSIONS.ALL),
  asyncHandler(eventsController.deleteEvent)
);

router.put(
  '/:id/status',
  authorizeAny(PERMISSIONS.EVENTS_APPROVE), // Faculty or Admin
  asyncHandler(eventsController.updateEventStatus)
);

router.post(
  '/:id/rsvp',
  authorize(PERMISSIONS.EVENTS_RSVP),
  asyncHandler(eventsController.rsvpEvent)
);

export default router;
