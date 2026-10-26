import React from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import JobInput from './components/JobInput';
import MatchScoreCard from './components/MatchScoreCard';
import SkillsBreakdown from './components/SkillsBreakdown';
import SuggestionsList from './components/SuggestionsList';
import ChatAssistant from './components/ChatAssistant';
import HistoryView from './components/HistoryView';
import ResumeDetailsView from './components/ResumeDetailsView';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MainContent = () => {
  const { activeTab, currentAnalysis, currentResume } = useApp();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-32 text-center text-sm text-[#64748B]">Loading...</div>;
  }

  /* Landing page — full-width. Signed-out users can never see anything else. */
  if (activeTab === 'home' || !user) {
    return <LandingPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner if no analysis performed yet */}
      {!currentAnalysis && activeTab === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 border border-[#DDD6FE] relative overflow-hidden bg-gradient-to-r from-[#EDE9FE] via-white to-[#F8F7FF]"
        >
          <div className="max-w-3xl space-y-3 relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] leading-tight">
              Optimize Your Resume for <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">Any Job Posting</span>
            </h1>
            <p className="text-[#475569] text-sm leading-relaxed">
              Upload your PDF resume, paste the target job description, and let AI calculate your match score, extract missing keywords, and suggest tailored bullet point rewrites to pass ATS screening.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Tab Render */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Top Inputs: Resume Upload & Job Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FileUpload />
            <JobInput />
          </div>

          {/* Analysis Results Display */}
          <AnimatePresence mode="wait">
            {currentAnalysis && (
              <motion.div
                key={currentAnalysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 pt-4 border-t border-[#DDD6FE]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[#1E1B4B] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7C3AED]" />
                    AI Match Analysis Report
                  </h2>
                  <span className="text-xs text-[#64748B]">
                    Generated for: <strong className="text-[#1E1B4B]">{currentAnalysis.jobTitle}</strong>
                  </span>
                </div>

                {/* Score Radial Card */}
                <MatchScoreCard analysis={currentAnalysis} />

                {/* Skills Comparison Matrix */}
                <SkillsBreakdown result={currentAnalysis.analysisResult} />

                {/* AI Section Improvement Suggestions */}
                <SuggestionsList suggestions={currentAnalysis.analysisResult?.sectionSuggestions} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {activeTab === 'resume' && (
        <div className="space-y-6">
          <FileUpload />
          <ResumeDetailsView />
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="max-w-4xl mx-auto">
          <ChatAssistant />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="max-w-4xl mx-auto">
          <HistoryView />
        </div>
      )}

    </div>
  );
};

export default function App() {
  const { authModal, closeAuthModal } = useAuth();
  return (
    <div className="min-h-screen bg-[#F8F7FF] text-[#1E1B4B] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <MainContent />
      </main>
      <Footer />
      {authModal.open && <AuthModal key={authModal.mode} initialMode={authModal.mode} onClose={closeAuthModal} />}
    </div>
  );
}
