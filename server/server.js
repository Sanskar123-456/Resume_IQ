import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

// Process safety to ensure server stays resilient and never crashes on unexpected errors
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception caught safely:', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection caught safely at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    service: 'AI Job Application Assistant API',
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/chat', chatRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('⚠️ Unhandled Server Error Middleware:', err.message);
  if (!res.headersSent) {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
    });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Job Assistant Server running on http://127.0.0.1:${PORT}`);
});

// Keepalive and timeout settings to prevent proxy drops
server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;
server.requestTimeout = 120000;
