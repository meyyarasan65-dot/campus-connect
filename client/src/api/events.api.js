import { apiClient } from './client';

export const getEvents = async (searchQuery = '') => {
  const { data } = await apiClient.get(`/events${searchQuery ? `?q=${searchQuery}` : ''}`);
  return data.data;
};

export const createEvent = async (eventData) => {
  const { data } = await apiClient.post('/events', eventData);
  return data.data;
};

export const rsvpEvent = async (eventId) => {
  const { data } = await apiClient.post(`/events/${eventId}/rsvp`);
  return data.data;
};

export const updateEventStatus = async (eventId, status) => {
  const { data } = await apiClient.put(`/events/${eventId}/status`, { status });
  return data.data;
};
