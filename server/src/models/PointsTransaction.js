import mongoose from 'mongoose';

const pointsTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true }, // e.g., 'Attended Hackathon', 'Organized Event'
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Optional link to an event
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }, // Optional link to a club
  },
  { timestamps: true }
);

export const PointsTransaction = mongoose.model('PointsTransaction', pointsTransactionSchema);
