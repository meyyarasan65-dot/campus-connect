import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnnouncements, createAnnouncement } from '../../api/content.api';
import { Bell, AlertTriangle, Info, Clock, X, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { FileUpload } from '../../components/FileUpload';
import { Can } from '../../components/Can';
import { PERMISSIONS } from '../../constants/roles';

export const AnnouncementsFeed = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => getAnnouncements(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'LOW', attachments: [] });

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsModalOpen(false);
      setFormData({ title: '', content: '', priority: 'LOW', attachments: [] });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to post announcement. Make sure content is at least 10 characters.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      attachments: formData.attachments.length > 0 ? formData.attachments : undefined
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'MEDIUM': return <Bell className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'border-red-200 bg-red-50';
      case 'MEDIUM': return 'border-amber-200 bg-amber-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Announcements</h1>
            <p className="mt-2 text-slate-600">Stay updated with the latest campus news.</p>
          </div>
          <Can permission={[PERMISSIONS.ANNOUNCEMENTS_CREATE, PERMISSIONS.ANNOUNCEMENTS_CREATE_OWN]}>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
              Make Announcement
            </button>
          </Can>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading feed...</div>
        ) : announcements?.length > 0 ? (
          announcements.map((announcement) => (
            <div 
              key={announcement._id} 
              className={`p-6 rounded-2xl border ${getPriorityColor(announcement.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getPriorityIcon(announcement.priority)}
                  <h3 className="text-lg font-bold text-slate-900">{announcement.title}</h3>
                </div>
                <div className="flex items-center text-xs text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                </div>
              </div>
              <p className="mt-3 text-slate-700 whitespace-pre-wrap">{announcement.content}</p>
              
              {announcement.attachments?.length > 0 && (
                <div className="mt-4">
                  <a href={announcement.attachments[0]} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-brand-600 hover:bg-slate-50">
                    <Paperclip className="w-4 h-4 mr-2" /> View Attachment
                  </a>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                <div className="flex items-center text-sm font-medium text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mr-2 text-xs">
                    {announcement.author?.firstName?.[0] || '?'}
                  </span>
                  {announcement.author?.firstName || 'System'} {announcement.author?.lastName || 'Admin'}
                </div>
                {announcement.priority === 'HIGH' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
                    Important
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
            <p className="text-sm text-slate-500 mt-1">No new announcements at the moment.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Announcement</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title (min 3 chars)</label>
                <input required minLength={3} type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content (min 10 chars)</label>
                <textarea required minLength={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border rounded-lg px-3 py-2" rows="4"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full border rounded-lg px-3 py-2 bg-white">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Banner / Attachment</label>
                {formData.attachments.length > 0 ? (
                  <div className="relative h-24 rounded-lg overflow-hidden border">
                    <img src={formData.attachments[0]} alt="Uploaded" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, attachments: []})} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X className="w-4 h-4"/></button>
                  </div>
                ) : (
                  <FileUpload onUploadSuccess={(url) => setFormData({...formData, attachments: [url]})} label="Upload Image" accept="image/*" />
                )}
              </div>
              <button type="submit" disabled={createMutation.isPending} className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 mt-2">
                {createMutation.isPending ? 'Posting...' : 'Post Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
