import { Club } from '../../models/Club.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAllClubs = async (query = {}) => {
  return await Club.find(query).populate('admins', 'firstName lastName');
};

export const getClubById = async (clubId) => {
  const club = await Club.findById(clubId)
    .populate('admins', 'firstName lastName email avatarUrl')
    .populate('members', 'firstName lastName avatarUrl');
  if (!club) throw new ApiError(404, 'Club not found');
  return club;
};

export const createClub = async (clubData, adminUserId) => {
  return await Club.create({
    ...clubData,
    admins: [adminUserId],
    members: [adminUserId]
  });
};

export const updateClub = async (clubId, updateData) => {
  const club = await Club.findById(clubId);
  if (!club) throw new ApiError(404, 'Club not found');

  Object.assign(club, updateData);
  await club.save();
  return club;
};

export const deleteClub = async (clubId) => {
  const club = await Club.findByIdAndDelete(clubId);
  if (!club) throw new ApiError(404, 'Club not found');
  return club;
};

// Students request to join (for now we auto-add them, in full flow they go to pendingMembers)
// Let's implement auto-add for simplicity or leave as is since schema doesn't have pendingMembers
export const joinClub = async (clubId, userId) => {
  const club = await Club.findById(clubId);
  if (!club) throw new ApiError(404, 'Club not found');

  if (!club.members.includes(userId)) {
    club.members.push(userId);
    await club.save();
  }
  return club;
};

export const leaveClub = async (clubId, userId) => {
  const club = await Club.findById(clubId);
  if (!club) throw new ApiError(404, 'Club not found');

  club.members = club.members.filter(id => id.toString() !== userId.toString());
  await club.save();
  return club;
};

export const approveMember = async (clubId, userId) => {
  return await joinClub(clubId, userId); // Alias for now
};

export const removeMember = async (clubId, userId) => {
  return await leaveClub(clubId, userId); // Alias for now
};
