import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Sparkles, Loader2, BookOpen, AlertCircle } from 'lucide-react';

const SAMPLES = [
  {
    title: 'Senior Full Stack Engineer (React + Node)',
    company: 'CloudScale AI',
    desc: `Role: Senior Full Stack Engineer (React + Node)
Company: CloudScale AI

About the Role:
We are seeking a Senior Full Stack Engineer to lead front-end and API architecture for our enterprise AI platform.

Key Responsibilities:
- Design and build responsive frontend applications using React.js, TypeScript, and Tailwind CSS.
- Architect high-throughput Node.js microservices and REST/GraphQL APIs.
- Utilize Docker and Kubernetes for containerized deployment on AWS.
- Drive automated unit testing (Jest/Cypress) and CI/CD pipeline automation.

Requirements:
- 4+ years of full stack software engineering experience.
- Deep proficiency with React.js, TypeScript, Node.js, and MongoDB/PostgreSQL.
- Experience with AWS, Docker, CI/CD pipelines, and Jest testing.
`
  },
  {
    title: 'Frontend Developer (React + Tailwind)',
    company: 'PixelCraft Labs',
    desc: `Role: Frontend Developer (React + Tailwind)
Company: PixelCraft Labs

Responsibilities:
- Build interactive web applications using React.js, Next.js, and Framer Motion.
- Translate Figma designs into pixel-perfect, accessible Tailwind CSS components.
- Optimize web performance, Core Web Vitals, and Lighthouse scores.

Requirements:
- 2+ years experience in Frontend Web Development with React.js.
- Expert knowledge of HTML, CSS, JavaScript (ES6+), and Tailwind CSS.
- Familiarity with REST APIs, Git, and state management libraries.
`
  },
  {
    title: 'Backend Node.js Engineer',
    company: 'FinTech Secure',
    desc: `Role: Backend Node.js Engineer
Company: FinTech Secure

Responsibilities:
- Build scalable payment processing APIs using Node.js, Express.js, and TypeScript.
- Design database schemas and optimize query performance in MongoDB & PostgreSQL.
- Implement JWT authentication, RBAC, and rate limiting security controls.

Requirements:
- 3+ years experience with Node.js backend development.
- Strong knowledge of RESTful API design, database indexing, and Redis caching.
- Experience with Docker, microservices, and AWS services (S3, ECS).
`
  }
];

const JobInput = () => {
  const { analyzeJobDescription, currentResume, isAnalyzing, error } = useApp();
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSelectSample = (sample) => {
    setJobTitle(sample.title);
    setJobCompany(sample.company);
    setJobDescription(sample.desc);
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!jobDescription || jobDescription.trim().length < 20) {
      setLocalError('Please enter a detailed job description (at least 20 characters).');
      return;
    }

    if (!currentResume) {
      setLocalError('Please upload or paste a resume first in Step 1!');
      return;
    }

    try {
      await analyzeJobDescription(jobTitle || 'Target Position', jobCompany || 'Company', jobDescription);
    } catch (err) {
      // Handled by context
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DDD6FE] p-6 shadow-sm hover:shadow-md transition-shadow relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E1B4B]">2. Target Job Description</h2>
            <p className="text-xs text-[#64748B]">Paste the job posting to calculate match score & missing keywords</p>
          </div>
        </div>

        {/* Quick Sample Selector */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F8F7FF] border border-[#DDD6FE] text-[#7C3AED] hover:bg-[#F5F3FF] transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Load Sample Job
          </button>
          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#DDD6FE] rounded-2xl shadow-xl p-2 z-30 hidden group-hover:block transition-all">
            <p className="text-[10px] font-bold text-[#7C3AED] px-2 py-1 uppercase tracking-wider">Select Sample Role:</p>
            {SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="w-full text-left p-2 rounded-xl hover:bg-[#F5F3FF] text-xs transition-colors"
              >
                <div className="font-semibold text-[#1E1B4B]">{sample.title}</div>
                <div className="text-[11px] text-[#64748B]">{sample.company}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {(localError || error) && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#1E1B4B] mb-1">Job Title (Optional)</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full p-2.5 bg-[#F8F7FF] border border-[#DDD6FE] rounded-xl text-xs text-[#1E1B4B] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1B4B] mb-1">Company Name (Optional)</label>
            <input
              type="text"
              value={jobCompany}
              onChange={(e) => setJobCompany(e.target.value)}
              placeholder="e.g. Google / Microsoft / Startup"
              className="w-full p-2.5 bg-[#F8F7FF] border border-[#DDD6FE] rounded-xl text-xs text-[#1E1B4B] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1E1B4B] mb-1">Job Description Requirements *</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            placeholder="Paste the full job posting requirements, responsibilities, and qualifications..."
            className="w-full p-3 bg-[#F8F7FF] border border-[#DDD6FE] rounded-2xl text-xs text-[#1E1B4B] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !jobDescription.trim()}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-[#7C3AED]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gemini AI Comparing Resume ↔ Job Requirements...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              Generate Match Score & Tailor Resume
            </>
          )}
        </button>
      </form>

    </div>
  );
};

export default JobInput;
