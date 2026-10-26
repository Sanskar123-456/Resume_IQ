import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Sparkles, FileText, BarChart3, History, MessageSquare, LogIn, LogOut, UserPlus, Home } from 'lucide-react';
import Avatar from './Avatar';
import logo from "../assets/logo.png";

const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { activeTab, setActiveTab, currentResume, currentAnalysis } = useApp();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F8F7FF]/90 backdrop-blur-md border-b border-[#DDD6FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-[#7C3AED]/20">
                <img
                  src={logo}
                  alt="Resume_IQ Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#1E1B4B]">
                  Resume_IQ 
                </span>
                <p className="text-[11px] text-[#64748B] -mt-0.5">AI-powered resume analysis and optimization.</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#DDD6FE] shadow-sm">
              
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'home'
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30'
                    : 'text-[#475569] hover:text-[#1E1B4B] hover:bg-[#F5F3FF]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30'
                    : 'text-[#475569] hover:text-[#1E1B4B] hover:bg-[#F5F3FF]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Match Analysis
                {currentAnalysis && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('resume')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'resume'
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30'
                    : 'text-[#475569] hover:text-[#1E1B4B] hover:bg-[#F5F3FF]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                My Resume
                {currentResume && (
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30'
                    : 'text-[#475569] hover:text-[#1E1B4B] hover:bg-[#F5F3FF]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                AI Advisor
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30'
                    : 'text-[#475569] hover:text-[#1E1B4B] hover:bg-[#F5F3FF]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                History
              </button>
            </nav>

            {/* User Auth Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white border border-[#DDD6FE] shadow-sm" title={user.email}>
                    <Avatar name={user.name} size={32} ring />
                    <div className="hidden sm:block leading-tight">
                      <span className="block text-xs font-bold text-[#1E1B4B] max-w-[110px] truncate">{user.name}</span>
                      <span className="block text-[10px] text-[#64748B] max-w-[110px] truncate">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setActiveTab('home'); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#7C3AED] border border-[#DDD6FE] hover:bg-[#F5F3FF] transition-all cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Sign Up Free
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

    </>
  );
};

export default Navbar;
