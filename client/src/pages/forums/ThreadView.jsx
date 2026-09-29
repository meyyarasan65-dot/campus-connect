import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getThread, createPost } from '../../api/forums.api';
import { socket } from '../../sockets/socket.client';
import { ArrowLeft, Send, Trash2, Lock, Unlock, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Can } from '../../components/Can';
import { PERMISSIONS } from '../../constants/roles';

export const ThreadView = () => {
  const { threadId } = useParams();
  const queryClient = useQueryClient();
  const [replyContent, setReplyContent] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => getThread(threadId),
  });

  useEffect(() => {
    socket.connect();
    socket.emit('join_thread', threadId);

    socket.on('new_post', (post) => {
      // Optimistically update the thread posts
      queryClient.setQueryData(['thread', threadId], (old) => {
        if (!old) return old;
        // avoid duplicates if we created it
        if (old.posts.find(p => p._id === post._id)) return old;
        return { ...old, posts: [...old.posts, post] };
      });
    });

    return () => {
      socket.emit('leave_thread', threadId);
      socket.off('new_post');
      socket.disconnect();
    };
  }, [threadId, queryClient]);

  const postMutation = useMutation({
    mutationFn: (content) => createPost(threadId, content),
    onSuccess: () => {
      setReplyContent('');
    },
    onError: (err) => {
      alert(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to post reply.');
    },
  });

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Loading thread...</div>;
  }

  const { thread, posts } = data;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/forums" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Forums
        </Link>

        {/* Original Thread Post */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-slate-900">{thread.title}</h1>
              <Can permission={PERMISSIONS.FORUMS_MODERATE}>
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title={thread.isLocked ? "Unlock Thread" : "Lock Thread"}>
                    {thread.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Thread">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Can>
            </div>
            <div className="flex items-center text-sm font-medium text-slate-500 mb-6 pb-6 border-b border-slate-100">
              <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mr-3 text-sm">
                {thread.author?.firstName?.[0] || '?'}
              </span>
              <div>
                <div className="text-slate-900">{thread.author?.firstName || 'System'} {thread.author?.lastName || 'Admin'}</div>
                <div className="text-xs text-slate-400 font-normal">{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</div>
              </div>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap text-slate-800">{thread.content}</p>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-slate-900 px-2">{posts.length} Replies</h3>
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 ml-4 md:ml-8 relative">
              <div className="absolute top-8 -left-4 md:-left-8 w-4 md:w-8 h-px bg-slate-200"></div>
              <div className="absolute top-0 -left-4 md:-left-8 w-px h-full bg-slate-200"></div>
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center text-sm font-medium text-slate-500">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${post.isMentorAnswer ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {post.author?.firstName?.[0] || '?'}
                  </span>
                  <span className="text-slate-900 mr-2">{post.author?.firstName || 'System'} {post.author?.lastName || 'Admin'}</span>
                  {post.isMentorAnswer && (
                    <span className="flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-700 uppercase mr-2 tracking-wide">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Mentor
                    </span>
                  )}
                  <span className="text-xs font-normal text-slate-400">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <Can permission={PERMISSIONS.FORUMS_MODERATE}>
                  <button className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Delete Post">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Can>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky bottom-6">
          <form 
            onSubmit={(e) => { e.preventDefault(); if (replyContent.trim()) postMutation.mutate(replyContent); }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              disabled={postMutation.isPending}
            />
            <button
              type="submit"
              disabled={!replyContent.trim() || postMutation.isPending}
              className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
