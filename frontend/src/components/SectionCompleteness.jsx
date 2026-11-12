import React from 'react';
import { motion } from 'framer-motion';

export default function SectionCompleteness({ data }) {
  if (!data || !data.sections) return null;

  const { completeness_score, sections, missing_critical_sections, completed_count, total_sections_checked, recommendations } = data;

  const scoreColor = completeness_score >= 80 ? 'text-green-500' : completeness_score >= 60 ? 'text-amber-500' : 'text-red-500';
  const progressBg = completeness_score >= 80 ? 'bg-green-500' : completeness_score >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="text-lg font-bold text-slate-800">Resume Section Completeness</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates presence, structure, and depth across essential resume sections
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500">Completeness</div>
            <div className={`text-2xl font-black ${scoreColor}`}>{completeness_score}%</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
            {completed_count}/{total_sections_checked}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completeness_score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${progressBg} rounded-full`}
        />
      </div>

      {/* Critical missing alert */}
      {missing_critical_sections && missing_critical_sections.length > 0 && (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium flex items-start gap-2">
          <span className="text-base">⚠️</span>
          <div>
            <strong>Missing Core Section(s):</strong> {missing_critical_sections.join(', ')}. Recruiters require these sections for standard applicant evaluation.
          </div>
        </div>
      )}

      {/* Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        {sections.map((sec, idx) => {
          const isComplete = sec.status === 'complete';
          const isPartial = sec.status === 'partial';
          const badgeClass = isComplete
            ? 'bg-green-100 text-green-700 border-green-200'
            : isPartial
            ? 'bg-amber-100 text-amber-700 border-amber-200'
            : 'bg-red-100 text-red-700 border-red-200';

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 transition-all flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">{sec.name}</span>
                  {sec.is_critical && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                      Required
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">{sec.details}</div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeClass} shrink-0 capitalize`}>
                {sec.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Suggested Section Improvements</h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

