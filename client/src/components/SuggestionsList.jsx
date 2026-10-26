import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Check, Copy, ArrowRight, Wand2 } from 'lucide-react';

const SuggestionsList = ({ suggestions }) => {
  if (!suggestions) return null;

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DDD6FE] p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
          <Wand2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#1E1B4B] flex items-center gap-2">
            AI Resume Improvement & Bullet Point Tailoring
          </h3>
          <p className="text-xs text-[#64748B]">
            Actionable recommendations to rewrite section bullets for maximum ATS match score
          </p>
        </div>
      </div>

      {/* Summary Improvement Suggestion */}
      {suggestions.summary && (
        <div className="bg-[#F8F7FF] rounded-2xl p-5 border border-[#DDD6FE] space-y-2">
          <div className="flex items-center gap-2 text-[#7C3AED] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Recommended Professional Summary Optimization
          </div>
          <p className="text-xs text-[#334155] leading-relaxed bg-white p-3.5 rounded-xl border border-[#DDD6FE] font-sans">
            "{suggestions.summary}"
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => handleCopy(suggestions.summary, 'summary')}
              className="flex items-center gap-1.5 text-xs text-[#7C3AED] hover:text-[#6D28D9] font-bold transition-colors cursor-pointer"
            >
              {copiedIndex === 'summary' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Summary!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Summary
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bullet Point Rewrites */}
      {suggestions.experience && suggestions.experience.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
            Experience Bullet Point Tailoring (Before ➔ After):
          </h4>

          <div className="space-y-3">
            {suggestions.experience.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#F8F7FF] rounded-2xl p-4 border border-[#DDD6FE] space-y-3"
              >
                {/* Original Bullet */}
                {item.originalBullet && (
                  <div className="text-xs text-[#64748B] bg-white p-3 rounded-xl border border-[#DDD6FE]/80">
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-1">Original Resume Bullet:</span>
                    {item.originalBullet}
                  </div>
                )}

                {/* Arrow */}
                <div className="flex items-center justify-center text-[#7C3AED]">
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>

                {/* AI Suggested Bullet */}
                <div className="text-xs text-[#1E1B4B] bg-white p-3.5 rounded-xl border border-[#DDD6FE] shadow-sm relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#7C3AED] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Tailored Action-Oriented Bullet:
                    </span>
                    <button
                      onClick={() => handleCopy(item.suggestedBullet, idx)}
                      className="flex items-center gap-1 text-[11px] text-[#7C3AED] hover:text-[#6D28D9] font-bold cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Bullet
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-semibold leading-relaxed">{item.suggestedBullet}</p>
                  
                  {item.reason && (
                    <p className="text-[11px] text-[#64748B] mt-2 pt-2 border-t border-[#DDD6FE]/60 italic">
                      💡 <strong>Rationale:</strong> {item.reason}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Section Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.skills && (
          <div className="bg-[#F8F7FF] p-4 rounded-2xl border border-[#DDD6FE] text-xs">
            <h5 className="font-bold text-[#7C3AED] mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Skills Section Layout Advice
            </h5>
            <p className="text-[#475569]">{suggestions.skills}</p>
          </div>
        )}

        {suggestions.projects && (
          <div className="bg-[#F8F7FF] p-4 rounded-2xl border border-[#DDD6FE] text-xs">
            <h5 className="font-bold text-[#7C3AED] mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Projects Section Positioning
            </h5>
            <p className="text-[#475569]">{suggestions.projects}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default SuggestionsList;
