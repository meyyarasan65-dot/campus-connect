import * as eventsService from './events.service.js';
import { Club } from '../../models/Club.js';
import { StudentProfile } from '../../models/StudentProfile.js';
import { ApiError } from '../../utils/ApiError.js';

export const getEvents = async (req, res) => {
  const { q } = req.query;
  const events = await eventsService.getAllEvents(q, req.user);
  res.status(200).json({ success: true, data: events });
};

export const createEvent = async (req, res) => {
  let clubId = req.body.club || null;
  let department = null;

  if (req.user.role === 'ClubAdmin') {
    if (!clubId) {
      const club = await Club.findOne({ admins: req.user._id });
      if (!club) throw new ApiError(403, 'Forbidden: You must be an admin of a club');
      clubId = club._id;
    } else {
      const club = await Club.findById(clubId);
      if (!club || !club.admins.includes(req.user._id)) {
        throw new ApiError(403, 'Forbidden: You are not an admin of this club');
      }
    }
  } else if (req.user.role === 'Faculty') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) throw new ApiError(400, 'Faculty profile not found to determine department');
    department = profile.department;
  }

  const event = await eventsService.createEvent(req.body, req.user, clubId, department);
  res.status(201).json({ success: true, data: event });
};

export const updateEvent = async (req, res) => {
  const event = await eventsService.updateEvent(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: event });
};

export const deleteEvent = async (req, res) => {
  await eventsService.deleteEvent(req.params.id, req.user);
  res.status(200).json({ success: true, data: null });
};

export const updateEventStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }
  const event = await eventsService.updateEventStatus(req.params.id, status, req.user);
  res.status(200).json({ success: true, data: event });
};

export const rsvpEvent = async (req, res) => {
  const event = await eventsService.rsvpEvent(req.params.id, req.user);
  res.status(200).json({ success: true, data: event });
};
