import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as pointsController from './points.controller.js';
import { generateQrSchema, scanQrSchema } from './points.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';

import { authorize } from '../../middleware/authorize.js';
import { PERMISSIONS } from '../../config/roles.js';

const router = Router();

router.use(authenticate);

router.get('/transactions', authorize(PERMISSIONS.POINTS_READ_OWN), asyncHandler(pointsController.getMyTransactions));
router.post('/qr/generate', authorize(PERMISSIONS.POINTS_APPROVE), validate(generateQrSchema), asyncHandler(pointsController.generateQr));
router.post('/qr/scan', authorize(PERMISSIONS.POINTS_READ_OWN), validate(scanQrSchema), asyncHandler(pointsController.scanQr));

export default router;
