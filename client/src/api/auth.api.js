import { apiClient } from './client';

export const login = async (credentials) => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data.data;
};

export const register = async (userData) => {
  const { data } = await apiClient.post('/auth/register', userData);
  return data.data;
};

export const logout = async () => {
  const { data } = await apiClient.post('/auth/logout');
  return data.data;
};

export const getMe = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data.data;
};

export const getCsrfToken = async () => {
  const { data } = await apiClient.get('/csrf-token');
  return data.data;
};
