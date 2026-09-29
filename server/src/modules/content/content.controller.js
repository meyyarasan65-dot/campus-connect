import * as contentService from './content.service.js';
import { Club } from '../../models/Club.js';
import { StudentProfile } from '../../models/StudentProfile.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAnnouncements = async (req, res) => {
  const { q, priority, department, batch } = req.query;
  const announcements = await contentService.getAllAnnouncements(q, { priority, department, batch });
  res.status(200).json({ success: true, data: announcements });
};

export const createAnnouncement = async (req, res) => {
  let clubId = req.body.clubId || null;
  let department = null;

  if (req.user.role === 'ClubAdmin') {
    if (!clubId) {
      const club = await Club.findOne({ admins: req.user._id });
      if (!club) throw new ApiError(403, 'Forbidden: You must be an admin of at least one club to post');
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
    // Overwrite target if they only want it for their department
    req.body.targetDepartments = [department];
  }

  const announcement = await contentService.createAnnouncement(req.body, req.user._id, clubId, department);
  res.status(201).json({ success: true, data: announcement });
};

export const updateAnnouncement = async (req, res) => {
  const announcement = await contentService.updateAnnouncement(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: announcement });
};

export const deleteAnnouncement = async (req, res) => {
  await contentService.deleteAnnouncement(req.params.id, req.user);
  res.status(200).json({ success: true, data: null });
};

export const togglePin = async (req, res) => {
  // We need to pass the user's department to the service if they are faculty
  if (req.user.role === 'Faculty') {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    req.user.department = profile?.department;
  }
  const announcement = await contentService.togglePin(req.params.id, req.user);
  res.status(200).json({ success: true, data: announcement });
};
