import { parsePdfBuffer } from '../utils/pdfParser.js';
import { extractResumeDetails } from '../utils/aiPrompts.js';
import { Resume } from '../models/Resume.js';
import { isMongoConnected } from '../config/db.js';

// In-memory fallback store for resumes
const memoryResumes = new Map();

export const uploadAndParseResume = async (req, res) => {
  try {
    const userId = req.user.id;
    let rawText = '';
    let fileName = 'Uploaded_Resume.pdf';

    if (req.file) {
      fileName = req.file.originalname;
      const pdfResult = await parsePdfBuffer(req.file.buffer);
      rawText = pdfResult.text;
    } else if (req.body.resumeText) {
      rawText = req.body.resumeText.trim();
      fileName = req.body.fileName || 'Pasted_Resume.txt';
    } else {
      return res.status(400).json({ message: 'No PDF file uploaded or resume text provided.' });
    }

    if (!rawText || rawText.length < 30) {
      return res.status(400).json({ message: 'Resume content is too short or could not be read.' });
    }

    console.log(`📄 Parsing resume: ${fileName} (${rawText.length} chars)`);

    // Use AI to extract structured fields
    const parsedData = await extractResumeDetails(rawText);

    let savedResume = {
      id: 'res_' + Date.now(),
      userId,
      fileName,
      rawText,
      parsedData,
      createdAt: new Date(),
    };

    if (isMongoConnected) {
      const doc = await Resume.create({
        userId,
        fileName,
        rawText,
        parsedData,
      });
      savedResume = {
        id: doc._id.toString(),
        userId: doc.userId,
        fileName: doc.fileName,
        rawText: doc.rawText,
        parsedData: doc.parsedData,
        createdAt: doc.createdAt,
      };
    } else {
      memoryResumes.set(userId, savedResume);
    }

    return res.status(200).json({
      message: 'Resume parsed and analyzed successfully!',
      resume: savedResume,
    });
  } catch (error) {
    console.error('Error in uploadAndParseResume:', error);
    return res.status(500).json({ message: 'Failed to process resume', error: error.message });
  }
};

export const getLatestResume = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isMongoConnected) {
      const doc = await Resume.findOne({ userId }).sort({ createdAt: -1 });
      if (!doc) {
        return res.status(404).json({ message: 'No resume found for this user.' });
      }
      return res.json({
        resume: {
          id: doc._id.toString(),
          userId: doc.userId,
          fileName: doc.fileName,
          rawText: doc.rawText,
          parsedData: doc.parsedData,
          createdAt: doc.createdAt,
        },
      });
    } else {
      const memoryDoc = memoryResumes.get(userId);
      if (!memoryDoc) {
        return res.status(404).json({ message: 'No resume found.' });
      }
      return res.json({ resume: memoryDoc });
    }
  } catch (error) {
    console.error('Error getting resume:', error);
    return res.status(500).json({ message: 'Error retrieving resume', error: error.message });
  }
};
