import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    studentId: { type: String, trim: true },
    department: { type: String, trim: true },
    batchYear: { type: Number },
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    avatarUrl: { type: String },
    totalActivityPoints: { type: Number, default: 0 }, // AICTE Activity Points ledger
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
