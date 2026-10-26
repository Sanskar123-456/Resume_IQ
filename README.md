# 🚀 AI-Powered Job Application Assistant

An intelligent, full-stack application built to analyze resumes against job descriptions, calculate ATS Job Match Scores, extract missing skills & keywords, suggest bullet-point improvements, and provide an interactive AI Career Coach Q&A assistant.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Tailwind CSS (v4), Framer Motion, Lucide React, Axios, Vite
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication, Multer
- **AI Engine:** Google Gemini API (`@google/genai` SDK using `gemini-3.8-flash`)
- **Document Processing:** `pdf-parse` for PDF text extraction

---

## 📋 Features

1. 📄 **PDF Resume Upload & Text Extraction:** Drag & drop PDF resumes to extract structured skills, work history, education, and contact details.
2. 🔍 **Job Description Analysis:** Input target job title, company, and job posting requirements.
3. 📊 **Job Match Score (0-100%):** Calculates overall match score and sub-scores (Skills Alignment %, Experience Overlap %, Education/Credentials %).
4. ⚠️ **Missing Skills & Keyword Matrix:** Highlights matched skills vs missing ATS keywords with priority levels (High, Medium, Low).
5. ✍️ **Tailored Resume Bullet Point Suggestions:** Before & after rewrites incorporating missing keywords, complete with one-click copy buttons.
6. 💬 **Interactive AI Resume Q&A Chatbot:** Ask questions about tailoring your resume, writing cover letters, or interview preparation.
7. 💾 **Saved Application History:** Store and revisit past job application match reports.
8. ⚡ **Instant Sample Demo:** Built-in sample candidate and job posting for one-click testing.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local or MongoDB Atlas URI)
- **Google Gemini API Key** (Get one at [Google AI Studio](https://aistudio.google.com/))

### 2. Configure Backend
Navigate to the `server` directory and add your Gemini API Key in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-job-assistant
JWT_SECRET=super_secret_jwt_key_job_assistant_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### 3. Start Frontend
Navigate to the `client` directory:
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 📁 Project Structure

```
ai-job-assistant/
├── server/
│   ├── config/
│   │   ├── db.js             # Mongoose connection logic with fallback
│   │   └── gemini.js         # @google/genai Gemini SDK client setup
│   ├── controllers/
│   │   ├── authController.js # JWT registration & login
│   │   ├── resumeController.js# PDF upload & structured resume extraction
│   │   ├── jobController.js   # Match analysis & score calculation
│   │   └── chatController.js  # Resume Q&A chatbot endpoint
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT auth with guest fallback
│   │   └── uploadMiddleware.js # Multer PDF memory storage
│   ├── models/               # User, Resume, JobAnalysis, ChatHistory schemas
│   ├── routes/               # Express API routes (/api/auth, /api/resume, /api/job, /api/chat)
│   ├── utils/
│   │   ├── pdfParser.js      # pdf-parse utility
│   │   └── aiPrompts.js      # Gemini gemini-3.8-flash prompt templates & fallback matching
│   └── server.js             # Main Express server entry point
│
└── client/
    ├── src/
    │   ├── components/       # FileUpload, JobInput, MatchScoreCard, SkillsBreakdown, SuggestionsList, ChatAssistant, AuthModal, HistoryView
    │   ├── context/          # AuthContext, AppContext
    │   ├── services/         # Axios API wrapper
    │   ├── App.jsx           # Main layout & dashboard
    │   └── main.jsx          # Entry point
    └── vite.config.js        # Vite config with API proxy to port 5000
```
👨‍💻 Author

Sanskar Chaurasia
