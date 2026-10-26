import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Sparkles, CheckCircle2 } from 'lucide-react';

const ResumeDetailsView = () => {
  const { currentResume } = useApp();

  if (!currentResume || !currentResume.parsedData) {
    return (
      <div className="bg-white rounded-2xl border border-[#DDD6FE] p-8 text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#1E1B4B]">No Resume Parsed Yet</h3>
        <p className="text-xs text-[#64748B] max-w-sm mx-auto">
          Upload a PDF resume or paste resume text above to extract structured skills, work history, and qualifications using Gemini AI.
        </p>
      </div>
    );
  }

  const data = currentResume.parsedData;

  return (
    <div className="bg-white rounded-2xl border border-[#DDD6FE] p-6 shadow-sm space-y-6">
      
      {/* Resume Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#DDD6FE] gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
            <User className="w-5 h-5 text-[#7C3AED]" />
            {data.fullName || 'Parsed Resume Profile'}
          </h2>
          <p className="text-xs text-[#64748B] flex flex-wrap gap-3 mt-1">
            {data.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#94A3B8]" /> {data.email}</span>}
            {data.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#94A3B8]" /> {data.phone}</span>}
            {data.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#94A3B8]" /> {data.location}</span>}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] text-xs font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> {currentResume.fileName || 'Parsed Resume'}
        </span>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="bg-[#F8F7FF] p-4 rounded-xl border border-[#DDD6FE]">
          <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Parsed Professional Summary
          </h4>
          <p className="text-xs text-[#475569] leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills Matrix */}
      {data.skills && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider flex items-center gap-1.5">
            <Code className="w-4 h-4 text-[#7C3AED]" /> Technical & Soft Skills Extracted
          </h4>
          <div className="flex flex-wrap gap-2">
            {(data.skills.technical || []).map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] text-xs font-semibold">
                {skill}
              </span>
            ))}
            {(data.skills.soft || []).map((skill, idx) => (
              <span key={`soft-${idx}`} className="px-3 py-1 rounded-lg bg-[#F8F7FF] border border-[#DDD6FE] text-[#475569] text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#7C3AED]" /> Extracted Work Experience
          </h4>
          <div className="space-y-3">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="bg-[#F8F7FF] p-4 rounded-xl border border-[#DDD6FE] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-[#1E1B4B] text-sm">{exp.title}</h5>
                    <p className="text-xs text-[#7C3AED] font-medium">{exp.company}</p>
                  </div>
                  {exp.duration && (
                    <span className="text-[11px] bg-white px-2 py-0.5 rounded text-[#64748B] border border-[#DDD6FE]">{exp.duration}</span>
                  )}
                </div>
                {exp.responsibilities && (
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#475569]">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.education && data.education.length > 0 && (
          <div className="bg-[#F8F7FF] p-4 rounded-xl border border-[#DDD6FE] space-y-2">
            <h4 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#7C3AED]" /> Education
            </h4>
            {data.education.map((edu, idx) => (
              <div key={idx} className="text-xs space-y-0.5">
                <div className="font-bold text-[#1E1B4B]">{edu.degree}</div>
                <div className="text-[#64748B]">{edu.institution} ({edu.year})</div>
              </div>
            ))}
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div className="bg-[#F8F7FF] p-4 rounded-xl border border-[#DDD6FE] space-y-2">
            <h4 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-[#7C3AED]" /> Highlighted Projects
            </h4>
            {data.projects.map((proj, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="font-bold text-[#1E1B4B]">{proj.name}</div>
                <p className="text-[#64748B]">{proj.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ResumeDetailsView;
