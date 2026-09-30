import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvents, rsvpEvent, createEvent, updateEventStatus } from '../../api/events.api';
import { useAuthStore } from '../../store/authStore';
import { Calendar as CalendarIcon, MapPin, Users, PlusCircle, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { FileUpload } from '../../components/FileUpload';
import { Can } from '../../components/Can';
import { PERMISSIONS } from '../../constants/roles';

export const EventsDiscovery = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', location: '', date: '', maxCapacity: '', coverImageUrl: '', openToAlumni: false });

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', location: '', date: '', maxCapacity: '', coverImageUrl: '', openToAlumni: false });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to create event. Ensure description is at least 10 chars.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    payload.date = new Date(payload.date).toISOString();
    payload.maxCapacity = payload.maxCapacity ? parseInt(payload.maxCapacity) : undefined;
    if (!payload.coverImageUrl) delete payload.coverImageUrl;
    
    createMutation.mutate(payload);
  };

  const rsvpMutation = useMutation({
    mutationFn: (eventId) => rsvpEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to RSVP to event.');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ eventId, status }) => updateEventStatus(eventId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to update event status.');
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Loading events...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campus Events</h1>
            <p className="mt-2 text-slate-600">Discover and RSVP to upcoming events, workshops, and hackathons.</p>
          </div>
          <Can permission={[PERMISSIONS.EVENTS_CREATE, PERMISSIONS.EVENTS_CREATE_OWN]}>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
              Host Event
            </button>
          </Can>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => {
            const isGoing = event.rsvps.includes(user?._id);
            const isFull = event.maxCapacity && event.rsvps.length >= event.maxCapacity;

            return (
              <div key={event._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col">
                <div className="h-40 bg-slate-100 relative">
                  {event.coverImageUrl ? (
                    <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-indigo-600 opacity-90"></div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-center">
                    <div className="text-xs font-bold text-brand-600 uppercase tracking-wide">
                      {format(new Date(event.date), 'MMM')}
                    </div>
                    <div className="text-xl font-bold text-slate-900 leading-none mt-1">
                      {format(new Date(event.date), 'dd')}
                    </div>
                  </div>
                  {event.status === 'pending' && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-2.5 py-1 rounded-md text-xs font-bold uppercase shadow-sm">
                      Pending Approval
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm font-medium text-slate-500">
                      <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
                      {format(new Date(event.date), 'h:mm a')}
                    </div>
                    <div className="flex items-center text-sm font-medium text-slate-500">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm font-medium text-slate-500">
                      <Users className="w-4 h-4 mr-2 text-slate-400" />
                      {event.rsvps.length} {event.maxCapacity ? `/ ${event.maxCapacity}` : ''} attending
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1">
                    {event.description}
                  </p>
                  <button 
                    type="button"
                    onClick={() => !isGoing && !isFull && event.status === 'approved' && rsvpMutation.mutate(event._id)}
                    disabled={isGoing || isFull || event.status !== 'approved' || rsvpMutation.isPending}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center transition-all ${
                      isGoing 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : isFull || event.status !== 'approved'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isGoing ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> You're Going</>
                    ) : isFull ? (
                      'Event Full'
                    ) : event.status !== 'approved' ? (
                      'Pending Approval'
                    ) : (
                      <><PlusCircle className="w-4 h-4 mr-2" /> RSVP Now</>
                    )}
                  </button>

                  <Can permission={[PERMISSIONS.EVENTS_APPROVE]}>
                    {event.status === 'pending' && (
                      <div className="flex space-x-2 mt-4">
                        <button 
                          onClick={() => statusMutation.mutate({ eventId: event._id, status: 'approved' })}
                          disabled={statusMutation.isPending}
                          className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => statusMutation.mutate({ eventId: event._id, status: 'rejected' })}
                          disabled={statusMutation.isPending}
                          className="flex-1 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </Can>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Host New Event</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title (min 3 chars)</label>
                <input required minLength={3} type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Capacity (Optional)</label>
                <input type="number" min={1} value={formData.maxCapacity} onChange={e => setFormData({...formData, maxCapacity: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (min 10 chars)</label>
                <textarea required minLength={10} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-3 py-2" rows="3"></textarea>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="alumni" checked={formData.openToAlumni} onChange={e => setFormData({...formData, openToAlumni: e.target.checked})} className="mr-2" />
                <label htmlFor="alumni" className="text-sm font-medium text-slate-700">Open to Alumni?</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Banner Image</label>
                {formData.coverImageUrl ? (
                  <div className="relative h-24 rounded-lg overflow-hidden border">
                    <img src={formData.coverImageUrl} alt="Uploaded banner" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, coverImageUrl: ''})} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X className="w-4 h-4"/></button>
                  </div>
                ) : (
                  <FileUpload onUploadSuccess={(url) => setFormData({...formData, coverImageUrl: url})} label="Upload Banner" accept="image/*" />
                )}
              </div>
              <button type="submit" disabled={createMutation.isPending} className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 mt-2">
                {createMutation.isPending ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
