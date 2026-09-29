import { ForumThread } from '../../models/ForumThread.js';
import { ForumPost } from '../../models/ForumPost.js';
import { getIo } from '../../sockets/socket.js';
import { ApiError } from '../../utils/ApiError.js';

export const getAllThreads = async (category) => {
  const query = category ? { category } : {};
  return await ForumThread.find(query)
    .sort({ isPinned: -1, createdAt: -1 })
    .populate('author', 'firstName lastName avatarUrl');
};

export const getThreadById = async (threadId) => {
  const thread = await ForumThread.findByIdAndUpdate(threadId, { $inc: { views: 1 } }, { new: true })
    .populate('author', 'firstName lastName avatarUrl');
  if (!thread) throw new ApiError(404, 'Thread not found');
  
  const posts = await ForumPost.find({ thread: threadId })
    .populate('author', 'firstName lastName avatarUrl')
    .sort({ createdAt: 1 });

  return { thread, posts };
};

export const createThread = async (threadData, authorId) => {
  return await ForumThread.create({ ...threadData, author: authorId });
};

export const createPost = async (threadId, content, user) => {
  const thread = await ForumThread.findById(threadId);
  if (!thread) throw new ApiError(404, 'Thread not found');
  if (thread.isLocked) throw new ApiError(403, 'Thread is locked');

  // Check if they have the Mentor role
  const isMentorAnswer = user.role === 'Alumni' || user.role === 'Faculty';

  const post = await ForumPost.create({ 
    thread: threadId, 
    content, 
    author: user._id,
    isMentorAnswer 
  });
  
  await post.populate('author', 'firstName lastName avatarUrl');
  getIo().to(`thread_${threadId}`).emit('new_post', post);
  return post;
};

export const updateThread = async (threadId, updateData, user) => {
  const thread = await ForumThread.findById(threadId);
  if (!thread) throw new ApiError(404, 'Thread not found');

  if (user.role !== 'SystemAdmin' && user.role !== 'Faculty' && thread.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You cannot edit this thread');
  }

  Object.assign(thread, updateData);
  await thread.save();
  return thread;
};

export const deleteThread = async (threadId, user) => {
  const thread = await ForumThread.findById(threadId);
  if (!thread) throw new ApiError(404, 'Thread not found');

  if (user.role !== 'SystemAdmin' && user.role !== 'Faculty' && thread.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You cannot delete this thread');
  }

  await thread.deleteOne();
  await ForumPost.deleteMany({ thread: threadId });
  return true;
};

export const toggleLockThread = async (threadId) => {
  const thread = await ForumThread.findById(threadId);
  if (!thread) throw new ApiError(404, 'Thread not found');

  thread.isLocked = !thread.isLocked;
  await thread.save();
  return thread;
};

export const updatePost = async (postId, content, user) => {
  const post = await ForumPost.findById(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  if (user.role !== 'SystemAdmin' && user.role !== 'Faculty' && post.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You cannot edit this post');
  }

  post.content = content;
  await post.save();
  return post;
};

export const deletePost = async (postId, user) => {
  const post = await ForumPost.findById(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  if (user.role !== 'SystemAdmin' && user.role !== 'Faculty' && post.author.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Forbidden: You cannot delete this post');
  }

  await post.deleteOne();
  return true;
};
