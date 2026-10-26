import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUpload = ({ onComplete }) => {
  const { currentResume, uploadPdfResume, pasteResumeText, isUploading, error } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState('pdf'); // 'pdf' | 'text'
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProcessPdf = async () => {
    if (!selectedFile) return;
    try {
      await uploadPdfResume(selectedFile);
      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProcessText = async () => {
    if (!pastedText.trim()) return;
    try {
      await pasteResumeText(pastedText, 'Pasted_Resume.txt');
      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DDD6FE] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E1B4B] flex items-center gap-2">
              1. Upload Resume (PDF)
              {currentResume && (
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              )}
            </h2>
            <p className="text-xs text-[#64748B]">Upload your PDF resume or paste text to extract skills & details</p>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-[#F8F7FF] p-1 rounded-xl border border-[#DDD6FE]">
          <button
            onClick={() => setUploadMode('pdf')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              uploadMode === 'pdf' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-[#64748B] hover:text-[#1E1B4B]'
            }`}
          >
            PDF Upload
          </button>
          <button
            onClick={() => setUploadMode('text')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              uploadMode === 'text' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-[#64748B] hover:text-[#1E1B4B]'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* PDF Upload Mode */}
      {uploadMode === 'pdf' ? (
        <div>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#7C3AED] bg-[#F5F3FF]'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/50'
                : 'border-[#DDD6FE] hover:border-[#7C3AED] bg-[#F8F7FF]/60 hover:bg-[#F5F3FF]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#1E1B4B]">{selectedFile.name}</p>
                  <p className="text-xs text-[#64748B]">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB PDF Document</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#1E1B4B]">
                    Drag & drop your PDF resume here, or <span className="text-[#7C3AED] underline">browse</span>
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Supports PDF format up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            {selectedFile ? (
              <button
                onClick={handleProcessPdf}
                disabled={isUploading}
                className="w-full py-3 px-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-[#7C3AED]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Extracting Skills & Experience with Gemini AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Parse Resume & Extract Skills
                  </>
                )}
              </button>
            ) : currentResume ? (
              <div className="w-full p-3 rounded-2xl bg-[#F8F7FF] border border-[#DDD6FE] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-[#475569]">Active Resume: <strong className="text-[#1E1B4B]">{currentResume.fileName}</strong></span>
                </div>
                <span className="text-xs text-[#7C3AED] font-semibold">{currentResume.parsedData?.skills?.technical?.length || 0} Skills Extracted</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Text Paste Mode */
        <div>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your resume text here (Summary, Work Experience, Technical Skills, Education)..."
            rows={5}
            className="w-full p-3 bg-[#F8F7FF] border border-[#DDD6FE] rounded-2xl text-xs text-[#1E1B4B] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
          />
          <button
            onClick={handleProcessText}
            disabled={isUploading || !pastedText.trim()}
            className="w-full mt-3 py-3 px-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-[#7C3AED]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Parsing Resume Text...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Analyze Pasted Text
              </>
            )}
          </button>
        </div>
      )}

      {/* Extracted Quick Summary */}
      {currentResume?.parsedData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-[#DDD6FE]"
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#64748B] font-medium">Candidate Profile Identified:</span>
            <span className="text-[#7C3AED] font-bold">{currentResume.parsedData.fullName || 'User Profile'}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {currentResume.parsedData.skills?.technical?.map((skill, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] text-[11px] font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default FileUpload;
