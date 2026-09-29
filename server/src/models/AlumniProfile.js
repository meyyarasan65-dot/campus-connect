import mongoose from 'mongoose';

const alumniProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    graduationYear: { type: Number, required: true },
    currentCompany: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    linkedInUrl: { type: String, trim: true },
    mentoringWillingness: { type: Boolean, default: false },
    // A snapshot of their profile at graduation
    pastDepartment: { type: String, trim: true },
  },
  { timestamps: true }
);

export const AlumniProfile = mongoose.model('AlumniProfile', alumniProfileSchema);
