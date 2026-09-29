import * as clubsService from './clubs.service.js';

export const getAllClubs = async (req, res) => {
  const clubs = await clubsService.getAllClubs();
  res.status(200).json({ success: true, data: clubs });
};

export const getClubById = async (req, res) => {
  const club = await clubsService.getClubById(req.params.clubId);
  res.status(200).json({ success: true, data: club });
};

export const createClub = async (req, res) => {
  const club = await clubsService.createClub(req.body, req.user._id);
  res.status(201).json({ success: true, data: club });
};

export const updateClub = async (req, res) => {
  const club = await clubsService.updateClub(req.params.clubId, req.body, req.user._id);
  res.status(200).json({ success: true, data: club });
};

export const joinClub = async (req, res) => {
  const club = await clubsService.joinClub(req.params.clubId, req.user._id);
  res.status(200).json({ success: true, data: club });
};

export const leaveClub = async (req, res) => {
  const club = await clubsService.leaveClub(req.params.clubId, req.user._id);
  res.status(200).json({ success: true, data: club });
};

export const deleteClub = async (req, res) => {
  await clubsService.deleteClub(req.params.clubId);
  res.status(200).json({ success: true, data: null });
};

export const approveMember = async (req, res) => {
  const club = await clubsService.approveMember(req.params.clubId, req.params.userId);
  res.status(200).json({ success: true, data: club });
};

export const removeMember = async (req, res) => {
  const club = await clubsService.removeMember(req.params.clubId, req.params.userId);
  res.status(200).json({ success: true, data: club });
};
