import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as forumsController from './forums.controller.js';
import { createThreadSchema, createPostSchema } from './forums.schema.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize, authorizeAny } from '../../middleware/authorize.js';
import { PERMISSIONS } from '../../config/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.FORUMS_READ), asyncHandler(forumsController.getAllThreads));
router.get('/:threadId', authorize(PERMISSIONS.FORUMS_READ), asyncHandler(forumsController.getThreadById));

router.post('/', authorize(PERMISSIONS.FORUMS_CREATE), validate(createThreadSchema), asyncHandler(forumsController.createThread));
router.post('/:threadId/posts', authorize(PERMISSIONS.FORUMS_REPLY), validate(createPostSchema), asyncHandler(forumsController.createPost));

// Moderation & Ownership Routes for Threads
router.put('/:threadId', asyncHandler(forumsController.updateThread));
router.delete('/:threadId', asyncHandler(forumsController.deleteThread));
router.put('/:threadId/lock', authorize(PERMISSIONS.FORUMS_MODERATE), asyncHandler(forumsController.toggleLockThread));

// Moderation & Ownership Routes for Posts
router.put('/posts/:postId', asyncHandler(forumsController.updatePost));
router.delete('/posts/:postId', asyncHandler(forumsController.deletePost));

export default router;
