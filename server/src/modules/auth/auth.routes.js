import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as authController from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { validate } from '../../middleware/validate.js';
import { rateLimiterMiddleware } from '../../middleware/rateLimiter.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.post(
  '/register',
  rateLimiterMiddleware('auth'),
  validate(registerSchema),
  asyncHandler(authController.register)
);

router.post(
  '/login',
  rateLimiterMiddleware('auth'),
  validate(loginSchema),
  asyncHandler(authController.login)
);

router.post('/refresh', asyncHandler(authController.refresh));

router.post('/logout', asyncHandler(authController.logout));

router.get('/me', authenticate, asyncHandler(authController.getMe));

export default router;
