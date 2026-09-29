import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }, // Optional, if organized by a club
    department: { type: String }, // Optional, if organized by faculty
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
    openToAlumni: { type: Boolean, default: false },
    maxCapacity: { type: Number },
    rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    coverImageUrl: { type: String },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

// Full-text search index
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Event = mongoose.model('Event', eventSchema);
