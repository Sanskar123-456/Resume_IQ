import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

const MatchScoreCard = ({ analysis }) => {
  if (!analysis) return null;

  const result = analysis.analysisResult || {};
  const score = result.overallMatchScore || 0;
  const breakdown = result.scoreBreakdown || { skillMatch: score, experienceMatch: score, educationMatch: score };

  // Determine score color grade
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  let badgeLabel = 'High Match Rate';

  if (score < 50) {
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-300';
    badgeLabel = 'Needs Revision';
  } else if (score < 75) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-300';
    badgeLabel = 'Moderate Match';
  }

  // Calculate SVG stroke parameters for circular progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-[#DDD6FE] p-6 sm:p-8 shadow-sm relative overflow-hidden"
    >
      {/* Background soft lavender radial glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#DDD6FE]/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Score Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-[#DDD6FE]"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-current text-[#7C3AED]"
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black bg-gradient-to-tr from-[#7C3AED] to-[#9061F9] bg-clip-text text-transparent">
                {score}%
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">Match Score</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${badgeColor}`}>
              <Zap className="w-3.5 h-3.5" />
              {badgeLabel}
            </div>
            <h3 className="text-xl font-extrabold text-[#1E1B4B]">
              {analysis.jobTitle || 'Target Position'}
            </h3>
            <p className="text-xs text-[#64748B]">
              {analysis.jobCompany || 'Target Employer'} • ATS Optimization Overview
            </p>
          </div>
        </div>

        {/* Breakdown Sub-meters */}
        <div className="w-full md:w-80 bg-[#F8F7FF] p-5 rounded-2xl border border-[#DDD6FE] space-y-3.5">
          <div className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-1">
            Breakdown Metrics
          </div>

          {/* Skill Match */}
          <div>
            <div className="flex justify-between text-xs text-[#475569] font-medium mb-1">
              <span>Skill Alignment</span>
              <span className="text-[#7C3AED] font-bold">{breakdown.skillMatch}%</span>
            </div>
            <div className="w-full bg-[#DDD6FE]/60 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${breakdown.skillMatch}%` }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] h-full rounded-full"
              />
            </div>
          </div>

          {/* Experience Match */}
          <div>
            <div className="flex justify-between text-xs text-[#475569] font-medium mb-1">
              <span>Experience Match</span>
              <span className="text-indigo-600 font-bold">{breakdown.experienceMatch}%</span>
            </div>
            <div className="w-full bg-[#DDD6FE]/60 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${breakdown.experienceMatch}%` }}
                transition={{ duration: 1, delay: 0.1 }}
                className="bg-gradient-to-r from-indigo-500 to-indigo-300 h-full rounded-full"
              />
            </div>
          </div>

          {/* Education / Qualification */}
          <div>
            <div className="flex justify-between text-xs text-[#475569] font-medium mb-1">
              <span>Education & Credentials</span>
              <span className="text-violet-600 font-bold">{breakdown.educationMatch}%</span>
            </div>
            <div className="w-full bg-[#DDD6FE]/60 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${breakdown.educationMatch}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-gradient-to-r from-violet-500 to-purple-300 h-full rounded-full"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Executive Recruiter AI Summary */}
      {result.executiveSummary && (
        <div className="mt-6 pt-4 border-t border-[#DDD6FE] bg-[#F5F3FF] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 px-6 sm:px-8 border-b-0 flex items-start gap-3 text-xs text-[#334155]">
          <ShieldCheck className="w-5 h-5 text-[#7C3AED] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#1E1B4B] font-bold block mb-0.5">Recruiter AI Verdict:</strong>
            {result.executiveSummary}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MatchScoreCard;
