import mongoose from 'mongoose';
import { analyzeJobMatch } from '../utils/aiPrompts.js';
import { JobAnalysis } from '../models/JobAnalysis.js';
import { Resume } from '../models/Resume.js';
import { isMongoConnected } from '../config/db.js';

// In-memory fallback store for job analyses
const memoryAnalyses = new Map();

export const analyzeJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobTitle, jobCompany, jobDescription, parsedResume: clientParsedResume, resumeId } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ message: 'Please enter a valid job description (at least 20 characters).' });
    }

    let parsedResume = clientParsedResume;

    // If client didn't pass full parsedResume object, look up by resumeId or userId
    if (!parsedResume && isMongoConnected) {
      try {
        let resumeDoc = null;
        if (resumeId && mongoose.isValidObjectId(resumeId)) {
          resumeDoc = await Resume.findById(resumeId);
        }
        if (!resumeDoc) {
          resumeDoc = await Resume.findOne({ userId }).sort({ createdAt: -1 });
        }
        if (resumeDoc) {
          parsedResume = resumeDoc.parsedData;
        }
      } catch (err) {
        console.warn('Could not query resume from Mongo:', err.message);
      }
    }

    if (!parsedResume) {
      return res.status(400).json({
        message: 'No resume found to match against. Please upload or paste a resume first.',
      });
    }

    console.log(`🔍 Comparing resume against Job Description for: "${jobTitle || 'Target Job'}"`);

    const analysisResult = await analyzeJobMatch(
      parsedResume,
      jobTitle || 'Target Position',
      jobDescription
    );

    let savedRecord = {
      id: 'job_an_' + Date.now(),
      userId,
      resumeId: resumeId || 'latest',
      jobTitle: jobTitle || 'Target Position',
      jobCompany: jobCompany || 'Company',
      jobDescription,
      analysisResult,
      createdAt: new Date(),
    };

    if (isMongoConnected) {
      try {
        const doc = await JobAnalysis.create({
          userId,
          resumeId: (resumeId && typeof resumeId === 'string') ? resumeId : undefined,
          jobTitle: jobTitle || 'Target Position',
          jobCompany: jobCompany || 'Company',
          jobDescription,
          analysisResult,
        });
        savedRecord.id = doc._id.toString();
      } catch (dbErr) {
        console.warn('⚠️ Could not save JobAnalysis to MongoDB:', dbErr.message);
      }
    }

    // Save in memory as well for fast access
    const userList = memoryAnalyses.get(userId) || [];
    userList.unshift(savedRecord);
    memoryAnalyses.set(userId, userList);

    return res.status(200).json({
      message: 'Job analysis completed successfully!',
      analysis: savedRecord,
    });
  } catch (error) {
    console.error('Error in analyzeJob controller:', error);
    return res.status(500).json({ message: 'Failed to analyze job description', error: error.message });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isMongoConnected) {
      try {
        const docs = await JobAnalysis.find({ userId }).sort({ createdAt: -1 });
        const formatted = docs.map(d => ({
          id: d._id.toString(),
          jobTitle: d.jobTitle,
          jobCompany: d.jobCompany,
          score: d.analysisResult?.overallMatchScore || 0,
          createdAt: d.createdAt,
          analysisResult: d.analysisResult,
        }));
        return res.json({ history: formatted });
      } catch (dbErr) {
        console.warn('Mongo history fetch error:', dbErr.message);
      }
    }

    const list = memoryAnalyses.get(userId) || [];
    const formatted = list.map(d => ({
      id: d.id,
      jobTitle: d.jobTitle,
      jobCompany: d.jobCompany,
      score: d.analysisResult?.overallMatchScore || 0,
      createdAt: d.createdAt,
      analysisResult: d.analysisResult,
    }));
    return res.json({ history: formatted });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ message: 'Error retrieving history', error: error.message });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isMongoConnected && mongoose.isValidObjectId(id)) {
      try {
        const doc = await JobAnalysis.findById(id);
        if (doc) {
          return res.json({
            analysis: {
              id: doc._id.toString(),
              jobTitle: doc.jobTitle,
              jobCompany: doc.jobCompany,
              jobDescription: doc.jobDescription,
              analysisResult: doc.analysisResult,
              createdAt: doc.createdAt,
            },
          });
        }
      } catch (err) {
        console.warn('Error fetching analysis by id from Mongo:', err.message);
      }
    }

    const list = memoryAnalyses.get(userId) || [];
    const item = list.find(x => x.id === id);
    if (!item) {
      return res.status(404).json({ message: 'Analysis not found.' });
    }
    return res.json({ analysis: item });
  } catch (error) {
    console.error('Error fetching analysis details:', error);
    return res.status(500).json({ message: 'Error retrieving analysis', error: error.message });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isMongoConnected && mongoose.isValidObjectId(id)) {
      try {
        await JobAnalysis.deleteOne({ _id: id, userId });
      } catch (err) {
        console.warn('Error deleting analysis in Mongo:', err.message);
      }
    }

    const list = memoryAnalyses.get(userId) || [];
    const updated = list.filter(x => x.id !== id);
    memoryAnalyses.set(userId, updated);

    return res.json({ message: 'Analysis report deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting analysis', error: error.message });
  }
};
