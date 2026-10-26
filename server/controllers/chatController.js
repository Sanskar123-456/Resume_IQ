import { answerResumeQuestion } from '../utils/aiPrompts.js';
import { ChatHistory } from '../models/ChatHistory.js';
import { isMongoConnected } from '../config/db.js';

// In-memory fallback chat history
const memoryChats = new Map();

export const sendChatMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, parsedResume, jobAnalysis, history = [], analysisId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    console.log(`💬 Processing Q&A message: "${message.substring(0, 50)}..."`);

    const assistantReply = await answerResumeQuestion(
      parsedResume || {},
      jobAnalysis || {},
      history,
      message
    );

    const updatedHistory = [
      ...history,
      { role: 'user', text: message, timestamp: new Date() },
      { role: 'assistant', text: assistantReply, timestamp: new Date() },
    ];

    if (isMongoConnected && analysisId) {
      try {
        await ChatHistory.findOneAndUpdate(
          { userId, analysisId },
          { userId, analysisId, messages: updatedHistory },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        console.warn('⚠️ Could not persist chat history to MongoDB:', dbErr.message);
      }
    }

    memoryChats.set(`${userId}_${analysisId || 'default'}`, updatedHistory);

    return res.status(200).json({
      reply: assistantReply,
      history: updatedHistory,
    });
  } catch (error) {
    console.error('Error in sendChatMessage controller:', error);
    return res.status(500).json({ message: 'Failed to process chat message', error: error.message });
  }
};
