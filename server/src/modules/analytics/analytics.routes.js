import { Router } from 'express';
import { getDashboardData } from './analytics.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { PERMISSIONS } from '../../config/roles.js';

const router = Router();

router.get('/', authenticate, authorize(PERMISSIONS.ANALYTICS_READ), getDashboardData);

export default router;
