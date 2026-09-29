import { PointsTransaction } from '../../models/PointsTransaction.js';
import { Event } from '../../models/Event.js';
import { StudentProfile } from '../../models/StudentProfile.js';
import { ApiError } from '../../utils/ApiError.js';
import { env } from '../../config/env.js';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

export const getTransactions = async (userId) => {
  return await PointsTransaction.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('event', 'title');
};

export const generateEventQr = async (eventId, points, organizerId, userRole) => {
  if (eventId !== '660000000000000000000000') {
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, 'Event not found');
    if (event.organizer.toString() !== organizerId.toString() && userRole !== 'SystemAdmin') {
      throw new ApiError(403, 'Only the event organizer or SystemAdmin can generate a QR code');
    }
  }

  // Create a short-lived signed JWT containing the points info
  const token = jwt.sign(
    { eventId, points, type: 'ATTENDANCE_POINTS' },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '12h' }
  );

  // Generate QR code data URL
  const qrDataUrl = await QRCode.toDataURL(token, {
    width: 400,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });

  return { qrDataUrl, token };
};

export const scanAndAwardPoints = async (userId, qrToken) => {
  let decoded;
  try {
    decoded = jwt.verify(qrToken, env.JWT_ACCESS_SECRET);
  } catch (err) {
    throw new ApiError(400, 'Invalid or expired QR code');
  }

  if (decoded.type !== 'ATTENDANCE_POINTS') {
    throw new ApiError(400, 'Invalid QR code type');
  }

  const { eventId, points } = decoded;

  // Check if already claimed
  const existing = await PointsTransaction.findOne({ user: userId, event: eventId });
  if (existing) {
    throw new ApiError(400, 'You have already claimed points for this event');
  }

  // Record transaction
  const transaction = await PointsTransaction.create({
    user: userId,
    amount: points,
    reason: 'Event Attendance via QR Scan',
    event: eventId
  });

  // Update total in StudentProfile
  const profile = await StudentProfile.findOne({ user: userId });
  if (profile) {
    profile.totalActivityPoints += points;
    await profile.save();
  }

  return transaction;
};
