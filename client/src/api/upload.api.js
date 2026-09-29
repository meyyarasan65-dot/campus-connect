import { apiClient } from './client';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Need to set Content-Type to multipart/form-data
  const { data } = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data.data; // { url, format, size }
};
