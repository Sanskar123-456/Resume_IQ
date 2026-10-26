import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Target, BarChart3, FileText,
  MessageSquare, History, Users, GraduationCap, Briefcase, RefreshCw, Lock,
  ChevronDown, Check, AlertTriangle, UserPlus, Upload, ClipboardList, Rocket, LogIn
} from 'lucide-react';

const MODULES = [
  {
    tab: 'dashboard',
    icon: BarChart3,
    title: 'Match Analysis',
    text: 'Compare your resume with any job posting and receive an objective 0–100 match score with a clear breakdown.',
    points: ['Skills, experience and education sub-scores', 'Matched and missing skills, ranked by priority', 'Executive summary of strengths and risks'],
  },
  {
    tab: 'resume',
    icon: FileText,
    title: 'My Resume',
    text: 'Upload a PDF or paste your resume text. We turn it into structured, easy-to-review professional data.',
    points: ['PDF upload or pasted text', 'Skills, experience, education and projects', 'One master resume reused across analyses'],
  },
  {
    tab: 'chat',
    icon: MessageSquare,
    title: 'AI Advisor',
    text: 'A career coach that already knows your resume and the target role, ready for any question you have.',
    points: ['Cover letters and tailored summaries', 'Interview preparation and likely questions', 'Structured, copy-ready answers'],
  },
  {
    tab: 'history',
    icon: History,
    title: 'History',
    text: 'Every analysis is saved to your account, so you can revisit and compare applications at any time.',
    points: ['Company and role records', 'Match score for each application', 'Reopen any past report in one click'],
  },
];

const STEPS = [
  { icon: UserPlus, title: 'Create your account', text: 'Register free with your Gmail address and a secure password.' },
  { icon: Upload, title: 'Add your resume', text: 'Upload a PDF or paste text. Your profile is structured automatically.' },
  { icon: ClipboardList, title: 'Add the target role', text: 'Paste the job posting you want to apply for.' },
  { icon: Rocket, title: 'Act on the insights', text: 'Review your score, close keyword gaps and apply with confidence.' },
];

const AUDIENCES = [
  { icon: Briefcase, title: 'Job seekers', text: 'Tailor each application to the role instead of sending one generic resume.' },
  { icon: RefreshCw, title: 'Career switchers', text: 'See exactly which skills transfer and which gaps to address first.' },
  { icon: GraduationCap, title: 'Graduates', text: 'Present projects and coursework in the language recruiters look for.' },
  { icon: Users, title: 'Experienced professionals', text: 'Position your experience precisely for senior and specialised roles.' },
];

const DIFFERENTIATORS = [
  { title: 'Role-specific, not generic', text: 'Every score and suggestion is based on the exact posting you provide.' },
  { title: 'Actionable output', text: 'Before-and-after bullet rewrites you can paste straight into your resume.' },
  { title: 'Context-aware coaching', text: 'The advisor works with your real resume and analysis, not templates.' },
  { title: 'Everything in one workspace', text: 'Resume, analysis, coaching and history are connected in one place.' },
];

const FAQS = [
  {
    q: 'How is the match score calculated?',
    a: 'Our AI engine, powered by Google Gemini, compares your structured resume with the requirements in the job posting. It evaluates skills, relevant experience and education, then returns an overall 0–100 score with a breakdown for each area.',
  },
  {
    q: 'Who can create an account?',
    a: 'Anyone with a Gmail address. Registration is free, requires a strong password and does not need a credit card. All tools are available to signed-in users.',
  },
  {
    q: 'Which resume formats are supported?',
    a: 'You can upload a PDF file or paste your resume as plain text. Either way, the content is converted into a structured profile used across all tools.',
  },
  {
    q: 'Will the platform rewrite my resume bullet points?',
    a: 'Yes. Each analysis includes suggested rewrites that work missing keywords into your existing bullet points, with the reasoning behind every change.',
  },
  {
    q: 'How is my account protected?',
    a: 'Passwords are stored in hashed form and every request is authenticated with a secure session token. You can only access your own resume, analyses and history.',
  },
];

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const Eyebrow = ({ children }) => (
  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-[#7C3AED]">{children}</span>
);

const LandingPage = () => {
  const { setActiveTab } = useApp();
  const { user, openAuthModal } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  // Signed in -> straight to the tool; signed out -> Sign Up form
  const handleGetStarted = () => (user ? setActiveTab('dashboard') : openAuthModal('register'));

  return (
    <div className="pb-8">

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#EDE9FE]/70 via-[#F8F7FF] to-[#F8F7FF]" />
        <div className="absolute -top-24 right-0 w-[520px] h-[520px] rounded-full bg-[#7C3AED]/10 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 grid lg:grid-cols-12 gap-12 items-center">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDD6FE] text-xs font-semibold text-[#6D28D9] shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Intelligent career matching and talent insights.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-[#1E1B4B] leading-[1.1]">
              Optimize your resume. Elevate your career,{' '}
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">before you apply.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed">
              Resume_IQ analyses your resume against any job posting, shows you precisely where you stand, and guides you on what to improve, so every application is stronger than the last.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGetStarted}
                className="px-7 py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-lg shadow-[#7C3AED]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {user ? 'Go to My Dashboard' : 'Sign Up for Free'}
                <ArrowRight className="w-4 h-4" />
              </button>
              {!user && (
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#F5F3FF] text-[#1E1B4B] border border-[#DDD6FE] font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-[#7C3AED]" />
                  Sign In
                </button>
              )}
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#475569]">
              {['Free to join', 'No credit card required', 'Secure, private workspace'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Illustrative report preview */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#DDD6FE] shadow-2xl shadow-[#7C3AED]/15 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E1B4B]">Match Analysis Report</p>
                    <p className="text-[11px] text-[#64748B]">Illustrative example</p>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9061F9] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#7C3AED]/30">
                  82%
                </div>
              </div>

              <div className="space-y-3">
                {[['Skills alignment', 85], ['Experience relevance', 78], ['Education fit', 90]].map(([label, val]) => (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] font-semibold text-[#475569] mb-1">
                      <span>{label}</span><span>{val}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#EDE9FE] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="flex items-center gap-1.5 font-bold text-emerald-800"><CheckCircle2 className="w-3.5 h-3.5" /> Matched</p>
                  <p className="mt-1 text-emerald-900/80">React, Node.js, MongoDB</p>
                </div>
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
                  <p className="flex items-center gap-1.5 font-bold text-rose-800"><AlertTriangle className="w-3.5 h-3.5" /> Gaps</p>
                  <p className="mt-1 text-rose-900/80">TypeScript, Docker</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] p-3 text-xs text-[#1E1B4B]">
                <p className="flex items-center gap-1.5 font-bold text-[#6D28D9] mb-1"><Sparkles className="w-3.5 h-3.5" /> Recommended action</p>
                Add TypeScript and Docker experience to your project and work-history bullets.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CAPABILITY STRIP ============ */}
      <section className="border-y border-[#DDD6FE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
          {[
            ['Resume intelligence', 'PDF or text, parsed into structured data'],
            ['Objective match scoring', '0–100 score with detailed breakdown'],
            ['Keyword gap detection', 'Missing skills ranked by priority'],
            ['Personal AI advisor', 'Coaching based on your own resume'],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="text-sm font-bold text-[#1E1B4B]">{t}</p>
              <p className="text-xs text-[#64748B] mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PLATFORM MODULES ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div {...fade} className="max-w-2xl space-y-3">
          <Eyebrow>The platform</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] tracking-tight">One workspace for your entire application process</h2>
          <p className="text-[#475569] leading-relaxed">Four connected tools, included with every free account.</p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.title}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-white rounded-2xl border border-[#DDD6FE] p-7 hover:border-[#7C3AED] hover:shadow-xl hover:shadow-[#7C3AED]/10 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                  <m.icon className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#1E1B4B]">{m.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{m.text}</p>
                  <ul className="space-y-1.5 pt-1">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-xs text-[#334155]">
                        <Check className="w-3.5 h-3.5 mt-0.5 text-[#7C3AED] shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setActiveTab(m.tab)} className="pt-1 text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer">
                    {user ? `Open ${m.title}` : 'Sign in to access'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS (dark band) ============ */}
      <section className="bg-[#1E1B4B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div {...fade} className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A78BFA]">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">From sign-up to a stronger application in four steps</h2>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div key={s.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-[#7C3AED] flex items-center justify-center"><s.icon className="w-5 h-5" /></div>
                  <span className="text-3xl font-black text-white/15">0{i + 1}</span>
                </div>
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHO IT'S FOR ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div {...fade} className="max-w-2xl space-y-3">
          <Eyebrow>Who it is for</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] tracking-tight">Built for every stage of a career</h2>
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIENCES.map((a, i) => (
            <motion.div key={a.title} {...fade} transition={{ duration: 0.5, delay: i * 0.07 }} className="bg-white rounded-2xl border border-[#DDD6FE] p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center"><a.icon className="w-5 h-5" /></div>
              <h3 className="font-bold text-[#1E1B4B]">{a.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{a.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ WHY Resume_IQ + SECURITY ============ */}
      <section className="bg-white border-y border-[#DDD6FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-12 gap-12">
          <motion.div {...fade} className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <Eyebrow>Why Resume_IQ</Eyebrow>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] tracking-tight">Clear insight, practical next steps</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {DIFFERENTIATORS.map((d) => (
                <div key={d.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7C3AED] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-[#1E1B4B] text-sm">{d.title}</h3>
                    <p className="text-sm text-[#475569] leading-relaxed mt-1">{d.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-5">
            <div className="rounded-2xl bg-gradient-to-br from-[#F5F3FF] to-white border border-[#DDD6FE] p-8 space-y-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-[#1E1B4B]">Security you can rely on</h3>
              <ul className="space-y-3 text-sm text-[#334155]">
                {[
                  'Access limited to registered, signed-in users',
                  'Passwords stored in hashed form',
                  'Authenticated sessions for every request',
                  'Your resume and history are visible only to you',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5"><Lock className="w-4 h-4 mt-0.5 text-[#7C3AED] shrink-0" /> {t}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="max-w-3xl mx-auto px-4 py-24">
        <motion.div {...fade} className="text-center space-y-3 mb-10">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-3xl font-extrabold text-[#1E1B4B] tracking-tight">Frequently asked questions</h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.q} className="bg-white rounded-xl border border-[#DDD6FE] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-[#1E1B4B] hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#7C3AED] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-sm text-[#475569] leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#3B2A8C] to-[#6D28D9] px-8 py-14 sm:px-14 text-center text-white">
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">Ready to make your next application count?</h2>
            <p className="text-white/75 max-w-xl mx-auto">Create your free account and get your first match analysis in minutes.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleGetStarted}
                className="px-8 py-3.5 rounded-xl bg-white text-[#6D28D9] font-extrabold text-sm hover:bg-[#F5F3FF] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {user ? 'Go to My Dashboard' : 'Sign Up for Free'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/55">No credit card required</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
