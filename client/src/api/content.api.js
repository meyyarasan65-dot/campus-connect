import { apiClient } from './client';

export const getAnnouncements = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.q) params.append('q', filters.q);
  if (filters.priority) params.append('priority', filters.priority);
  
  const { data } = await apiClient.get(`/content?${params.toString()}`);
  return data.data;
};

export const createAnnouncement = async (announcementData) => {
  const { data } = await apiClient.post('/content', announcementData);
  return data.data;
};
