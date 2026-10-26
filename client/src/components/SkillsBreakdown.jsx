import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Search, Tag, Info } from 'lucide-react';

const SkillsBreakdown = ({ result }) => {
  if (!result) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const matchingSkills = result.matchingSkills || [];
  const missingSkills = result.missingSkills || [];
  const missingKeywords = result.missingKeywords || [];

  const filteredMatching = matchingSkills.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMissing = missingSkills.filter(m =>
    m.skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-[#DDD6FE] p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#1E1B4B] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#7C3AED]" />
            Skills & Keyword Comparison Matrix
          </h3>
          <p className="text-xs text-[#64748B]">
            Identify skills present in your resume vs crucial missing ATS keywords
          </p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills or keywords..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8F7FF] border border-[#DDD6FE] rounded-xl text-xs text-[#1E1B4B] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#DDD6FE]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills Column */}
        <div className="bg-[#F8F7FF] rounded-2xl p-5 border border-emerald-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Matching Skills Found ({matchingSkills.length})
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              ATS Verified
            </span>
          </div>

          {filteredMatching.length === 0 ? (
            <p className="text-xs text-[#64748B] italic">No matching skills found matching search.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredMatching.map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE] text-[#7C3AED] text-xs font-bold shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {skill}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills Column */}
        <div className="bg-[#FFF5F5] rounded-2xl p-5 border border-rose-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-200">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Missing Skills & Keywords ({missingSkills.length})
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
              Action Required
            </span>
          </div>

          {filteredMissing.length === 0 ? (
            <p className="text-xs text-[#64748B] italic">No missing skills matching search criteria.</p>
          ) : (
            <div className="space-y-2.5">
              {filteredMissing.map((item, idx) => {
                const isHigh = item.importance === 'High';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="p-3 bg-white rounded-xl border border-rose-200 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-sm font-bold text-rose-900">{item.skill}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isHigh ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                        }`}
                      >
                        {item.importance || 'Medium'} Priority
                      </span>
                    </div>
                    {item.reason && (
                      <p className="text-[11px] text-[#64748B] mt-1.5 flex items-start gap-1">
                        <Info className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                        {item.reason}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ATS Keyword Checklist */}
      {missingKeywords.length > 0 && (
        <div className="bg-[#F8F7FF] p-5 rounded-2xl border border-[#DDD6FE]">
          <h4 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider mb-2.5">
            Critical ATS Keywords Missing in Resume:
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-white border border-[#DDD6FE] text-[#7C3AED] text-xs font-mono font-bold shadow-sm"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default SkillsBreakdown;
