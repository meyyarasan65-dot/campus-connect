import { useQuery } from '@tanstack/react-query';
import { getThreads } from '../../api/forums.api';
import { MessageSquare, Users, TrendingUp, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const ForumList = () => {
  const { data: threads, isLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: () => getThreads(),
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
            <button className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
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
              <li className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-brand-600 bg-brand-50">All Discussions</li>
              <li className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">Academics</li>
              <li className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">Placements</li>
              <li className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer">Tech Help</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
};
