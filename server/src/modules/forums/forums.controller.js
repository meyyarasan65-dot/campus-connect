import * as forumsService from './forums.service.js';

export const getAllThreads = async (req, res) => {
  const threads = await forumsService.getAllThreads(req.query.category);
  res.status(200).json({ success: true, data: threads });
};

export const getThreadById = async (req, res) => {
  const data = await forumsService.getThreadById(req.params.threadId);
  res.status(200).json({ success: true, data });
};

export const createThread = async (req, res) => {
  const thread = await forumsService.createThread(req.body, req.user._id);
  res.status(201).json({ success: true, data: thread });
};

export const createPost = async (req, res) => {
  const post = await forumsService.createPost(req.params.threadId, req.body.content, req.user);
  res.status(201).json({ success: true, data: post });
};

export const updateThread = async (req, res) => {
  const thread = await forumsService.updateThread(req.params.threadId, req.body, req.user);
  res.status(200).json({ success: true, data: thread });
};

export const deleteThread = async (req, res) => {
  await forumsService.deleteThread(req.params.threadId, req.user);
  res.status(200).json({ success: true, data: null });
};

export const toggleLockThread = async (req, res) => {
  const thread = await forumsService.toggleLockThread(req.params.threadId);
  res.status(200).json({ success: true, data: thread });
};

export const updatePost = async (req, res) => {
  const post = await forumsService.updatePost(req.params.postId, req.body.content, req.user);
  res.status(200).json({ success: true, data: post });
};

export const deletePost = async (req, res) => {
  await forumsService.deletePost(req.params.postId, req.user);
  res.status(200).json({ success: true, data: null });
};
