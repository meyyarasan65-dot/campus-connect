import { apiClient } from './client';

export const getTransactions = async () => {
  const { data } = await apiClient.get('/points/transactions');
  return data.data;
};

export const generateQr = async (eventId, points) => {
  const { data } = await apiClient.post('/points/qr/generate', { eventId, points });
  return data.data; // { qrDataUrl, token }
};

export const scanQr = async (qrToken) => {
  const { data } = await apiClient.post('/points/qr/scan', { qrToken });
  return data.data;
};
