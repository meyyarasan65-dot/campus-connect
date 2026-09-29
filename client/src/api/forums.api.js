import { apiClient } from './client';

export const getThreads = async (category = '') => {
  const { data } = await apiClient.get(`/forums${category ? `?category=${category}` : ''}`);
  return data.data;
};

export const getThread = async (threadId) => {
  const { data } = await apiClient.get(`/forums/${threadId}`);
  return data.data; // { thread, posts }
};

export const createThread = async (threadData) => {
  const { data } = await apiClient.post('/forums', threadData);
  return data.data;
};

export const createPost = async (threadId, content) => {
  const { data } = await apiClient.post(`/forums/${threadId}/posts`, { content });
  return data.data;
};
