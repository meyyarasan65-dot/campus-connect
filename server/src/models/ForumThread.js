import mongoose from 'mongoose';

const forumThreadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true }, // e.g., 'General', 'Tech', 'Placements'
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }, // If it belongs to a club
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

forumThreadSchema.index({ category: 1, createdAt: -1 });

export const ForumThread = mongoose.model('ForumThread', forumThreadSchema);
