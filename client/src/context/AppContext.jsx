import React, { createContext, useContext, useState, useEffect } from 'react';
import { resumeService, jobService, chatService } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentResume, setCurrentResume] = useState(null);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [activeTab, setActiveTabRaw] = useState('home');
  const { user, openAuthModal } = useAuth();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [error, setError] = useState(null);

  // Every tab except 'home' is a signed-in-only service
  const setActiveTab = (tab) => {
    if (tab !== 'home' && !user) {
      openAuthModal('login');
      return;
    }
    setActiveTabRaw(tab);
  };

  // Load user data only when signed in; wipe everything on sign out
  useEffect(() => {
    if (user) {
      fetchLatestResume();
      fetchHistory();
    } else {
      setCurrentResume(null);
      setCurrentAnalysis(null);
      setHistoryList([]);
      setChatMessages([]);
      setError(null);
      setActiveTabRaw('home');
    }
  }, [user?.id]);

  const fetchLatestResume = async () => {
    try {
      const res = await resumeService.getLatestResume();
      if (res.data?.resume) {
        setCurrentResume(res.data.resume);
      }
    } catch (err) {
      // Resume not found yet
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await jobService.getHistory();
      if (res.data?.history) {
        setHistoryList(res.data.history);
      }
    } catch (err) {
      console.warn('Could not fetch history:', err.message);
    }
  };

  const uploadPdfResume = async (file) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await resumeService.uploadPdf(formData);
      setCurrentResume(res.data.resume);
      setIsUploading(false);
      return res.data;
    } catch (err) {
      setIsUploading(false);
      const msg = err.response?.data?.message || err.message || 'Failed to parse PDF resume';
      setError(msg);
      throw new Error(msg);
    }
  };

  const pasteResumeText = async (text, fileName = 'Pasted_Resume.txt') => {
    setIsUploading(true);
    setError(null);
    try {
      const res = await resumeService.pasteResumeText(text, fileName);
      setCurrentResume(res.data.resume);
      setIsUploading(false);
      return res.data;
    } catch (err) {
      setIsUploading(false);
      const msg = err.response?.data?.message || err.message || 'Failed to process resume text';
      setError(msg);
      throw new Error(msg);
    }
  };

  const analyzeJobDescription = async (jobTitle, jobCompany, jobDescription) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const payload = {
        jobTitle,
        jobCompany,
        jobDescription,
        parsedResume: currentResume?.parsedData,
        resumeId: currentResume?.id,
      };
      const res = await jobService.analyzeJob(payload);
      setCurrentAnalysis(res.data.analysis);
      fetchHistory();
      setIsAnalyzing(false);
      setActiveTab('dashboard');
      
      // Reset chat for new analysis
      setChatMessages([
        {
          role: 'assistant',
          text: `Hi! I've analyzed your resume against the "${jobTitle || 'target'}" job description. Your match score is ${res.data.analysis.analysisResult?.overallMatchScore}%. Ask me anything about tailoring your resume, fixing missing skills, or interview prep!`,
          timestamp: new Date(),
        }
      ]);

      return res.data.analysis;
    } catch (err) {
      setIsAnalyzing(false);
      const msg = err.response?.data?.message || err.message || 'Failed to analyze job description';
      setError(msg);
      throw new Error(msg);
    }
  };

  const sendChatMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const newMsg = { role: 'user', text: userMessage, timestamp: new Date() };
    const updatedHistory = [...chatMessages, newMsg];
    setChatMessages(updatedHistory);
    setIsChatting(true);

    try {
      const res = await chatService.sendMessage({
        message: userMessage,
        parsedResume: currentResume?.parsedData || {},
        jobAnalysis: currentAnalysis?.analysisResult || {},
        history: updatedHistory,
        analysisId: currentAnalysis?.id,
      });

      setChatMessages(res.data.history || [
        ...updatedHistory,
        { role: 'assistant', text: res.data.reply, timestamp: new Date() }
      ]);
    } catch (err) {
      setChatMessages([
        ...updatedHistory,
        { role: 'assistant', text: 'Sorry, I ran into an issue processing your request. Please try again.', timestamp: new Date() }
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const loadAnalysisFromHistory = async (id) => {
    try {
      const res = await jobService.getAnalysisById(id);
      setCurrentAnalysis(res.data.analysis);
      setActiveTab('dashboard');
    } catch (err) {
      setError('Failed to load past analysis');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentResume,
        currentAnalysis,
        historyList,
        activeTab,
        setActiveTab,
        isUploading,
        isAnalyzing,
        isChatting,
        chatMessages,
        error,
        uploadPdfResume,
        pasteResumeText,
        analyzeJobDescription,
        sendChatMessage,
        loadAnalysisFromHistory,
        fetchHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
