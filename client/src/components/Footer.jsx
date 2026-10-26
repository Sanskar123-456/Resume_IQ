import React, { useState } from 'react';
import { Sparkles, Heart, Shield, CheckCircle2, Github, Twitter, Linkedin, Send, ExternalLink } from 'lucide-react';
import logo from "../assets/logo.png";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-white border-t border-[#DDD6FE] text-[#1E1B4B] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-[#DDD6FE]/70">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-[#7C3AED]/20">
  <img
    src={logo}
    alt="Resume_IQ Logo"
    className="w-full h-full object-contain"
  />
</div>
              <span className="font-extrabold text-2xl tracking-tight text-[#1E1B4B]">
                Resume_IQ 
              </span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed max-w-sm">
              The next-generation AI resume companion. Analyze job descriptions, benchmark ATS compatibility, bridge critical skill gaps, and interview with confidence.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#7C3AED] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All AI Engine Systems Operational
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 bg-[#F8F7FF] rounded-2xl p-6 border border-[#DDD6FE] space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-[#1E1B4B]">Stay Ahead of ATS Algorithms</h4>
                <p className="text-xs text-[#475569]">Receive monthly ATS updates, trending technical keywords, and resume strategies.</p>
              </div>
              <span className="text-[11px] font-semibold text-[#7C3AED] bg-white border border-[#DDD6FE] px-2.5 py-1 rounded-full whitespace-nowrap">
                No spam. Ever.
              </span>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your professional email address..."
                className="flex-1 px-4 py-2.5 bg-white border border-[#DDD6FE] rounded-xl text-xs text-[#1E1B4B] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-xs transition-all shadow-md shadow-[#7C3AED]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Subscribed!
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Subscribe Free
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#DDD6FE]/70 text-xs">
          
          {/* Column 1 */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#1E1B4B] uppercase tracking-wider">Product Features</h5>
            <ul className="space-y-2 text-[#475569]">
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">PDF Resume Parser</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">ATS Job Match Scoring</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Missing Keyword Heatmap</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Bullet Point AI Rewriter</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">AI Career Coach Q&A</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#1E1B4B] uppercase tracking-wider">AI Intelligence</h5>
            <ul className="space-y-2 text-[#475569]">
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Gemini 3.5 Flash Model</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Semantic Vector Matching</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">ATS Filter Simulation</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Multi-turn Conversational AI</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">High-Availability Fallbacks</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#1E1B4B] uppercase tracking-wider">Career Resources</h5>
            <ul className="space-y-2 text-[#475569]">
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">2026 Tech Resume Guide</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">How ATS Algorithms Score You</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Top 100 Tech Action Verbs</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Software Engineer Salary Prep</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Cover Letter Blueprints</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-[#1E1B4B] uppercase tracking-wider">Trust & Security</h5>
            <ul className="space-y-2 text-[#475569]">
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Private Memory Processing
              </li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Zero Model Training on Data</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">JWT Authenticated Sessions</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-[#7C3AED] cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Socials, Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 Resume_IQ AI Technologies. Crafted with <Heart className="w-3 h-3 text-[#7C3AED] inline fill-[#7C3AED]" /> for ambitious career seekers.</p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
