import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
    parsedData: { type: Object, required: true },
  },
  { timestamps: true }
);

export const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
