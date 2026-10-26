import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
    console.log('✅ Gemini API Client initialized successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize Gemini API Client:', err.message);
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY is not configured in server/.env. AI features will use fallback heuristic matching.');
}

export { aiClient };
