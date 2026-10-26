import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Bot, Loader2, HelpCircle, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import MarkdownMessage from './MarkdownMessage';
import Avatar from './Avatar';

const SUGGESTED_PROMPTS = [
  "What are the top 3 missing skills I must add first?",
  "How should I explain missing cloud experience in an interview?",
  "Can you write a 3-paragraph tailored cover letter for this job?",
  "What technical interview questions might they ask based on this JD?"
];

const formatTime = (ts) => {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const CopyAnswer = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-[10px] font-semibold text-[#64748B] hover:text-[#7C3AED] transition-colors cursor-pointer">
      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy answer'}
    </button>
  );
};

const ChatAssistant = () => {
  const { chatMessages, sendChatMessage, isChatting, currentAnalysis } = useApp();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);
  const lastMsgRef = useRef(null);
  const inputRef = useRef(null);
  const didMount = useRef(false);

  // Scroll ONLY the chat box (never the whole page, which used to jump to the footer).
  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;

    if (!didMount.current) {
      didMount.current = true;
      box.scrollTop = box.scrollHeight;
      return;
    }

    const last = chatMessages[chatMessages.length - 1];
    if (last?.role === 'assistant' && lastMsgRef.current && !isChatting) {
      // New answer: show it from its first line so nothing is missed
      const top = box.scrollTop + (lastMsgRef.current.getBoundingClientRect().top - box.getBoundingClientRect().top) - 12;
      box.scrollTo({ top, behavior: 'smooth' });
    } else {
      box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages, isChatting]);

  const submit = (text) => {
    if (!text.trim() || isChatting) return;
    sendChatMessage(text);
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const msg = inputText;
    setInputText('');
    submit(msg);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DDD6FE] shadow-xl flex flex-col h-[calc(100vh-170px)] min-h-[520px] max-h-[760px] overflow-hidden">

      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] border-b border-[#DDD6FE] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AI Resume & Career Advisor
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            </h3>
            <p className="text-xs text-white/75">
              {currentAnalysis ? `Context loaded: ${currentAnalysis.jobTitle}` : 'Ask questions about your resume & job match'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-5 bg-[#F8F7FF]">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#475569] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#1E1B4B]">Ask any question about your resume!</p>
            <p className="text-xs max-w-sm text-[#64748B]">I can help rewrite bullet points, draft cover letters, bridge missing skill gaps, or prep for interviews.</p>
          </div>
        ) : (
          chatMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const isLast = idx === chatMessages.length - 1;
            return (
              <motion.div
                key={idx}
                ref={isLast ? lastMsgRef : null}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {isUser ? (
                  <Avatar name={user?.name} size={32} />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                {isUser ? (
                  <div className="max-w-[78%] p-3.5 rounded-2xl rounded-tr-none text-xs leading-relaxed bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-[#7C3AED]/20 whitespace-pre-wrap">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[92%] min-w-0 flex-1">
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-[#DDD6FE] shadow-sm">
                      <MarkdownMessage text={msg.text} />
                    </div>
                    <div className="flex items-center justify-between px-1 pt-1.5">
                      <span className="text-[10px] text-[#94A3B8]">JobPulse AI Advisor · {formatTime(msg.timestamp)}</span>
                      <CopyAnswer text={msg.text} />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {isChatting && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-white border border-[#DDD6FE] text-[#475569] text-xs flex items-center gap-2 shadow-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C3AED]" />
              Preparing your personalised answer...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-[#F5F3FF] border-t border-[#DDD6FE] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-[#475569] whitespace-nowrap flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#7C3AED]" /> Quick Prompts:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => submit(prompt)}
            disabled={isChatting}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] hover:text-[#6D28D9] text-[11px] whitespace-nowrap transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#DDD6FE] flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI about tailoring your resume or interview prep..."
          className="flex-1 p-2.5 bg-[#F8F7FF] border border-[#DDD6FE] rounded-xl text-xs text-[#1E1B4B] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isChatting}
          className="p-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-all disabled:opacity-50 shadow-md shadow-[#7C3AED]/30 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

export default ChatAssistant;
