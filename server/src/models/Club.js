import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    logoUrl: { type: String },
    category: { type: String, trim: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Indexes for searching
clubSchema.index({ name: 'text', description: 'text' });

export const Club = mongoose.model('Club', clubSchema);
