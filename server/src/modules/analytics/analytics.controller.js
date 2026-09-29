import { asyncHandler } from '../../utils/asyncHandler.js';
import * as analyticsService from './analytics.service.js';

export const getDashboardData = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboardStats(req.user);
  res.status(200).json({ success: true, data });
});
