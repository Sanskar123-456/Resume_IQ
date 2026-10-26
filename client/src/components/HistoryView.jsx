import React from 'react';
import { useApp } from '../context/AppContext';
import { History, Calendar, ExternalLink, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryView = () => {
  const { historyList, loadAnalysisFromHistory } = useApp();

  if (!historyList || historyList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#DDD6FE] p-8 text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#1E1B4B]">No Saved Analyses Yet</h3>
        <p className="text-xs text-[#64748B] max-w-sm mx-auto">
          When you analyze your resume against job postings, your match reports and scores will be stored here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DDD6FE] p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <History className="w-5 h-5 text-[#7C3AED]" />
        <h3 className="text-lg font-bold text-[#1E1B4B]">Saved Application Analyses</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historyList.map((item, idx) => {
          const score = item.score || item.analysisResult?.overallMatchScore || 0;
          let scoreBadge = 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]';
          if (score < 50) scoreBadge = 'bg-rose-50 text-rose-600 border-rose-200';
          else if (score < 75) scoreBadge = 'bg-amber-50 text-amber-600 border-amber-200';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => loadAnalysisFromHistory(item.id)}
              className="bg-[#F8F7FF] rounded-xl p-4 border border-[#DDD6FE] hover:border-[#7C3AED]/60 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md hover:shadow-[#7C3AED]/10 group space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-[#1E1B4B] text-sm group-hover:text-[#7C3AED] transition-colors">
                    {item.jobTitle || 'Target Position'}
                  </h4>
                  <p className="text-xs text-[#64748B]">{item.jobCompany || 'Company'}</p>
                </div>

                <div className={`px-2.5 py-1 rounded-full border text-xs font-extrabold flex items-center gap-1 ${scoreBadge}`}>
                  <Trophy className="w-3.5 h-3.5" />
                  {score}%
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#DDD6FE]/70">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#94A3B8]" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="text-[#7C3AED] font-medium group-hover:underline flex items-center gap-1">
                  View Full Report <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;
