import { apiClient } from './client';

export const getAllClubs = async () => {
  const { data } = await apiClient.get('/clubs');
  return data.data;
};

export const getClubById = async (clubId) => {
  const { data } = await apiClient.get(`/clubs/${clubId}`);
  return data.data;
};

export const createClub = async (clubData) => {
  const { data } = await apiClient.post('/clubs', clubData);
  return data.data;
};

export const joinClub = async (clubId) => {
  const { data } = await apiClient.post(`/clubs/${clubId}/join`);
  return data.data;
};

export const leaveClub = async (clubId) => {
  const { data } = await apiClient.post(`/clubs/${clubId}/leave`);
  return data.data;
};
