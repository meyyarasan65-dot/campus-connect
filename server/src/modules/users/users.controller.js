import * as usersService from './users.service.js';

export const getMyProfile = async (req, res) => {
  const profile = await usersService.getProfileByUserId(req.user._id);
  res.status(200).json({ success: true, data: profile });
};

export const getUserProfile = async (req, res) => {
  const profile = await usersService.getProfileByUserId(req.params.userId);
  res.status(200).json({ success: true, data: profile });
};

export const updateMyProfile = async (req, res) => {
  const profile = await usersService.updateProfile(req.user._id, req.body);
  res.status(200).json({ success: true, data: profile });
};

export const getAllUsers = async (req, res) => {
  const users = await usersService.getAllUsers();
  res.status(200).json({ success: true, data: users });
};

export const updateUserRole = async (req, res) => {
  const user = await usersService.updateUserRole(req.params.userId, req.body.role);
  res.status(200).json({ success: true, data: user });
};
