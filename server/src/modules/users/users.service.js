import { StudentProfile } from '../../models/StudentProfile.js';
import { AlumniProfile } from '../../models/AlumniProfile.js';
import { User } from '../../models/User.js';
import { ApiError } from '../../utils/ApiError.js';

export const getProfileByUserId = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.role === 'Alumni') {
    let profile = await AlumniProfile.findOne({ user: userId }).populate('user', 'firstName lastName email role');
    if (!profile) {
      profile = await AlumniProfile.create({ user: userId, graduationYear: new Date().getFullYear() });
      profile = await profile.populate('user', 'firstName lastName email role');
    }
    return { ...profile.toObject(), profileType: 'Alumni' };
  } else {
    let profile = await StudentProfile.findOne({ user: userId }).populate('user', 'firstName lastName email role');
    if (!profile) {
      profile = await StudentProfile.create({ user: userId });
      profile = await profile.populate('user', 'firstName lastName email role');
    }
    return { ...profile.toObject(), profileType: user.role };
  }
};

export const updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.role === 'Alumni') {
    let profile = await AlumniProfile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true }
    ).populate('user', 'firstName lastName email role');
    return { ...profile.toObject(), profileType: 'Alumni' };
  } else {
    let profile = await StudentProfile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true }
    ).populate('user', 'firstName lastName email role');
    return { ...profile.toObject(), profileType: user.role };
  }
};

export const getAllUsers = async () => {
  return await User.find().select('-password').sort({ createdAt: -1 });
};

export const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};
