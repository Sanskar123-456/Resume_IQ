import mongoose from 'mongoose';

const jobAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    resumeId: { type: String },
    jobTitle: { type: String, required: true },
    jobCompany: { type: String, default: '' },
    jobDescription: { type: String, required: true },
    analysisResult: { type: Object, required: true },
  },
  { timestamps: true }
);

export const JobAnalysis = mongoose.models.JobAnalysis || mongoose.model('JobAnalysis', jobAnalysisSchema);
