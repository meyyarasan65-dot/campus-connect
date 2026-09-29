import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }, // If posted by ClubAdmin
    department: { type: String }, // If posted by Faculty
    isPinned: { type: Boolean, default: false },
    // Targeting criteria
    targetDepartments: [{ type: String }],
    targetBatches: [{ type: Number }],
    attachments: [{ type: String }], // Cloudinary URLs
  },
  { timestamps: true }
);

// Full-text search index
announcementSchema.index({ title: 'text', content: 'text' });

export const Announcement = mongoose.model('Announcement', announcementSchema);
