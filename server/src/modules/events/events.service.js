import { Event } from '../../models/Event.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAllEvents = async (searchQuery, user) => {
  const query = {};
  
  // Future events only by default, unless searching
  if (!searchQuery) {
    query.date = { $gte: new Date() };
  } else {
    query.$text = { $search: searchQuery };
  }

  // Visibility of pending events
  if (user && user.role !== 'SystemAdmin' && user.role !== 'Faculty') {
    query.$or = [
      { status: 'approved' },
      { organizer: user._id }
    ];
  }

  return await Event.find(query)
    .sort(searchQuery ? { score: { $meta: 'textScore' } } : { date: 1 })
    .populate('organizer', 'firstName lastName')
    .populate('club', 'name');
};

export const createEvent = async (eventData, user, clubId, department) => {
  let status = 'pending';
  // Faculty and SystemAdmin events are auto-approved
  if (user.role === 'Faculty' || user.role === 'SystemAdmin') {
    status = 'approved';
  }

  return await Event.create({
    ...eventData,
    organizer: user._id,
    club: clubId,
    department,
    status
  });
};

export const updateEvent = async (id, updateData, user) => {
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found');

  if (user.role !== 'SystemAdmin' && event.organizer.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: Only owner can edit');
  }

  Object.assign(event, updateData);
  await event.save();
  return event;
};

export const deleteEvent = async (id, user) => {
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found');

  if (user.role !== 'SystemAdmin' && event.organizer.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: Only owner can delete');
  }

  await event.deleteOne();
  return true;
};

export const updateEventStatus = async (id, status, user) => {
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found');

  if (user.role === 'Faculty') {
    // Faculty can only approve events for their department, but clubs don't always have a strict department attached.
    // For now, allow Faculty to approve any event, or we can assume clubs map to departments.
    // Given the prompt, Faculty can approve events (we will leave it open for Faculty as a pseudo-admin for events).
  }

  event.status = status;
  await event.save();
  return event;
};

export const rsvpEvent = async (eventId, user) => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  if (event.status !== 'approved') {
    throw new ApiError(400, 'Cannot RSVP to an unapproved event');
  }

  if (user.role === 'Alumni' && !event.openToAlumni) {
    throw new ApiError(403, 'This event is not open to alumni');
  }

  if (event.maxCapacity && event.rsvps.length >= event.maxCapacity) {
    throw new ApiError(400, 'Event is full');
  }

  if (!event.rsvps.includes(user._id)) {
    event.rsvps.push(user._id);
    await event.save();
  }
  
  return event;
};
