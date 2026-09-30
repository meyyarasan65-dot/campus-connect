import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getThreads, createThread } from '../../api/forums.api';
import { MessageSquare, Users, TrendingUp, Lock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const ForumList = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Academics' });

  const createMutation = useMutation({
    mutationFn: createThread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      setIsModalOpen(false);
      setFormData({ title: '', content: '', category: 'Academics' });
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || 'Failed to create thread.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const { data: threads, isLoading } = useQuery({
    queryKey: ['threads', selectedCategory],
    queryFn: () => getThreads(selectedCategory),
  });

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Loading forums...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Community Forums</h1>
              <p className="mt-1 text-slate-600">Discuss, ask, and share with your campus.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
              New Thread
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {threads?.map((thread) => (
              <Link 
                key={thread._id} 
                to={`/forums/${thread._id}`}
                className="block p-5 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {thread.category}
                      </span>
                      {thread.isPinned && (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 uppercase">
                          Pinned
                        </span>
                      )}
                      {thread.isLocked && (
                        <span className="flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700 uppercase">
                          <Lock className="w-3 h-3 mr-1" /> Locked
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {thread.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 line-clamp-1">{thread.content}</p>
                    
                    <div className="mt-3 flex items-center text-xs font-medium text-slate-500 space-x-4">
                      <div className="flex items-center">
                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mr-1.5">
                          {thread.author?.firstName?.[0] || '?'}
                        </span>
                        {thread.author?.firstName || 'System'}
                      </div>
                      <div>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col items-end space-y-2 text-slate-400">
                    <div className="flex items-center text-sm font-medium">
                      <TrendingUp className="w-4 h-4 mr-1.5" />
                      {thread.views}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {threads?.length === 0 && (
              <div className="p-8 text-center text-slate-500">No threads yet. Be the first to start a discussion!</div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-brand-500" />
              Categories
            </h3>
            <ul className="space-y-2 text-sm font-medium text-slate-600">
              <li 
                onClick={() => setSelectedCategory('')}
                className={`p-2 rounded-lg cursor-pointer ${selectedCategory === '' ? 'text-brand-600 bg-brand-50' : 'hover:bg-slate-50'}`}
              >
                All Discussions
              </li>
              <li 
                onClick={() => setSelectedCategory('Academics')}
                className={`p-2 rounded-lg cursor-pointer ${selectedCategory === 'Academics' ? 'text-brand-600 bg-brand-50' : 'hover:bg-slate-50'}`}
              >
                Academics
              </li>
              <li 
                onClick={() => setSelectedCategory('Placements')}
                className={`p-2 rounded-lg cursor-pointer ${selectedCategory === 'Placements' ? 'text-brand-600 bg-brand-50' : 'hover:bg-slate-50'}`}
              >
                Placements
              </li>
              <li 
                onClick={() => setSelectedCategory('Tech Help')}
                className={`p-2 rounded-lg cursor-pointer ${selectedCategory === 'Tech Help' ? 'text-brand-600 bg-brand-50' : 'hover:bg-slate-50'}`}
              >
                Tech Help
              </li>
            </ul>
          </div>
        </div>
        
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Thread</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title (min 5 chars)</label>
                <input required minLength={5} type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-lg px-3 py-2">
                  <option value="" disabled>Select a category</option>
                  <option value="Academics">Academics</option>
                  <option value="Placements">Placements</option>
                  <option value="Tech Help">Tech Help</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content (min 10 chars)</label>
                <textarea required minLength={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border rounded-lg px-3 py-2" rows="4"></textarea>
              </div>
              <button type="submit" disabled={createMutation.isPending} className="w-full py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 mt-2">
                {createMutation.isPending ? 'Creating...' : 'Create Thread'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
