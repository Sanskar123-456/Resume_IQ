import express from 'express';
import { uploadAndParseResume, getLatestResume } from '../controllers/resumeController.js';
import { uploadPdf } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', authMiddleware, (req, res, next) => {
  uploadPdf.single('resume')(req, res, (err) => {
    if (err) {
      console.error('⚠️ Multer upload error:', err.message);
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    next();
  });
}, uploadAndParseResume);

router.get('/latest', authMiddleware, getLatestResume);

export default router;
