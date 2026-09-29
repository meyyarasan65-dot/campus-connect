import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema(
  {
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumThread', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isMentorAnswer: { type: Boolean, default: false },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

forumPostSchema.index({ thread: 1, createdAt: 1 });

export const ForumPost = mongoose.model('ForumPost', forumPostSchema);
