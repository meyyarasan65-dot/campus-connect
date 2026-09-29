import { Announcement } from '../../models/Announcement.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAllAnnouncements = async (searchQuery, filters = {}) => {
  const query = {};
  
  if (searchQuery) {
    query.$text = { $search: searchQuery };
  }
  
  if (filters.priority) query.priority = filters.priority;
  if (filters.department) query.targetDepartments = { $in: [filters.department] };
  if (filters.batch) query.targetBatches = { $in: [Number(filters.batch)] };

  return await Announcement.find(query)
    .sort(searchQuery ? { score: { $meta: 'textScore' } } : { isPinned: -1, createdAt: -1 })
    .populate('author', 'firstName lastName avatarUrl');
};

export const createAnnouncement = async (announcementData, authorId, clubId, department) => {
  return await Announcement.create({
    ...announcementData,
    author: authorId,
    club: clubId,
    department: department,
  });
};

export const updateAnnouncement = async (id, updateData, user) => {
  const announcement = await Announcement.findById(id);
  if (!announcement) throw new ApiError(404, 'Announcement not found');

  if (user.role !== 'SystemAdmin' && announcement.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You can only edit your own announcements');
  }

  Object.assign(announcement, updateData);
  await announcement.save();
  return announcement;
};

export const deleteAnnouncement = async (id, user) => {
  const announcement = await Announcement.findById(id);
  if (!announcement) throw new ApiError(404, 'Announcement not found');

  if (user.role !== 'SystemAdmin' && announcement.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You can only delete your own announcements');
  }

  await announcement.deleteOne();
  return true;
};

export const togglePin = async (id, user) => {
  const announcement = await Announcement.findById(id);
  if (!announcement) throw new ApiError(404, 'Announcement not found');

  // Must be SystemAdmin or the Faculty of that department
  if (user.role !== 'SystemAdmin') {
    if (user.role !== 'Faculty' || announcement.department !== user.department) {
      throw new ApiError(403, 'Forbidden: Only SystemAdmins or Faculty of the same department can pin');
    }
  }

  announcement.isPinned = !announcement.isPinned;
  await announcement.save();
  return announcement;
};
