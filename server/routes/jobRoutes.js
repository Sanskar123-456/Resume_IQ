import express from 'express';
import { analyzeJob, getAnalysisHistory, getAnalysisById, deleteAnalysis } from '../controllers/jobController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', authMiddleware, analyzeJob);
router.get('/history', authMiddleware, getAnalysisHistory);
router.get('/:id', authMiddleware, getAnalysisById);
router.delete('/:id', authMiddleware, deleteAnalysis);

export default router;
