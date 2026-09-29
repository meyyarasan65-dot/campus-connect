import { apiClient } from './client';

export const getMyProfile = async () => {
  const { data } = await apiClient.get('/users/me');
  return data.data;
};

export const getUserProfile = async (userId) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data.data;
};

export const updateMyProfile = async (profileData) => {
  const { data } = await apiClient.put('/users/me', profileData);
  return data.data;
};

export const getAllUsers = async () => {
  const { data } = await apiClient.get('/users');
  return data.data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await apiClient.put(`/users/${userId}/role`, { role });
  return data.data;
};
