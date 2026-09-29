import { apiClient } from './client';

export const getDashboardStats = async () => {
  const { data } = await apiClient.get('/analytics');
  return data.data;
};
