import * as pointsService from './points.service.js';

export const getMyTransactions = async (req, res) => {
  const transactions = await pointsService.getTransactions(req.user._id);
  res.status(200).json({ success: true, data: transactions });
};

export const generateQr = async (req, res) => {
  const { eventId, points } = req.body;
  const result = await pointsService.generateEventQr(eventId, points, req.user._id, req.user.role);
  res.status(201).json({ success: true, data: result });
};

export const scanQr = async (req, res) => {
  const { qrToken } = req.body;
  const transaction = await pointsService.scanAndAwardPoints(req.user._id, qrToken);
  res.status(200).json({ success: true, data: transaction });
};
